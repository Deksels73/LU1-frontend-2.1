import { useEffect, useState } from "react";
import SkeletonCatalog from "../components/SkeletonCatalog";
import Header from "../components/header";
import Sidebar from "../components/sidebar";


export default function Catalog() {
const [loading, setLoading] = useState(true);
const [books, setBooks] = useState([]);


useEffect(() => {
  async function fetchCatalog() {
    try {
      const res = await fetch("http://localhost:8080/catalog");
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error("Catalogus ophalen mislukt:", err);
    } finally {
      setLoading(false);
    }
  }

  fetchCatalog();
}, []);





return (
  <div>
    <Sidebar />

    <main className="content">
      <Header />

      <h2>Catalogus</h2>
      <p>Blader door alle beschikbare titels.</p>

      {loading && <SkeletonCatalog />}

      {!loading && books.length === 0 && (
        <p>Er zijn nog geen boeken beschikbaar.</p>
      )}

      {!loading && (
        <section className="cards">
          {books.map((book, index) => (
            <div key={index} className="card">
              <h3>{book.title}</h3>
              <p>{book.author}</p>
              <button className="btn">Meer info</button>
            </div>
          ))}
        </section>
      )}
    </main>
  </div>
);

}
