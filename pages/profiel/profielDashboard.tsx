import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";
import Header from "../../components/header";
import type { User, Teacher, ApiError } from "../../types";

const API_URL = "http://localhost:8080";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [docenten, setDocenten] = useState<Teacher[]>([]);
  const [mijnDocent, setMijnDocent] = useState<Teacher | null>(null);
  const [gekozen, setGekozen] = useState("");
  const [message, setMessage] = useState("");

  function logout() {
    localStorage.clear();
    window.location.href = "/profiel/login";
  }

  async function authFetch(path: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token");

    if (!token) {
      logout();
      return null;
    }

    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      logout();
      return null;
    }

    return res;
  }

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored || !localStorage.getItem("token")) {
      window.location.href = "/profiel/login";
      return;
    }

    const parsed: User = JSON.parse(stored);
    setUser(parsed);

    if (parsed.role === "student") {
      loadDocentGegevens();
    }
  }, []);

  async function loadDocentGegevens() {
    try {
      const [docentenRes, mijnRes] = await Promise.all([
        authFetch("/docenten"),
        authFetch("/student/docent"),
      ]);
      if (!docentenRes || !mijnRes) return;

      const docentenData = await docentenRes.json();
      const mijnData = await mijnRes.json();

      setDocenten(docentenData.docenten || []);
      setMijnDocent(mijnData.docent || null);
      setGekozen(mijnData.docent ? String(mijnData.docent.id) : "");
    } catch (err) {
      console.error("Fout bij ophalen docenten:", err);
    }
  }

  async function saveDocent() {
    if (!gekozen) {
      setMessage("Kies eerst een docent.");
      return;
    }

    try {
      const res = await authFetch("/student/docent", {
        method: "PUT",
        body: JSON.stringify({ teacherId: Number(gekozen) }),
      });
      if (!res) return;

      const data = await res.json();

      if (!res.ok) {
        const err = data as ApiError;
        setMessage(err.error || "Opslaan mislukt.");
        return;
      }

      setMijnDocent(data.teacher);
      setMessage("Docent gekoppeld!");
    } catch (err) {
      console.error("Fout bij koppelen docent:", err);
      setMessage("Server niet bereikbaar.");
    }
  }

  if (!user) return <p>Bezig met laden...</p>;

  return (
    <>
      <Sidebar />
      <main className="content">
        <Header />
      </main>

      <div className="dashboard-wrapper">
        <div className="dashboard-container">
          <h1>Welkom {user.name}</h1>
          <p>
            Je bent ingelogd als: <strong>{user.role}</strong>
          </p>

          {user.role === "student" && (
            <div className="docent-koppelen">
              <h3>Mijn docent</h3>

              <p>
                {mijnDocent
                  ? `Gekoppeld aan: ${mijnDocent.name}`
                  : "Je bent nog niet aan een docent gekoppeld."}
              </p>

              <select value={gekozen} onChange={(e) => setGekozen(e.target.value)}>
                <option value="">Kies een docent...</option>
                {docenten.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>

              <button onClick={saveDocent}>
                {mijnDocent ? "Docent wijzigen" : "Docent koppelen"}
              </button>

              {message && <p className="message">{message}</p>}
            </div>
          )}

          <button onClick={logout}>Uitloggen</button>
        </div>
      </div>
    </>
  );
}
