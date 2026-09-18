import { useEffect, useState } from "react";
import SkeletonCatalog from "../components/SkeletonCatalog";
import Header from "../components/header";
import Sidebar from "../components/sidebar";

export default function Catalog() {
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;
  const [selectedBook, setSelectedBook] = useState(null);


  useEffect(() => {
    async function fetchCatalog() {
      setLoading(true);

      const res = await fetch(`http://localhost:8080/catalog?page=${page}`);
      const data = await res.json();

      setBooks(data.books);
      setTotal(data.total);
      setLoading(false);
    }

    fetchCatalog();
  }, [page]);

  const totalPages = Math.ceil(total / limit);

async function addToLeeslijst(book) {
  const studentId = "student123"; // tijdelijk, tot login werkt

  await fetch(`http://localhost:8080/leeslijst/${studentId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book)
  });

  alert(`${book.Titel} is toegevoegd aan je leeslijst`);
}



  return (
    <div>
      <Sidebar />

      <main className="content">
        <Header />

        <h2>Catalogus</h2>
        <p>Blader door alle beschikbare titels.</p>

        {loading && <SkeletonCatalog />}

        {!loading && (
<table className="catalog-table">
  <thead>
    <tr>
      <th></th> {/* plus-knop kolom */}
      <th>Titel</th>
      <th>Auteur</th>
      <th>Type</th>
      <th>Niveau</th>
      <th>Thema</th>
      <th></th> {/* beschrijving-knop */}
    </tr>
  </thead>

  <tbody>
    {books.map((book, index) => (
      <tr key={index}>
        {/* PLUS KNOP */}
        <td>
          <button className="btn-small add-btn" onClick={() => addToLeeslijst(book)}>
            +
          </button>
        </td>

        {/* GEGEVENS */}
        <td>{book.Titel}</td>
        <td>{book.Auteur}</td>
        <td>{book.type}</td>
        <td>{book.niveau}</td>
        <td>{book.thema}</td>

        {/* BESCHRIJVING */}
        <td>
          <button className="btn-small" onClick={() => setSelectedBook(book)}>
            Beschrijving
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>


        )}

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
