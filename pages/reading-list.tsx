// import { useEffect, useState } from "react";
// import Sidebar from "../components/sidebar";
// import Header from "../components/header";

// export default function Leeslijst() {
//   const [studentId, setStudentId] = useState<number | null>(null);
//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ⭐ 1. User ophalen uit localStorage
//   useEffect(() => {
//     const stored = localStorage.getItem("user");
//     if (!stored) return;

//     const user = JSON.parse(stored);
//     console.log("user.id =", user.id);

//     setStudentId(user.id);
//   }, []);

//   // ⭐ 2. Leeslijst ophalen zodra studentId bekend is
//   useEffect(() => {
//     if (!studentId) return;

//     fetch(`http://localhost:8080/leeslijst/${studentId}`)
//       .then(res => res.json())
//       .then(data => {
//         setBooks(data.books);
//         setLoading(false);
//       });
//   }, [studentId]);

//   // ⭐ 3. Boek verwijderen
//   async function deleteBook(id: string) {
//     await fetch(`http://localhost:8080/leeslijst/${studentId}/${id}`, {
//       method: "DELETE"
//     });
//     // opnieuw laden
//     fetch(`http://localhost:8080/leeslijst/${studentId}`)
//       .then(res => res.json())
//       .then(data => setBooks(data.books));
//   }

//   // ⭐ 4. Gelezen togglen
//   async function toggleGelezen(id: string, gelezen: boolean) {
//     await fetch(`http://localhost:8080/leeslijst/${studentId}/${id}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ gelezen })
//     });

//     fetch(`http://localhost:8080/leeslijst/${studentId}`)
//       .then(res => res.json())
//       .then(data => setBooks(data.books));
//   }

//   if (loading) return <p>Bezig met laden...</p>;

//   return (
//   <div>
//     <Sidebar />
//     <main className="content">
//       <Header />
//     </main>

//     <div className="page-wrapper">
//       <h1>Mijn Leeslijst</h1>

//       {books.length === 0 && <p>Je hebt nog geen boeken in je leeslijst.</p>}

//       <ul className="leeslijst-ul">
//         {books.map(book => (
//           <li key={book.id} className="leeslijst-item">
//             <h2>{book.book.Titel}</h2>
//             <p><strong>Auteur:</strong> {book.book.Auteur}</p>
//             <p><strong>Niveau:</strong> {book.book.niveau}</p>
//             <p><strong>Thema:</strong> {book.book.thema}</p>
//             <p>{book.book.beschrijving}</p>

//             <label className="leeslijst-checkbox">
//               <input
//                 type="checkbox"
//                 checked={book.gelezen}
//                 onChange={(e) => toggleGelezen(book.id, e.target.checked)}
//               />
//               Gelezen
//             </label>

//             <button
//               className="leeslijst-delete-btn"
//               onClick={() => deleteBook(book.id)}
//             >
//               Verwijderen
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   </div>
// );
// }
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "../components/sidebar";
import Header from "../components/header";
import SkeletonLeeslijst from "../components/SkeletonLeeslijst";

const API_URL = "http://localhost:8080";

export default function Leeslijst() {
  const router = useRouter();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Eén plek voor het token en de 401-afhandeling
  async function authFetch(path: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/profiel/login");
      return null;
    }

    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        Authorization: `Bearer ${token}`,
      },
    });

    // Token ongeldig of verlopen
    if (res.status === 401) {
      localStorage.clear();
      router.push("/profiel/login");
      return null;
    }

    return res;
  }

  // 1. Leeslijst ophalen
  async function loadBooks() {
    try {
      const res = await authFetch("/leeslijst");
      if (!res) return;

      const data = await res.json();
      setBooks(data.books ?? []);
    } catch (err) {
      console.error("Fout bij ophalen leeslijst:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBooks();
  }, []);

  // 2. Boek verwijderen
  async function deleteBook(id: string) {
    try {
      const res = await authFetch(`/leeslijst/${id}`, { method: "DELETE" });
      if (!res) return;

      await loadBooks();
    } catch (err) {
      console.error("Fout bij verwijderen:", err);
    }
  }

  // 3. Gelezen togglen
  async function toggleGelezen(id: string, gelezen: boolean) {
    try {
      const res = await authFetch(`/leeslijst/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ gelezen }),
      });
      if (!res) return;

      await loadBooks();
    } catch (err) {
      console.error("Fout bij bijwerken:", err);
    }
  }

  if (loading) return <SkeletonLeeslijst />;

  return (
    <div>
      <Sidebar />
      <main className="content">
        <Header />
      </main>

      <div className="page-wrapper">
        <h1>Mijn Leeslijst</h1>

        {books.length === 0 && <p>Je hebt nog geen boeken in je leeslijst.</p>}

        <ul className="leeslijst-ul">
          {books.map((book) => (
            <li key={book.id} className="leeslijst-item">
              <h2>{book.book.Titel}</h2>
              <p>
                <strong>Auteur:</strong> {book.book.Auteur}
              </p>
              <p>
                <strong>Niveau:</strong> {book.book.niveau}
              </p>
              <p>
                <strong>Thema:</strong> {book.book.thema}
              </p>
              <p>{book.book.beschrijving}</p>

              <label className="leeslijst-checkbox">
                <input
                  type="checkbox"
                  checked={book.gelezen}
                  onChange={(e) => toggleGelezen(book.id, e.target.checked)}
                />
                Gelezen
              </label>

              <button
                className="leeslijst-delete-btn"
                onClick={() => deleteBook(book.id)}
              >
                Verwijderen
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
