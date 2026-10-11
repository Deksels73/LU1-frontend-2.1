import Sidebar from "../components/sidebar";
import Header from "../components/header";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { User, Leesprofiel } from "../types";
import Link from "next/link";

export default function Home() {
  const [profiel, setProfiel] = useState<Leesprofiel | null>(null);
  const router = useRouter();

  // Leesprofiel uit api
useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  fetch("http://localhost:8080/leesprofiel", {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.ok ? res.json() : null)
    .then(data => setProfiel(data))
    .catch(() => setProfiel(null));
}, []);


  function handleLeesprofiel() {
    if (profiel) {
      router.push("/leesprofiel/ProfielBekijken");
    } else {
      router.push("/leesprofiel/ProfielInvullen");
    }
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
            <Link className="btn" href="/advies">
              Bekijk advies
            </Link>
          </div>

          <div className="card">
            <h3>Catalogus</h3>
            <p>Blader door alle beschikbare titels en filter op jouw voorkeuren.</p>
            <Link className="btn" href="/catalogus">
              Open catalogus
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
