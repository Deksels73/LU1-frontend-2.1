import Sidebar from "../components/sidebar";
import Header from "../components/header";
import { useEffect, useState } from "react";
import SkeletonAdvice from "../components/SkeletonAdvice";

export default function Advice() {
  const [loading, setLoading] = useState(true);
  const [advice, setAdvice] = useState<string[]>([]);

  useEffect(() => {
    async function fetchAdvice() {
      try {
        const res = await fetch("http://localhost:8080/suggestion");
        const data = await res.json();

        setAdvice(data.titles || []);
      } catch (err) {
        console.error("Fout bij ophalen advies:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAdvice();
  }, []);

  return (
    <div>
      <Sidebar />

      <main className="content">
        <Header />

        <h2>Jouw Leesadvies</h2>
        <p>Op basis van jouw leesprofiel hebben we drie titels voor je geselecteerd.</p>

        {loading && <SkeletonAdvice />}

        {!loading && advice.length === 0 && (
          <p>Er is nog geen advies beschikbaar. Vul eerst je leesprofiel in.</p>
        )}

        {!loading && (
          <section className="cards">
            {advice.map((title, index) => (
              <div key={index} className="card">
                <h3>{title}</h3>
                <p>Deze titel past goed bij jouw voorkeuren.</p>
                <button className="btn">Meer info</button>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
