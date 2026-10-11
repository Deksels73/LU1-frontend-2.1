import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../components/sidebar";
import Header from "../../components/header";
import SkeletonProfielBekijken from "../../components/SkeletonProfielbekijken";
import type { User, Leesprofiel } from "../../types";

export default function LeesprofielOverzicht() {
  const [user, setUser] = useState<User | null>(null);
  const [profiel, setProfiel] = useState<Leesprofiel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Route guard: zonder token is deze pagina niet toegankelijk.
    // `loading` blijft true tot de doorverwijzing is gedaan, dus er is geen flits van inhoud.
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/profiel/login");
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser) as User);
      } catch {
        localStorage.clear();
        router.replace("/profiel/login");
        return;
      }
    }

    async function loadProfiel() {
      try {
        const res = await fetch(`http://localhost:8080/leesprofiel`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Token ongeldig of verlopen
        if (res.status === 401) {
          localStorage.clear();
          router.replace("/profiel/login");
          return;
        }

        if (res.ok) {
          setProfiel((await res.json()) as Leesprofiel);
        } else if (res.status !== 404) {
          // 404 betekent: nog geen profiel ingevuld. Dat is geen fout.
          setError("Je leesprofiel kon niet worden geladen. Probeer het later opnieuw.");
        }
      } catch (err) {
        console.error("Fout bij ophalen leesprofiel:", err);
        setError("De server is niet bereikbaar. Probeer het later opnieuw.");
      }

      setLoading(false);
    }

    loadProfiel();
  }, []);

  function handleInvullen() {
    if (user?.role !== "student") {
      alert("Alleen studenten kunnen een leesprofiel invullen.");
      return;
    }

    router.push("/leesprofiel/ProfielInvullen");
  }

  function handleBewerken() {
    if (user?.role !== "student") {
      alert("Alleen studenten kunnen een leesprofiel bewerken.");
      return;
    }

    router.push("/leesprofiel/ProfielBewerken");
  }

  return (
    <>
      <Sidebar />

      <main className="content">
        <Header />

        {loading ? (
          <SkeletonProfielBekijken />
        ) : (
          <div className="leesprofiel-container">
            <h2>Jouw Leesprofiel</h2>
            <p>Hier zie je de voorkeuren die je hebt ingevuld.</p>

            {error && <p role="alert">{error}</p>}

            {!error && profiel && (
              <ul>
                <li>Genre: {profiel.genre.join(", ")}</li>
                <li>Onderwerp: {profiel.onderwerp.join(", ")}</li>
                <li>Taalniveau: {profiel.niveau}</li>
                <li>Lengte: {profiel.lengte}</li>
                <li>Leesdoel: {profiel.leesdoel}</li>
              </ul>
            )}

            {!error && !profiel && <p>Je hebt nog geen leesprofiel ingevuld.</p>}

            {!error && !profiel && (
              <button onClick={handleInvullen}>Profiel invullen</button>
            )}

            {!error && profiel && (
              <button onClick={handleBewerken}>Profiel bewerken</button>
            )}
          </div>
        )}
      </main>
    </>
  );
}
