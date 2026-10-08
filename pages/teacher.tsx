// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import Sidebar from "../components/sidebar";
// import Header from "../components/header";

// export default function TeacherPage() {
//   const router = useRouter();

//   const [loading, setLoading] = useState(true);
//   const [students, setStudents] = useState([]);
//   const [openStudentId, setOpenStudentId] = useState<number | null>(null);
//   const [leeslijsten, setLeeslijsten] = useState({});
//   const [newBookId, setNewBookId] = useState("");
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     const stored = localStorage.getItem("user");

//     if (!stored) {
//       router.push("/profiel/login");
//       return;
//     }

//     const user = JSON.parse(stored);

//     if (user.role !== "teacher") {
//       router.push("/");
//       return;
//     }

//     fetchStudents(user.id);
//   }, []);

//   async function fetchStudents(teacherId: number) {
//     setLoading(true);

//     const res = await fetch(`http://localhost:8080/docent/students/${teacherId}`);
//     const data = await res.json();

//     setStudents(data.students || []);
//     setLoading(false);
//   }

//   async function toggleLeeslijst(studentId: number) {
//     // Als deze student al open staat → klap dicht
//     if (openStudentId === studentId) {
//       setOpenStudentId(null);
//       return;
//     }

//     // Anders → leeslijst ophalen en openklappen
//     const res = await fetch(`http://localhost:8080/docent/leeslijst/${studentId}`);
//     const data = await res.json();

//     setLeeslijsten((prev) => ({
//       ...prev,
//       [studentId]: data.books || []
//     }));

//     setOpenStudentId(studentId);
//   }

//   async function addBookToStudent(studentId: number) {
//     if (!newBookId.trim()) {
//       setMessage("Voer een geldig bookId in.");
//       return;
//     }

//     const res = await fetch(`http://localhost:8080/docent/leeslijst/${studentId}/add`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ bookId: newBookId })
//     });

//     const data = await res.json();

//     if (data.error) {
//       setMessage(data.error);
//     } else {
//       setMessage("Boek toegevoegd!");

//       // Leeslijst opnieuw ophalen
//       toggleLeeslijst(studentId);
//     }
//   }

//   return (
//     <div>
//       <Sidebar />

//       <main className="content">
//         <Header />

//         <h2>Docent Dashboard</h2>
//         <p>Alleen zichtbaar voor ingelogde docenten.</p>

//         {loading && <p>Loading...</p>}

//         {!loading && (
//           <>
//             <h3>Gekoppelde studenten</h3>

//             <ul className="student-list">
//               {students.map((s) => (
//                 <li key={s.id} className="student-item">
//                   <span>
//                     {s.name} ({s.email})
//                   </span>

//                   <button
//                     className="btn-view"
//                     onClick={() => toggleLeeslijst(s.id)}
//                   >
//                     {openStudentId === s.id ? "Verberg leeslijst" : "Bekijk leeslijst"}
//                   </button>

//                   {/* ⭐ UITKLAPBARE LEESLIJST PER STUDENT */}
//                   {openStudentId === s.id && (
//                     <div className="leeslijst-section">
//                       <h4>Leeslijst van student {s.id}</h4>

//                       {(leeslijsten[s.id] || []).length === 0 && (
//                         <p>Geen items in leeslijst.</p>
//                       )}

//                       {(leeslijsten[s.id] || []).map((item) => (
//                         <div key={item.id} className="leeslijst-card">
//                           <h4>{item.book?.Titel}</h4>
//                           <p><strong>Auteur:</strong> {item.book?.Auteur}</p>
//                           <p>{item.book?.beschrijving}</p>
//                           <p><strong>Niveau:</strong> {item.book?.niveau}</p>
//                         </div>
//                       ))}

//                       <div className="add-book-section">
//                         <h4>Boek toevoegen aan leeslijst</h4>

