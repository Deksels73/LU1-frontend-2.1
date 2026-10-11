import { useState } from "react";
import { useRouter } from "next/router";
import type { ApiError } from "../../types";

type RegisterForm = {
  name: string;
  password: string;
  code: string;
};

type RegisterResponse = { message: string } | ApiError;

export default function Register() {
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    password: "",
    code: ""
  });

  const router = useRouter();

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

function validatePassword(password: string): string | null {
  // Minimaal 8 tekens
  if (password.length < 8) {
    return "Wachtwoord moet minimaal 8 tekens bevatten.";
  }

  // Minimaal 1 hoofdletter
  if (!/[A-Z]/.test(password)) {
    return "Wachtwoord moet minimaal één hoofdletter bevatten.";
  }

  // Minimaal 1 cijfer
  if (!/[0-9]/.test(password)) {
    return "Wachtwoord moet minimaal één cijfer bevatten.";
  }

  // Minimaal 1 speciaal teken
  if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
    return "Wachtwoord moet minimaal één speciaal teken bevatten.";
  }

  return null; // geldig
}


  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  const passwordError = validatePassword(form.password);
  if (passwordError) {
    alert(passwordError);
    return;
  }

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

  const data: RegisterResponse = await res.json();

  if (!res.ok) {
    const err = data as ApiError;
    alert(err.error || "Kon gebruiker niet opslaan.");
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
          value={form.code}
          onChange={handleChange}
          required
        />

        <button type="submit" className="login-btn">Account maken</button>
        <button type="button" className="home-btn" onClick={() => router.push("/")}>
          Terug naar beginscherm
        </button>
      </form>
    </div>
  );
}
