import { useState } from "react";
import { useRouter } from "next/router";


export default function Register() {
  const [form, setForm] = useState({
    name: "",
    password: "",
    role: "student",
  });

  const router = useRouter();

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Hier komt straks jouw POST /register naar Postgres
    console.log("Nieuw account:", form);

    alert(`Account aangemaakt voor ${form.name} (${form.role})`);

    router.push("/login");
  }

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Account aanmaken</h2>
        <p>Vul je gegevens in om een nieuw account te maken.</p>

        <label>Naam</label>
        <input
          type="text"
          name="name"
          placeholder="Bijv. Bas Janssen"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label>Wachtwoord</label>
        <input
          type="password"
          name="password"
          placeholder="Kies een wachtwoord"
          value={form.password}
          onChange={handleChange}
          required
        />

        <label>Rol</label>
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="student">Leerling</option>
          <option value="teacher">Docent</option>
        </select>

        <button type="submit" className="login-btn">Account maken</button>
      </form>
    </div>
  );
}
