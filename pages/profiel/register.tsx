import { useState } from "react";
import { useRouter } from "next/router";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    password: "",
    code: ""
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

  const payload = {
    name: form.name,
    password: form.password,
    code: form.code
  };

  const res = await fetch("http://localhost:8080/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Kon gebruiker niet opslaan.");
    return;
  }

  alert(`Account aangemaakt voor ${form.name}`);
  router.push("/profiel/login");
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

        <label>Code</label>
        <input
          type="text"
          name="code"
          placeholder=""
          value={form.code}
          onChange={handleChange}
          required
        />

        <button type="submit" className="login-btn">Account maken</button>
        <button type="button" className="home-btn" onClick={() => router.push("/")}>Terug naar beginscherm</button>
      </form>
    </div>
  );
}
