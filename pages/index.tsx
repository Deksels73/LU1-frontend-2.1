import Sidebar from "../components/sidebar";
import Header from "../components/header";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { User, Leesprofiel } from "../types";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [profiel, setProfiel] = useState<Leesprofiel | null>(null);
  const router = useRouter();

  // Leesprofiel uit localStorage
  useEffect(() => {
    const saved = localStorage.getItem("leesprofiel");
    if (saved) {
      try {
        setProfiel(JSON.parse(saved) as Leesprofiel);
      } catch {
        setProfiel(null);
      }
    }
  }, []);

  function handleLeesprofiel() {
    if (profiel) {
      router.push("/leesprofiel/ProfielBekijken");
    } else {
      router.push("/leesprofiel/ProfielInvullen");
    }
  }

  // User uit localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored) as User);
      } catch {
        setUser(null);
      }
    }
  }, []);

  function handleInvullen() {
    if (!user) {
      alert("Je moet ingelogd zijn om een leesprofiel in te vullen.");
      router.push("/profiel/login");
      return;
    }

    if (user.role !== "student") {
      alert("Alleen studenten kunnen een leesprofiel invullen.");
      return;
    }

    router.push("/leesprofiel/ProfielInvullen");
  }

  return (
    <div>
      <Sidebar />

      <main className="content">
        <Header />

        <section className="cards">
          <div className="card">
            <h3>Leesprofiel invullen</h3>
            <p>Vul je voorkeuren in en ontvang persoonlijk leesadvies.</p>
            <button className="btn" onClick={handleLeesprofiel}>
              Start
            </button>
          </div>

          <div className="card">
            <h3>Leesadvies</h3>
            <p>Krijg drie titels die perfect passen bij jouw profiel.</p>
            <a className="btn" href="/advice">Bekijk advies</a>
          </div>

          <div className="card">
            <h3>Catalogus</h3>
            <p>Blader door alle beschikbare titels en filter op jouw voorkeuren.</p>
            <a className="btn" href="/catalog">Open catalogus</a>
          </div>
        </section>
      </main>
    </div>
  );
}
