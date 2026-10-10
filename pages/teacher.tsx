import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "../components/sidebar";
import Header from "../components/header";
import type { StudentSummary, LeeslijstItem, ApiError } from "../types";

type StudentsResponse = {
  students: StudentSummary[];
} | ApiError;

type LeeslijstResponse = {
  books: LeeslijstItem[];
} | ApiError;

export default function TeacherPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [openStudentId, setOpenStudentId] = useState<number | null>(null);
  const [leeslijsten, setLeeslijsten] = useState<Record<number, LeeslijstItem[]>>({});
  const [newTitle, setNewTitle] = useState("");
  const [message, setMessage] = useState("");

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

  async function findBookIdByTitle(title: string) {
    const res = await fetch(`http://localhost:8080/catalog?page=1&limit=999`);
    const data = await res.json();

    const book = data.books.find(
      (b: any) => b.Titel.toLowerCase() === title.toLowerCase()
    );

    return book?._id || null;
  }

  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (!stored || !localStorage.getItem("token")) {
      router.push("/profiel/login");
      return;
    }

    const user = JSON.parse(stored);

    if (user.role !== "teacher") {
      router.push("/");
      return;
    }

    fetchStudents();
  }, []);

  async function fetchStudents() {
    setLoading(true);

    try {
      const res = await authFetch("/docent/students");
      if (!res) return;

      const data: StudentsResponse = await res.json();

      if ("error" in data) {
        console.error(data.error);
        setStudents([]);
      } else {
        setStudents(data.students || []);
      }
    } catch (err) {
      console.error("Fout bij ophalen studenten:", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadLeeslijst(studentId: number) {
    const res = await authFetch(`/docent/leeslijst/${studentId}`);
    if (!res) return;

    const data: LeeslijstResponse = await res.json();

    if ("error" in data) {
      setMessage(data.error || "Leeslijst ophalen mislukt.");
      return;
    }

    setLeeslijsten((prev) => ({
      ...prev,
      [studentId]: data.books || [],
    }));
  }

  async function toggleLeeslijst(studentId: number) {
    if (openStudentId === studentId) {
      setOpenStudentId(null);
      return;
    }

    setMessage("");
    setNewTitle("");

    try {
      await loadLeeslijst(studentId);
      setOpenStudentId(studentId);
    } catch (err) {
      console.error("Fout bij ophalen leeslijst:", err);
    }
  }

  async function addBookToStudent(studentId: number) {
    if (!newTitle.trim()) {
      setMessage("Voer een titel in.");
      return;
    }

    const bookId = await findBookIdByTitle(newTitle.trim());

    if (!bookId) {
      setMessage("Geen boek gevonden met deze titel.");
      return;
    }

    try {
      const res = await authFetch(`/docent/leeslijst/${studentId}/add`, {
        method: "POST",
        body: JSON.stringify({ bookId }),
      });
      if (!res) return;

      const data = await res.json();

      if (!res.ok || data.error) {
        setMessage(data.error || "Toevoegen mislukt.");
        return;
      }

      setMessage("Boek toegevoegd!");
      setNewTitle("");

      await loadLeeslijst(studentId);
    } catch (err) {
      console.error("Fout bij toevoegen:", err);
      setMessage("Server niet bereikbaar.");
    }
  }

  return (
    <div>
      <Sidebar />

      <main className="content">
        <Header />

        <h2>Docent Dashboard</h2>
        <p>Alleen zichtbaar voor ingelogde docenten.</p>

        {loading && <p>Loading...</p>}

        {!loading && (
          <>
            <h3>Gekoppelde studenten</h3>

            <ul className="student-list">
              {students.map((s) => (
                <li key={s.id} className="student-item">
                  <span>
                    {s.name}
                  </span>

                  <button className="btn-view" onClick={() => toggleLeeslijst(s.id)}>
                    {openStudentId === s.id ? "Verberg leeslijst" : "Bekijk leeslijst"}
                  </button>

                  {openStudentId === s.id && (
                    <div className="leeslijst-section">
                      <h4>Leeslijst van {s.name}</h4>

                      {(leeslijsten[s.id] || []).length === 0 && (
                        <p>Geen items in leeslijst.</p>
                      )}

                      {(leeslijsten[s.id] || []).map((item) => (
                        <div key={item.id} className="leeslijst-card">
                          <h4>{item.book?.Titel}</h4>
                          <p><strong>Auteur:</strong> {item.book?.Auteur}</p>
                          <p>{item.book?.beschrijving}</p>
                          <p><strong>Niveau:</strong> {item.book?.niveau}</p>
                        </div>
                      ))}

                      <div className="add-book-section">
                        <h4>Boek toevoegen aan leeslijst</h4>

                        <input
                          type="text"
                          placeholder="Voer titel in"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          className="input-bookid"
                        />

                        <button className="btn-add" onClick={() => addBookToStudent(s.id)}>
                          Voeg toe
                        </button>

                        {message && <p className="message">{message}</p>}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}
