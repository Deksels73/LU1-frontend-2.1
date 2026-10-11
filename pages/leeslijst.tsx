import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "../components/sidebar";
import Header from "../components/header";
import SkeletonLeeslijst from "../components/SkeletonLeeslijst";
import type { LeeslijstItem, ApiError } from "../types";

type LeeslijstResponse = {
  books: LeeslijstItem[];
} | ApiError;

export default function Leeslijst() {
  const router = useRouter();
  const [books, setBooks] = useState<LeeslijstItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function authFetch(path: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/profiel/login");
      return null;
    }

    const res = await fetch(`http://localhost:8080${path}`, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      localStorage.clear();
      router.push("/profiel/login");
      return null;
    }

    return res;
  }

  async function loadBooks() {
    try {
      const res = await authFetch("/leeslijst");
      if (!res) return;

      const data: LeeslijstResponse = await res.json();

      if ("error" in data) {
        console.error("API-fout:", data.error);
        setBooks([]);
      } else {
        setBooks(data.books ?? []);
      }
    } catch (err) {
      console.error("Fout bij ophalen leeslijst:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBooks();
  }, []);

  async function deleteBook(id: number) {
  try {
    const res = await authFetch(`/leeslijst/${id}`, { method: "DELETE" });
    if (!res) return;
    await loadBooks();
  } catch (err) {
    console.error("Fout bij verwijderen:", err);
  }
}

async function toggleGelezen(id: number, gelezen: boolean) {
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
          {books.map((item) => (
            <li key={item.id} className="leeslijst-item">
              <h2>{item.book.Titel}</h2>
              <p><strong>Auteur:</strong> {item.book.Auteur}</p>
              <p><strong>Niveau:</strong> {item.book.niveau}</p>
              <p><strong>Thema:</strong> {item.book.thema}</p>
              <p>{item.book.beschrijving}</p>

              <label className="leeslijst-checkbox">
                <input
                  type="checkbox"
                  checked={item.gelezen}
                  onChange={(e) => toggleGelezen(item.id, e.target.checked)}
                />
                Gelezen
              </label>

              <button
                className="leeslijst-delete-btn"
                onClick={() => deleteBook(item.id)}
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
