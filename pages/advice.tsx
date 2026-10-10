import Sidebar from "../components/sidebar";
import Header from "../components/header";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SkeletonAdvice from "../components/SkeletonAdvice";
import type { AdviesItem, ApiError } from "../types";

type AdviceResponse = {
  advies: AdviesItem[];
} | ApiError;

export default function Advice() {
  const [loading, setLoading] = useState(true);
  const [advies, setAdvies] = useState<AdviesItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchAdvice() {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/profiel/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:8080/advies", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          localStorage.clear();
          router.push("/profiel/login");
          return;
        }

        const data: AdviceResponse = await res.json();

        if ("error" in data) {
          console.error("API-fout:", data.error);
          setAdvies([]);
        } else {
          setAdvies(data.advies || []);
        }
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
        <p>Hoe uitgebreider je leesprofiel, hoe beter het advies wordt.</p>

        {loading && <SkeletonAdvice />}

        {!loading && advies.length === 0 && (
          <p>Er is nog geen advies beschikbaar. Vul eerst je leesprofiel in.</p>
        )}

        {!loading && (
          <section className="advice-cards">
            {advies.map((item, index) => (
              <div key={index} className="advice-card">
                <h3>{item.book.Titel}</h3>
                <p><strong>Auteur:</strong> {item.book.Auteur}</p>
                <p>{item.book.beschrijving}</p>

                {item.book.thema && (
                  <p><strong>Thema:</strong> {item.book.thema}</p>
                )}

                <em>{item.reason}</em>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
