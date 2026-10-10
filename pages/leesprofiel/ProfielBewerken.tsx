import Sidebar from "../../components/sidebar";
import Header from "../../components/header";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import type { Leesprofiel, LeesprofielInput, LeesprofielForm } from "../../types";


type FormState = {
  genre: string[];
  onderwerp: string[];
  niveau: string;
  lengte: string;
  leesdoel: string;
};

const EMPTY_FORM: FormState = {
  genre: [],
  onderwerp: [],
  niveau: "",
  lengte: "",
  leesdoel: "",
};

const GENRES = [
"biografie", "criminaliteit", "detective", "filosofie", "geheimen", "geluk",
  "humor", "huiselijk geweld", "identiteit", "liefde", "macht", "migratie",
  "moederschap", "mysterie", "onderwijs", "ontmoeting", "oorlog", "recht",
  "reizen", "rouw", "spanning", "sport", "thriller", "veerkracht",
  "vriendschap", "WOII", "ziekte"
];

const ONDERWERPEN = [
"bedrog", "burgerschap", "creativiteit", "cultuur", "doorzetten", "eten",
  "ervaringen", "familie", "gender", "groepsdruk", "groei", "herinneringen",
  "hoop", "inzicht", "jongeren", "moraal", "onderduik", "onderzoek",
  "ontwikkeling", "opgroeien", "opvoeding", "relaties", "samenleven",
  "schuld", "stalking", "verbondenheid", "verlies", "welzijn", "zingeving",
  "zorg"
];

export default function ProfielBewerken() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [original, setOriginal] = useState<FormState | null>(null);

  // Na het opslaan mag de "niet opgeslagen wijzigingen"-waarschuwing niet meer verschijnen
  const skipGuard = useRef(false);

  // 1. Profiel ophalen met token (het id komt uit het token)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/profiel/login");
      return;
    }

    fetch("http://localhost:8080/leesprofiel", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.clear();
          router.push("/profiel/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && !data.error) {
          const profiel: FormState = {
            genre: data.genre ?? [],
            onderwerp: data.onderwerp ?? [],
            niveau: data.niveau ?? "",
            lengte: data.lengte ?? "",
            leesdoel: data.leesdoel ?? "",
          };
          setForm(profiel);
          setOriginal(profiel);
        }
      })
      .catch((err) => console.error("Fout bij ophalen leesprofiel:", err));
  }, []);

  // 2. Input handler
  function handleChange(
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // 3. Toggle blokken
  function toggleSelection(field: "genre" | "onderwerp", value: string) {
    setForm((prev) => {
      const alreadySelected = prev[field].includes(value);

      return {
        ...prev,
        [field]: alreadySelected
          ? prev[field].filter((v) => v !== value)
          : [...prev[field], value],
      };
    });
  }

  // 4. Check wijzigingen
  function hasChanges() {
    if (skipGuard.current) return false;
    return JSON.stringify(form) !== JSON.stringify(original);
  }

  // 5. Waarschuwing bij verlaten pagina (tab sluiten / verversen)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges()) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [form, original]);

  // 6. Waarschuwing bij navigeren binnen de app
  useEffect(() => {
    const handleRouteChange = () => {
      if (hasChanges()) {
        const confirmLeave = confirm(
          "Je hebt wijzigingen die niet zijn opgeslagen. Wil je deze annuleren?"
        );

        if (!confirmLeave) {
          router.events.emit("routeChangeError");
          throw "routeChange aborted.";
        }
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [form, original]);

  // 7. Annuleren
  function handleCancel() {
    if (hasChanges()) {
      const confirmLeave = confirm(
        "Je hebt wijzigingen die niet zijn opgeslagen. Wil je deze annuleren?"
      );
      if (!confirmLeave) return;
    }

    skipGuard.current = true;
    router.push("/leesprofiel/ProfielBekijken");
  }

  // 8. Opslaan (PUT met token)
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/profiel/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/leesprofiel", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.status === 401) {
        localStorage.clear();
        router.push("/profiel/login");
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Opslaan mislukt");
        return;
      }

      skipGuard.current = true;
      setOriginal(form);
      alert("Wijzigingen opgeslagen!");
      router.push("/leesprofiel/ProfielBekijken");
    } catch (err) {
      console.error("Fout bij opslaan:", err);
      alert("Server niet bereikbaar.");
    }
  }

  return (
    <div>
      <Sidebar />
      <main className="content">
        <Header />
      

      <div className="center-wrapper">
        <h2>Leesprofiel bewerken</h2>
        <p>Pas je voorkeuren aan. Vergeet niet op te slaan.</p>

<form onSubmit={handleSubmit} className="form-card">

  {/* GENRE */}
  <div className="form-section">
    <label><strong>Genre</strong></label>
    <p className="field-info">Kies het genre dat het beste past bij jouw leesvoorkeur.</p>

    <div className="block-group">
      {GENRES.map((item) => (
        <div
          key={item}
          className={`select-block ${form.genre.includes(item) ? "selected" : ""}`}
          role="button"
          aria-pressed={form.genre.includes(item)}
          tabIndex={0}
          onClick={() => toggleSelection("genre", item)}
        >
          {item}
        </div>
      ))}
    </div>
  </div>

  {/* ONDERWERP */}
  <div className="form-section">
    <label><strong>Onderwerp</strong></label>
    <p className="field-info">Kies een onderwerp dat je interessant vindt.</p>

    <div className="block-group">
      {ONDERWERPEN.map((item) => (
        <div
          key={item}
          className={`select-block ${form.onderwerp.includes(item) ? "selected" : ""}`}
          role="button"
          aria-pressed={form.onderwerp.includes(item)}
          tabIndex={0}
          onClick={() => toggleSelection("onderwerp", item)}
        >
          {item}
        </div>
      ))}
    </div>
  </div>

  {/* NIVEAU */}
  <div className="form-section">
    <label><strong>Niveau (moeilijkheid)</strong></label>
    <p className="field-info">Dit bepaalt wat haalbaar is. Kies hoe moeilijk de tekst mag zijn.</p>

    <select name="niveau" value={form.niveau} onChange={handleChange}>
      <option value="">Kies een niveau...</option>
      <option value="F2">F2</option>
      <option value="F2-F3">F2-F3</option>
      <option value="F3">F3</option>
      <option value="F3+">F3+</option>
    </select>
  </div>

  {/* LENGTE */}
  <div className="form-section">
    <label><strong>Lengte van de tekst</strong></label>
    <p className="field-info">Dit voorkomt dat je een te lang of te kort boek krijgt.</p>

    <select name="lengte" value={form.lengte} onChange={handleChange}>
      <option value="">Kies een lengte...</option>
      <option value="kort">Kort</option>
      <option value="gemiddeld">Gemiddeld</option>
      <option value="lang">Lang</option>
    </select>
  </div>

  {/* LEESDOEL */}
  <div className="form-section">
    <label><strong>Wat is jouw leesdoel?</strong></label>
    <p className="field-info">
      Vertel kort wat je hoopt te bereiken met lezen. Bijvoorbeeld: meer leesplezier,
      beter worden in begrijpend lezen, ontspanning, nieuwe werelden ontdekken, enzovoort.
    </p>

    <textarea
      name="leesdoel"
      value={form.leesdoel}
      onChange={handleChange}
      placeholder="Schrijf hier jouw leesdoel..."
      className="textarea-field"
    />
  </div>

  <button className="btn" type="submit">Opslaan</button>
</form>


        <button className="btn cancel" type="button" onClick={handleCancel}>
          Annuleren
        </button>
      </div>
      </main>
    </div>
    
  );
}
