import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SkeletonCatalog from "../components/SkeletonCatalog";
import Header from "../components/header";
import Sidebar from "../components/sidebar";
import type { ApiError, CatalogBook, User } from "../types";
import type { components } from "../types/api";

type CatalogPage = components["schemas"]["CatalogPage"];

type Filters = {
  niveau: string[];
  type: string[];
  thema: string[];
};


const LIMIT = 6;
const EMPTY_FILTERS: Filters = { niveau: [], type: [], thema: [] };

const TYPES = [
  "Boek",
  "Boek - thriller",
  "Boek - roman",
  "tijdschrift",
  "krant (papier)",
  "digitale krant",
  "online artikel",
  "dichtbundel",
  "blogpost",
];

const NIVEAUS = ["2F", "3F", "3F+", "2F-3F"];

const THEMAS = [
  "WOII", "onderduik", "spanning", "stalking", "liefde", "relaties", "ontmoeting",
  "verbondenheid", "geheimen", "schuld", "familie", "humor", "reizen", "herinneringen",
  "hoop", "inzicht", "oorlog", "verlies", "identiteit", "zelfreflectie", "creativiteit",
  "doorzetten", "cultuur", "moraal", "ziekte", "zorg", "opvoeding", "ervaringen",
  "mysterie", "detective", "ontwikkeling", "veerkracht", "vriendschap", "groei",
  "groepsdruk", "macht", "gender", "sport", "criminaliteit", "jongeren", "levenslessen",
  "onderzoek", "samenleving", "welzijn", "recht", "burgerschap", "thriller",
];

