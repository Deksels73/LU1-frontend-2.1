import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/router";
import type { LoginResponse, ApiError } from "../../types";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const res = await fetch("http://localhost:8080/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: username,
        password: password,
      }),
    });

    const data = await res.json();

if (!res.ok) {
  const err = data as ApiError;
  alert(err.error || "Login mislukt");
  return;
}

const login: LoginResponse = data;

// Pas opslaan nadat de login gelukt is
localStorage.setItem("token", login.token);
localStorage.setItem("studentId", String(login.id));
localStorage.setItem(
  "user",
  JSON.stringify({ id: login.id, name: login.name, role: login.role })
);

router.push(login.role === "teacher" ? "/teacher" : "/");

  }

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleLogin}>
        <h2>Inloggen</h2>
        <p>Vul je gegevens in om verder te gaan.</p>

        <label>Naam</label>
        <input
          type="text"
          placeholder="Bijv. Bas Janssen"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label>Wachtwoord</label>
        <input
          type="password"
          placeholder="Wachtwoord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="login-btn">
          Login
        </button>

        <button
          type="button"
          className="register-btn"
          onClick={() => router.push("/profiel/register")}
        >
          Account aanmaken
        </button>

        {/* <button
          type="button"
          className="home-btn"
          onClick={() => router.push("/")}
        >
          Terug naar beginscherm
        </button> */}
      </form>
    </div>
  );
}