//                         <input
//                           type="text"
//                           placeholder="Voer bookId in"
//                           value={newBookId}
//                           onChange={(e) => setNewBookId(e.target.value)}
//                           className="input-bookid"
//                         />

//                         <button
//                           className="btn-add"
//                           onClick={() => addBookToStudent(s.id)}
//                         >
//                           Voeg toe
//                         </button>

//                         {message && <p className="message">{message}</p>}
//                       </div>
//                     </div>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           </>
//         )}
//       </main>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "../components/sidebar";
import Header from "../components/header";

const API_URL = "http://localhost:8080";

type Student = {
  id: number;
  name: string;
  email: string;
};

export default function TeacherPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [openStudentId, setOpenStudentId] = useState<number | null>(null);
  const [leeslijsten, setLeeslijsten] = useState<Record<number, any[]>>({});
  const [newBookId, setNewBookId] = useState("");
  const [message, setMessage] = useState("");

  // Token meesturen en 401 afhandelen
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

    if (res.status === 401) {
      localStorage.clear();
      router.push("/profiel/login");
      return null;
    }

    return res;
  }

  useEffect(() => {
    // Alleen voor de gebruiker: de echte controle gebeurt in de backend (403)
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

      const data = await res.json();
      setStudents(data.students || []);
    } catch (err) {
      console.error("Fout bij ophalen studenten:", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadLeeslijst(studentId: number) {
    const res = await authFetch(`/docent/leeslijst/${studentId}`);
    if (!res) return;

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Leeslijst ophalen mislukt.");
      return;
    }

    setLeeslijsten((prev) => ({
      ...prev,
      [studentId]: data.books || [],
    }));
  }

  async function toggleLeeslijst(studentId: number) {
    // Staat deze student al open? Dan dichtklappen
    if (openStudentId === studentId) {
      setOpenStudentId(null);
      return;
    }

    setMessage("");
    setNewBookId("");

    try {
      await loadLeeslijst(studentId);
      setOpenStudentId(studentId);
    } catch (err) {
      console.error("Fout bij ophalen leeslijst:", err);
    }
  }

  async function addBookToStudent(studentId: number) {
    if (!newBookId.trim()) {
      setMessage("Voer een geldig bookId in.");
      return;
    }

    try {
      const res = await authFetch(`/docent/leeslijst/${studentId}/add`, {
        method: "POST",
        body: JSON.stringify({ bookId: newBookId.trim() }),
      });
      if (!res) return;

      const data = await res.json();

      if (!res.ok || data.error) {
        setMessage(data.error || "Toevoegen mislukt.");
        return;
      }

      setMessage("Boek toegevoegd!");
      setNewBookId("");

      // Leeslijst verversen zonder in te klappen
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
                    {s.name} ({s.email})
                  </span>

                  <button className="btn-view" onClick={() => toggleLeeslijst(s.id)}>
                    {openStudentId === s.id ? "Verberg leeslijst" : "Bekijk leeslijst"}
                  </button>

                  {/* UITKLAPBARE LEESLIJST PER STUDENT */}
                  {openStudentId === s.id && (
                    <div className="leeslijst-section">
                      <h4>Leeslijst van {s.name}</h4>

                      {(leeslijsten[s.id] || []).length === 0 && (
                        <p>Geen items in leeslijst.</p>
                      )}

                      {(leeslijsten[s.id] || []).map((item) => (
                        <div key={item.id} className="leeslijst-card">
                          <h4>{item.book?.Titel}</h4>
                          <p>
                            <strong>Auteur:</strong> {item.book?.Auteur}
                          </p>
                          <p>{item.book?.beschrijving}</p>
                          <p>
                            <strong>Niveau:</strong> {item.book?.niveau}
                          </p>
                        </div>
                      ))}

                      <div className="add-book-section">
                        <h4>Boek toevoegen aan leeslijst</h4>

                        <input
                          type="text"
                          placeholder="Voer bookId in"
                          value={newBookId}
                          onChange={(e) => setNewBookId(e.target.value)}
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