export default function Catalog() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [books, setBooks] = useState<CatalogBook[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isStudent, setIsStudent] = useState(false);
  const [selectedBook, setSelectedBook] = useState<CatalogBook | null>(null);

  // `filters` is wat de gebruiker kiest, `appliedFilters` is wat daadwerkelijk wordt gezocht
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(EMPTY_FILTERS);

  // Alleen leerlingen krijgen de knop om aan de leeslijst toe te voegen
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return;

    try {
      const user: User = JSON.parse(stored);
      setIsStudent(user.role === "student");
    } catch {
      setIsStudent(false);
    }
  }, []);

  // Catalogus ophalen bij een andere pagina of andere zoekfilters
  useEffect(() => {
    let cancelled = false;

    async function fetchCatalog() {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({ page: String(page) });
Object.entries(appliedFilters).forEach(([key, values]) => {
  values.forEach(v => params.append(key, v));
});


      try {
        const res = await fetch(`http://localhost:8080/catalog?${params.toString()}`);
        if (!res.ok) throw new Error(`Status ${res.status}`);

        const data: CatalogPage = await res.json();
        if (cancelled) return;

        setBooks(data.books);
        setTotal(data.total);
      } catch (err) {
        console.error("Fout bij ophalen catalogus:", err);
        if (!cancelled) setError("De catalogus kon niet worden geladen. Probeer het later opnieuw.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchCatalog();

    // Voorkomt dat een oud antwoord een nieuw antwoord overschrijft
    return () => {
      cancelled = true;
    };
  }, [page, appliedFilters]);

  function applyFilters() {
    setAppliedFilters({ ...filters });
    setPage(1);
  }

  function resetFilters() {
    setFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
    setPage(1);
  }

  // Toevoegen aan de leeslijst: de backend haalt het leerling-id uit het token
  async function addToLeeslijst(book: CatalogBook) {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/profiel/login");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/leeslijst`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ _id: book._id }),
      });

      if (res.status === 401) {
        localStorage.clear();
        router.push("/profiel/login");
        return;
      }

      if (res.status === 409) {
        alert("Dit boek staat al in je leeslijst");
        return;
      }

      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as Partial<ApiError>;
        alert(err.error || "Toevoegen mislukt");
        return;
      }

      alert(`${book.Titel} is toegevoegd aan je leeslijst`);
    } catch (err) {
      console.error("Fout bij toevoegen aan leeslijst:", err);
      alert("Server niet bereikbaar.");
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <div>
      <Sidebar />

      <main className="content">
        <Header />

        <h2>Catalogus</h2>
        <p>Totaal aantal titels: {total}</p>
        <p>Blader door alle beschikbare titels.</p>

<div className="filters">

 {/* TYPE FILTER */}
<div className="filter-group">
  <strong>Type</strong>
  <div className="type-scroll">
    {TYPES.map((t) => (
      <label key={t} className="checkbox-item">
        <input
          type="checkbox"
          checked={filters.type.includes(t)}
          onChange={(e) => {
            if (e.target.checked) {
              setFilters({ ...filters, type: [...filters.type, t] });
            } else {
              setFilters({
                ...filters,
                type: filters.type.filter((x) => x !== t),
              });
            }
          }}
        />
        {t}
      </label>
    ))}
  </div>
</div>

{/* NIVEAU FILTER */}
<div className="filter-group">
  <strong>Niveau</strong>
  <div className="niveau-scroll">
    {NIVEAUS.map((n) => (
      <label key={n} className="checkbox-item">
        <input
          type="checkbox"
          checked={filters.niveau.includes(n)}
          onChange={(e) => {
            if (e.target.checked) {
              setFilters({ ...filters, niveau: [...filters.niveau, n] });
            } else {
              setFilters({
                ...filters,
                niveau: filters.niveau.filter((x) => x !== n),
              });
            }
          }}
        />
        {n}
      </label>
    ))}
  </div>
</div>

{/* THEMA FILTER */}
<div className="filter-group">
  <strong>Thema</strong>
  <div className="thema-scroll">
    {THEMAS.map((t) => (
      <label key={t} className="checkbox-item">
        <input
          type="checkbox"
          checked={filters.thema.includes(t)}
          onChange={(e) => {
            if (e.target.checked) {
              setFilters({ ...filters, thema: [...filters.thema, t] });
            } else {
              setFilters({
                ...filters,
                thema: filters.thema.filter((x) => x !== t),
              });
            }
          }}
        />
        {t}
      </label>
    ))}
  </div>
</div>

  <button className="btn-small" onClick={applyFilters}>
    Filteren
  </button>

  <button className="btn-small secondary" onClick={resetFilters}>
    Reset
  </button>
</div>


        {loading && <SkeletonCatalog />}

        {!loading && error && <p role="alert">{error}</p>}

        {!loading && !error && books.length === 0 && (
          <p>Geen titels gevonden voor deze filters.</p>
        )}

        {!loading && !error && books.length > 0 && (
          <>
            <div className="pagination">
              <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
                Vorige
              </button>

              <span>
                Pagina {page} van {totalPages}
              </span>

              <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                Volgende
              </button>
            </div>

            <div className="catalog-grid">
              {books.map((book) => (
                <div key={book._id} className="catalog-card">
                  <div className="card-header">
                    <h3>{book.Titel}</h3>
                    {isStudent && (
                      <button
                        className="add-btn"
                        aria-label={`Voeg ${book.Titel} toe aan je leeslijst`}
                        onClick={() => addToLeeslijst(book)}
                      >
                        +
                      </button>
                    )}
                  </div>

                  <p className="author">{book.Auteur}</p>

                  <div className="meta">
                    <span>
                      <strong>Type:</strong> {book.type}
                    </span>
                    <span>
                      <strong>Niveau:</strong> {book.niveau}
                    </span>
                    <span>
                      <strong>Thema:</strong>{" "}
                      {book.thema
                        ? book.thema
                            .split(/[,;]+/)
                            .map((t) => t.trim())
                            .filter(Boolean)
                            .join(", ")
                        : "Geen thema"}
                    </span>
                  </div>

                  <p className="description">{book.beschrijving}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {selectedBook && (
          <div className="popup">
            <div className="popup-content">
              <h3>{selectedBook.Titel}</h3>
              <p>{selectedBook.beschrijving}</p>

              <button onClick={() => setSelectedBook(null)}>Sluiten</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
