import Sidebar from "../../components/sidebar";
import Header from "../../components/header";
import { useState } from "react";

export default function ReadingProfile() {
  const [form, setForm] = useState({
    genre: "",
    onderwerp: "",
    niveau: "",
    lengte: ""
  });

  function handleChange(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("http://localhost:8080/readingProfile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    alert("Leesprofiel opgeslagen!");
  }

  return (
    <div>
      <Sidebar />

      <main className="content">
  <Header />

  <div className="center-wrapper">
    <h2>Leesprofiel invullen</h2>
    <p>Vul je voorkeuren in zodat we een persoonlijk leesadvies kunnen geven.</p>

    <form onSubmit={handleSubmit} className="card">

      {/* 1. Genrevoorkeur */}
      <label><strong>Genrevoorkeur</strong></label>
      <p className="field-info">
        Zonder genrevoorkeur kunnen we geen passende suggesties doen.
      </p>
      <select name="genre" required onChange={handleChange}>
        <option value="">Kies een genre...</option>
        <option value="historisch">Historisch</option>
        <option value="thriller">Thriller / Spannend</option>
        <option value="romantiek">Romantiek / Relaties</option>
        <option value="literair">Literair / Psychologisch</option>
        <option value="cultuur">Cultuur & Samenleving</option>
        <option value="young-adult">Young Adult</option>
        <option value="avontuur">Reizen & Avontuur</option>
        <option value="humor">Humor</option>
        <option value="non-fictie">Non‑fictie</option>
      </select>

      {/* 2. Onderwerpen */}
      <label><strong>Onderwerpen die je interessant vindt</strong></label>
      <p className="field-info">
        Kies onderwerpen die je graag leest. Dit bepaalt inhoudelijke relevantie.
      </p>

      <select name="onderwerp" required onChange={handleChange}>
        <option value="">Kies een onderwerp...</option>
        {/* jouw opties */}
      </select>

      {/* 3. Niveau */}
      <label><strong>Niveau (moeilijkheid)</strong></label>
      <p className="field-info">
        Dit bepaalt wat haalbaar is. Kies hoe moeilijk de tekst mag zijn.
      </p>
      <select name="niveau" required onChange={handleChange}>
        <option value="">Kies een niveau...</option>
        <option value="F2">F2 (makkelijk)</option>
        <option value="F3">F3 (gemiddeld)</option>
        <option value="F3+">F3+ (moeilijk)</option>
      </select>

      {/* Lengte */}
      <label><strong>Lengte van de tekst</strong></label>
      <p className="field-info">
        Dit voorkomt dat je een te lang of te kort boek krijgt.
      </p>
      <select name="lengte" required onChange={handleChange}>
        <option value="">Kies een lengte...</option>
        <option value="kort">Kort</option>
        <option value="gemiddeld">Gemiddeld</option>
        <option value="lang">Lang</option>
      </select>

      <button className="btn" type="submit">Opslaan</button>
    </form>
  </div>
</main>
</div>
  );
}
