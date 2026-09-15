import Link from "next/link";
import Sidebar from "../../components/sidebar";
import Header from "../../components/header";

export default function ProfielBekijken() {
  // Voorbeeldprofiel — later kun je dit vervangen door echte data uit je backend
  const profiel = {
    genre: "Fantasy",
    taalniveau: "B1",
    onderwerp: "Avontuur",
    lengte: "Gemiddeld",
    leesdoel: "Meer leesplezier"
  };

  return (
    <div>
      <Sidebar />

      <main className="content">
        <Header />

        <h2>Jouw Leesprofiel</h2>
        <p>Hier zie je de voorkeuren die je hebt ingevuld.</p>

        <section className="card">
          <h3>Voorkeuren</h3>

          <ul className="profile-list">
            <li><strong>Genre:</strong> {profiel.genre}</li>
            <li><strong>Taalniveau:</strong> {profiel.taalniveau}</li>
            <li><strong>Onderwerp:</strong> {profiel.onderwerp}</li>
            <li><strong>Lengte:</strong> {profiel.lengte}</li>
            <li><strong>Leesdoel:</strong> {profiel.leesdoel}</li>
          </ul>

          <div className="button-row">
            <Link href="/profiel/ProfielInvullen" className="btn">
              Profiel invullen
            </Link>

            <Link href="/profiel/ProfielBewerken" className="btn secondary">
              Profiel bewerken
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
