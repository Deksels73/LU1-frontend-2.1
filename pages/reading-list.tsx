import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import Header from "../components/header";

export default function ReadingList() {
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);

  // Simpele mock: later vervang je dit door echte login
  const studentId = "student123";

  useEffect(() => {
    async function fetchLeeslijst() {
      const res = await fetch(`http://localhost:8080/leeslijst/${studentId}`);
      const data = await res.json();

      setBooks(data.books || []);
      setLoading(false);   // ← DIT ontbrak!
    }

    fetchLeeslijst();
  }, []);

  async function removeBook(id: string) {
    await fetch(`http://localhost:8080/leeslijst/${studentId}/${id}`, {
      method: "DELETE",
    });

    setBooks(books.filter((b) => b._id !== id));
  }

  async function toggleGelezen(id: string, gelezen: boolean) {
await fetch(`http://localhost:8080/leeslijst/${studentId}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gelezen: !gelezen }),
    });

    setBooks(
      books.map((b) =>
        b._id === id ? { ...b, gelezen: !gelezen } : b
      )
    );
  }

  return (
    <div>
      <Sidebar />

      <main className="content">
        <Header />

        <h2>Mijn leeslijst</h2>
        <p>Alle boeken die jij hebt toegevoegd.</p>

        {loading && <p>Loading...</p>}

        {!loading && (
          <table className="catalog-table">
            <thead>
              <tr>
                <th>Titel</th>
                <th>Auteur</th>
                <th>Type</th>
                <th>Niveau</th>
                <th>Thema</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {books.map((book) => (
                <tr key={book._id}>
                  <td>{book.Titel}</td>
                  <td>{book.Auteur}</td>
                  <td>{book.type}</td>
                  <td>{book.niveau}</td>
                  <td>{book.thema}</td>

                  <td>
                    <button
                      className="btn-small"
                      onClick={() => toggleGelezen(book._id, book.gelezen)}
                    >
                      {book.gelezen ? "Gelezen" : "Niet gelezen"}
                    </button>
                  </td>

                  <td>
                    <button
                      className="btn-small remove-btn"
                      onClick={() => removeBook(book._id)}
                    >
                      Verwijder
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
