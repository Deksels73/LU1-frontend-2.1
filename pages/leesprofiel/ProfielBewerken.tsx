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
  "historisch",
  "thriller",
  "romantiek",
  "literair",
  "cultuur",
  "young-adult",
  "avontuur",
  "humor",
  "non-fictie",
];

const ONDERWERPEN = [
  "WOII",
  "spanning",
  "liefde",
  "relaties",
  "familie",
  "humor",
  "reizen",
  "verlies",
  "identiteit",
  "vriendschap",
  "ontwikkeling",
  "mysterie",
  "detective",
  "cultuur",
  "jongeren",
  "groei",
  "geluk",
  "welzijn",
  "recht",
  "burgerschap",
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
      </main>

      <div className="center-wrapper">
        <h2>Leesprofiel bewerken</h2>
        <p>Pas je voorkeuren aan. Vergeet niet op te slaan.</p>

        <form onSubmit={handleSubmit} className="card">
          {/* GENRE */}
          <label>
            <strong>Genre</strong>
          </label>
          <div className="block-group">
            {GENRES.map((item) => (
              <div
                key={item}
                className={`select-block ${form.genre.includes(item) ? "selected" : ""}`}
                role="button"
                aria-pressed={form.genre.includes(item)}
                tabIndex={0}
                onClick={() => toggleSelection("genre", item)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    toggleSelection("genre", item);
                  }
                }}
              >
                {item}
              </div>
            ))}
          </div>

          {/* ONDERWERP */}
          <label>
            <strong>Onderwerp</strong>
          </label>
          <div className="block-group">
            {ONDERWERPEN.map((item) => (
              <div
                key={item}
                className={`select-block ${form.onderwerp.includes(item) ? "selected" : ""}`}
                role="button"
                aria-pressed={form.onderwerp.includes(item)}
                tabIndex={0}
                onClick={() => toggleSelection("onderwerp", item)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    toggleSelection("onderwerp", item);
                  }
                }}
              >
                {item}
              </div>
            ))}
          </div>

          {/* NIVEAU */}
          <label>
            <strong>Niveau</strong>
          </label>
          <select name="niveau" value={form.niveau} onChange={handleChange}>
            <option value="">Kies een niveau...</option>
            <option value="F2">F2</option>
            <option value="F2-F3">F2-F3</option>
            <option value="F3">F3</option>
            <option value="F3+">F3+</option>
          </select>

          {/* LENGTE */}
          <label>
            <strong>Lengte</strong>
          </label>
          <select name="lengte" value={form.lengte} onChange={handleChange}>
            <option value="">Kies een lengte...</option>
            <option value="kort">Kort</option>
            <option value="gemiddeld">Gemiddeld</option>
            <option value="lang">Lang</option>
          </select>

          {/* LEESDOEL */}
          <label>
            <strong>Leesdoel</strong>
          </label>
          <textarea
            name="leesdoel"
            value={form.leesdoel}
            onChange={handleChange}
            placeholder="Schrijf hier jouw leesdoel..."
          />

          <button className="btn" type="submit">
            Opslaan
          </button>
        </form>

        <button className="btn cancel" type="button" onClick={handleCancel}>
          Annuleren
        </button>
      </div>
    </div>
  );
}
