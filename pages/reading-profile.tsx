import { useState } from "react"

export default function ReadingProfile() {
  const [form, setForm] = useState({
    genre: "",
    taalniveau: "",
    onderwerp: "",
    lengte: "",
    leesdoel: ""
  })
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

    console.log(await res.text());
    alert("Leesprofiel opgeslagen!");
  }
  return (
    <main className="content">
      <h2>Leesprofiel invullen</h2>

     <form onSubmit={handleSubmit} className="card">

        <label>Genre</label>
        <select name="genre" onChange={handleChange}>
          <option value="">Kies...</option>
          <option value="fantasy">Fantasy</option>
          <option value="thriller">Thriller</option>
          <option value="romantiek">Romantiek</option>
        </select>

        <label>Taalniveau</label>
        <select name="taalniveau" onChange={handleChange}>
          <option value="">Kies...</option>
          <option value="A2">A2</option>
          <option value="B1">B1</option>
          <option value="B2">B2</option>
        </select>

        <label>Onderwerp</label>
        <input name="onderwerp" onChange={handleChange} />

        <label>Lengte</label>
        <select name="lengte" onChange={handleChange}>
          <option value="">Kies...</option>
          <option value="kort">Kort</option>
          <option value="gemiddeld">Gemiddeld</option>
          <option value="lang">Lang</option>
        </select>

        <label>Leesdoel</label>
        <input name="leesdoel" onChange={handleChange} />

        <button className="btn" type="submit">Opslaan</button>
      </form>
    </main>
  );
}
