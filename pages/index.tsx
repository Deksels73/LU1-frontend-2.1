import Sidebar from "../components/sidebar";
import Header from "../components/header";
import { useEffect } from "react";
import { useState } from "react";

export default function Home() {
//   const [pingResult, setPingResult] = useState("");

//   useEffect(() => {
//     fetch("http://localhost:8080/ping")
//       .then(res => res.text())
//       .then(data => setPingResult(data));
//   }, []);

  return (
    <div>
      <Sidebar />

      <main className="content">
        <Header />

        {/* <p style={{ color: "blue" }}>Backend zegt: {pingResult}</p> */}

        <section className="cards">
          <div className="card">
            <h3>Leesprofiel invullen</h3>
            <p>Vul je voorkeuren in en ontvang persoonlijk leesadvies.</p>
            <a className="btn" href="/reading-profile">Start</a>
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

