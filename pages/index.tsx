import Sidebar from "../components/sidebar";
import Header from "../components/header";
import { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [user, setUser] = useState(null);
    const router = useRouter();
const [profiel, setProfiel] = useState(null);

useEffect(() => {
  const saved = localStorage.getItem("leesprofiel");
  if (saved) {
    setProfiel(JSON.parse(saved));
  }
}, []);

function handleLeesprofiel() {
  if (profiel) {
    // ⭐ Profiel bestaat → ga naar bekijken
    router.push("/leesprofiel/ProfielBekijken");
  } else {
    // ⭐ Profiel bestaat niet → ga naar invullen
    router.push("/leesprofiel/ProfielInvullen");
  }
}

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
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


        {/* <p style={{ color: "blue" }}>Backend zegt: {pingResult}</p> */}

        <section className="cards">
          <div className="card">
            <h3>Leesprofiel invullen</h3>
            <p>Vul je voorkeuren in en ontvang persoonlijk leesadvies.</p>
           
<button className="btn" onClick={handleLeesprofiel}>Start</button>


          </div>

          <div className="card">
            <h3>Leesadvies</h3>
            <p>Krijg drie titels die perfect passen bij jouw profiel. </p>
          
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

