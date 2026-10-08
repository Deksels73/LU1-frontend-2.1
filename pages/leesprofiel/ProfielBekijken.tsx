// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import Sidebar from "../../components/sidebar";
// import Header from "../../components/header";

// export default function LeesprofielOverzicht() {
//   const [user, setUser] = useState(null);
//   const [profiel, setProfiel] = useState(null);
//   const router = useRouter();

// useEffect(() => {
//   // 1. Haal user op uit localStorage
//   const storedUser = localStorage.getItem("user");
//   if (storedUser) {
//     const parsedUser = JSON.parse(storedUser);
//     setUser(parsedUser);

//     // 2. Haal leesprofiel op uit backend
//     fetch(`http://localhost:8080/leesprofiel/${parsedUser.id}`)
//       .then(res => res.json())
//       .then(data => {
//         if (data && !data.error) {
//           setProfiel(data);

//           // Optioneel: ook lokaal opslaan
//           localStorage.setItem("leesprofiel", JSON.stringify(data));
//         }
//       })
//       .catch(err => console.error("Fout bij ophalen leesprofiel:", err));
//   }
// }, []);


//   function handleInvullen() {
//     if (!user) {
//       alert("Je moet ingelogd zijn om een leesprofiel in te vullen.");
//       router.push("/profiel/login");
//       return;
//     }

//     if (user.role !== "student") {
//       alert("Alleen studenten kunnen een leesprofiel invullen.");
//       return;
//     }

//     router.push("/leesprofiel/ProfielInvullen");
//   }

//   function handleBewerken() {
//     if (!user) {
//       alert("Je moet ingelogd zijn om een leesprofiel te bewerken.");
//       router.push("/profiel/login");
//       return;
//     }

//     if (user.role !== "student") {
//       alert("Alleen studenten kunnen een leesprofiel bewerken.");
//       return;
//     }

//     router.push("/leesprofiel/ProfielBewerken");
//   }

//   return (
//     <>
//           <Sidebar />
//      <main className="content">
//       <Header />
//       <div className="leesprofiel-container">
//       <h2>Jouw Leesprofiel</h2>
//       <p>Hier zie je de voorkeuren die je hebt ingevuld.</p>

//       {profiel ? (
//         <ul>
//         <li>Genre: {profiel.genre.join(", ")}</li>          
//       < li>Taalniveau: {profiel.niveau}</li>
//         <li>Onderwerp: {profiel.onderwerp.join(", ")}</li>
//           <li>Lengte: {profiel.lengte}</li>
//           <li>Leesdoel: {profiel.leesdoel}</li>
//         </ul>
//       ) : (
//         <p>Je hebt nog geen leesprofiel ingevuld.</p>
//       )}

//       {!profiel && (
//   <button onClick={handleInvullen}>Profiel invullen</button>
// )}


//       {profiel && (
//         <button onClick={handleBewerken}>Profiel bewerken</button>
//       )}
//     </div>
//       </main>
    
//     </>
//   );
// }
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../components/sidebar";
import Header from "../../components/header";
import SkeletonProfielBekijken from "../../components/SkeletonProfielbekijken"; 

type User = {
  id: number;
  name: string;
  role: "teacher" | "student";
};

type Profiel = {
  genre: string[];
  onderwerp: string[];
  niveau: string;
  lengte: string;
  leesdoel: string;
};

export default function LeesprofielOverzicht() {
  const [user, setUser] = useState<User | null>(null);
  const [profiel, setProfiel] = useState<Profiel | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 1. User uit localStorage (alleen voor weergave en knoppen)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // 2. Leesprofiel ophalen met token
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:8080/leesprofiel", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.clear();
          router.push("/profiel/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        // Een 404 (nog geen profiel) komt hier als { error } binnen
        if (data && !data.error) {
          setProfiel(data);
          localStorage.setItem("leesprofiel", JSON.stringify(data));
        }
      })
      .catch((err) => console.error("Fout bij ophalen leesprofiel:", err));
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

  function handleBewerken() {
    if (!user) {
      alert("Je moet ingelogd zijn om een leesprofiel te bewerken.");
      router.push("/profiel/login");
      return;
    }

    if (user.role !== "student") {
      alert("Alleen studenten kunnen een leesprofiel bewerken.");
      return;
    }

    router.push("/leesprofiel/ProfielBewerken");
  }
  
useEffect(() => {
    const saved = localStorage.getItem("leesprofiel");

    setTimeout(() => {
      if (saved) {
        setProfiel(JSON.parse(saved));
      }
      setLoading(false);
    }, 400); // kleine delay zodat skeleton zichtbaar is
  }, []);
  
return (
  <>
    <Sidebar />

    <main className="content">
      <Header />

      {loading ? (
        // Skeleton staat alleen in de content
        <SkeletonProfielBekijken />
      ) : (
        <div className="leesprofiel-container">
          <h2>Jouw Leesprofiel</h2>
          <p>Hier zie je de voorkeuren die je hebt ingevuld.</p>

          {profiel ? (
            <ul>
              <li>Genre: {profiel.genre.join(", ")}</li>
              <li>Onderwerp: {profiel.onderwerp.join(", ")}</li>
              <li>Taalniveau: {profiel.niveau}</li>
              <li>Lengte: {profiel.lengte}</li>
              <li>Leesdoel: {profiel.leesdoel}</li>
            </ul>
          ) : (
            <p>Je hebt nog geen leesprofiel ingevuld.</p>
          )}

          {!profiel && (
            <button onClick={handleInvullen}>Profiel invullen</button>
          )}

          {profiel && (
            <button onClick={handleBewerken}>Profiel bewerken</button>
          )}
        </div>
      )}
    </main>
  </>
);
}
