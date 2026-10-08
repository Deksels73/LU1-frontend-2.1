import { useEffect, useState } from "react";
import SkeletonCatalog from "../components/SkeletonCatalog";
import Header from "../components/header";
import Sidebar from "../components/sidebar";

export default function Catalog() {
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 6;
  const [selectedBook, setSelectedBook] = useState(null);

const [filters, setFilters] = useState({
  niveau: "",
  type: "",
  thema: ""
});


  // ⭐ FILTER FUNCTIES BUITEN useEffect
  function applyFilters() {
setPage(1);
fetchCatalog();

  }

  function resetFilters() {
setFilters({ niveau: "", type: "", thema: ""});
setPage(1);
fetchCatalog();

  }

async function fetchCatalog() {
  setLoading(true);

  const query = new URLSearchParams({
    page: page.toString(),
    niveau: filters.niveau,
    type: filters.type,
    thema: filters.thema

  }).toString();

  const res = await fetch(`http://localhost:8080/catalog?${query}`);
  const data = await res.json();

  setBooks(data.books);
  setTotal(data.total);
  setLoading(false);
}


  useEffect(() => {
    fetchCatalog();
  }, [page]);

  const totalPages = Math.ceil(total / limit);

   const [studentId, setStudentId] = useState<string | null>(null);
useEffect(() => {
  const stored = localStorage.getItem("user");
  if (!stored) return;

  const user = JSON.parse(stored);
  setStudentId(user.id);
}, []);


  // ⭐ TOEVOEGEN AAN LEESLIJST
  async function addToLeeslijst(book) {
  if (!studentId) {
    alert("Geen student ID gevonden. Log opnieuw in.");
    return;
  }

  const payload = {
    _id: book._id || book.id,
    Titel: book.Titel,
    Auteur: book.Auteur,
    beschrijving: book.beschrijving,
    type: book.type,
    niveau: book.niveau,
    thema: Array.isArray(book.thema)
      ? book.thema.join(",")
      : book.thema || ""
  };

  const res = await fetch(`http://localhost:8080/leeslijst/${studentId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
   if (res.status === 409) {
    alert("Dit boek staat al in je leeslijst");
    return;
  }

  if (!res.ok) {
    console.error(await res.text());
    alert("Toevoegen mislukt");
    return;
  }



  alert(`${book.Titel} is toegevoegd aan je leeslijst`);
}


  return (
    <div>
      <Sidebar />

      <main className="content">
        <Header />

        <h2>Catalogus</h2>
        <p>Totaal aantal titels: {total}</p>
        <p>Blader door alle beschikbare titels.</p>

        {loading && <SkeletonCatalog />}
<div className="filters">

  {/* TYPE MATERIAAL */}
  <select
    value={filters.type}
    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
  >
    <option value="">Type...</option>
    <option value="Boek">Boek</option>
    <option value="Boek - thriller">Boek - thriller</option>
    <option value="Boek - roman">Boek - roman</option>
    <option value="tijdschrift">tijdschrift</option>
    <option value="krant (papier)">krant (papier)</option>
    <option value="digitale krant">digitale krant</option>
    <option value="online artikel">online artikel</option>
    <option value="dichtbundel">dichtbundel</option>
    <option value="blogpost">blogpost</option>
  </select>

  {/* NIVEAU */}
  <select
    value={filters.niveau}
    onChange={(e) => setFilters({ ...filters, niveau: e.target.value })}
  >
    <option value="">Niveau...</option>
    <option value="2F">2F</option>
    <option value="3F">3F</option>
    <option value="3F+">3F+</option>
    <option value="2F-3F">2F-3F</option>
  </select>

  {/* THEMA */}
  <select
    value={filters.thema}
    onChange={(e) => setFilters({ ...filters, thema: e.target.value })}
  >
    <option value="">Thema...</option>
    <option value="WOII">WOII</option>
    <option value="onderduik">onderduik</option>
    <option value="spanning">spanning</option>
    <option value="stalking">stalking</option>
    <option value="liefde">liefde</option>
    <option value="relaties">relaties</option>
    <option value="ontmoeting">ontmoeting</option>
    <option value="verbondenheid">verbondenheid</option>
    <option value="geheimen">geheimen</option>
    <option value="schuld">schuld</option>
    <option value="familie">familie</option>
    <option value="humor">humor</option>
    <option value="reizen">reizen</option>
    <option value="herinneringen">herinneringen</option>
    <option value="hoop">hoop</option>
    <option value="inzicht">inzicht</option>
    <option value="oorlog">oorlog</option>
    <option value="verlies">verlies</option>
    <option value="identiteit">identiteit</option>
    <option value="zelfreflectie">zelfreflectie</option>
    <option value="creativiteit">creativiteit</option>
    <option value="doorzetten">doorzetten</option>
    <option value="cultuur">cultuur</option>
    <option value="moraal">moraal</option>
    <option value="ziekte">ziekte</option>
    <option value="zorg">zorg</option>
    <option value="opvoeding">opvoeding</option>
    <option value="ervaringen">ervaringen</option>
    <option value="mysterie">mysterie</option>
    <option value="detective">detective</option>
    <option value="ontwikkeling">ontwikkeling</option>
    <option value="veerkracht">veerkracht</option>
    <option value="vriendschap">vriendschap</option>
    <option value="groei">groei</option>
    <option value="groepsdruk">groepsdruk</option>
    <option value="macht">macht</option>
    <option value="gender">gender</option>
    <option value="sport">sport</option>
    <option value="criminaliteit">criminaliteit</option>
    <option value="jongeren">jongeren</option>
    <option value="levenslessen">levenslessen</option>
    <option value="onderzoek">onderzoek</option>
    <option value="samenleving">samenleving</option>
    <option value="welzijn">welzijn</option>
    <option value="recht">recht</option>
    <option value="burgerschap">burgerschap</option>
    <option value="thriller">thriller</option>

  </select>

  <button className="btn-small" onClick={applyFilters}>Filteren</button>
  <button className="btn-small secondary" onClick={resetFilters}>Reset</button>
</div>
        {!loading && (
<div className="pagination">
  <button disabled={page === 1} onClick={() => setPage(page - 1)}>
    Vorige
  </button>

  <span>Pagina {page} van {totalPages}</span>

  <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
    Volgende
  </button>
</div>

        )}

        {!loading && (

<div className="catalog-grid">
  {books.map(book => (
    <div key={book._id} className="catalog-card">

      <div className="card-header">
        <h3>{book.Titel}</h3>
        <button className="add-btn" onClick={() => addToLeeslijst(book)}>+</button>
      </div>

      <p className="author">{book.Auteur}</p>

      <div className="meta">
        <span><strong>Type:</strong> {book.type}</span>
        <span><strong>Niveau:</strong> {book.niveau}</span>
        <span><strong>Thema:</strong> {
  Array.isArray(book.thema)
    ? book.thema.join(", ")
    : typeof book.thema === "string"
      ? book.thema.split(/[,;]+/).join(", ")
      : "Geen thema"
}</span>

      </div>

      <p className="description">
        {book.beschrijving}
      </p>

    </div>
  ))}
</div>


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
