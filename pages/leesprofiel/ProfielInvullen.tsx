import Sidebar from "../../components/sidebar";
import Header from "../../components/header";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

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

export default function ReadingProfile() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [draftLoaded, setDraftLoaded] = useState(false);

  // 1. Draft laden
  useEffect(() => {
    const savedDraft = localStorage.getItem("leesprofielDraft");
    if (savedDraft) {
      try {
        setForm(JSON.parse(savedDraft));
      } catch {
        // kapotte draft negeren
      }
    }
    setDraftLoaded(true);
  }, []);

  // 2. Draft opslaan bij elke wijziging (pas nadat de draft is geladen)
  useEffect(() => {
    if (!draftLoaded) return;
    localStorage.setItem("leesprofielDraft", JSON.stringify(form));
  }, [form, draftLoaded]);

  function handleChange(
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // 3. Validatie
    if (
      form.genre.length === 0 ||
      form.onderwerp.length === 0 ||
      !form.niveau ||
      !form.lengte ||
      !form.leesdoel
    ) {
      alert("Alle verplichte velden moeten ingevuld worden.");
      return;
    }

    // 4. Token ophalen
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/profiel/login");
      return;
    }

    // 5. Opslaan (het studentId komt uit het token, niet meer uit de URL)
    try {
      const res = await fetch("http://localhost:8080/leesprofiel", {
        method: "POST",
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

      alert("Leesprofiel opgeslagen!");

      // 6. Draft verwijderen
      localStorage.removeItem("leesprofielDraft");

      router.push("/leesprofiel/ProfielBekijken");
    } catch (err) {
      console.error("Fout bij opslaan leesprofiel:", err);
      alert("Server niet bereikbaar.");
    }
  }

  return (
    <div>
      <Sidebar />

      <main className="content">
        <Header />

        <div className="center-wrapper">
          <h2>Leesprofiel invullen</h2>
          <p>Vul je voorkeuren in zodat we een persoonlijk leesadvies kunnen geven.</p>

          <form onSubmit={handleSubmit} className="card">
            {/* GENRE */}
            <label>
              <strong>Genre</strong>
            </label>
            <p className="field-info">
              Kies het genre dat het beste past bij jouw leesvoorkeur.
            </p>
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
              <strong>Niveau (moeilijkheid)</strong>
            </label>
            <p className="field-info">
              Dit bepaalt wat haalbaar is. Kies hoe moeilijk de tekst mag zijn.
            </p>
            <select name="niveau" required value={form.niveau} onChange={handleChange}>
              <option value="">Kies een niveau...</option>
              <option value="F2">F2 (makkelijk)</option>
              <option value="F2-F3">F2-F3 (tussenin)</option>
              <option value="F3">F3 (gemiddeld)</option>
              <option value="F3+">F3+ (moeilijk)</option>
            </select>

            {/* LENGTE */}
            <label>
              <strong>Lengte van de tekst</strong>
            </label>
            <p className="field-info">
              Dit voorkomt dat je een te lang of te kort boek krijgt.
            </p>
            <select name="lengte" required value={form.lengte} onChange={handleChange}>
              <option value="">Kies een lengte...</option>
              <option value="kort">Kort</option>
              <option value="gemiddeld">Gemiddeld</option>
              <option value="lang">Lang</option>
            </select>

            {/* LEESDOEL */}
            <label>
              <strong>Wat is jouw leesdoel?</strong>
            </label>
            <p className="field-info">
              Vertel kort wat je hoopt te bereiken met lezen. Bijvoorbeeld: meer
              leesplezier, beter worden in begrijpend lezen, ontspanning, nieuwe
              werelden ontdekken, enzovoort.
            </p>
            <textarea
              name="leesdoel"
              required
              value={form.leesdoel}
              onChange={handleChange}
              placeholder="Schrijf hier jouw leesdoel..."
              className="textarea-field"
            />

            <button className="btn" type="submit">
              Opslaan
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
