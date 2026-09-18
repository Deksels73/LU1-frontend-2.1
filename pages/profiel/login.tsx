import { useState } from "react";
import { useRouter } from "next/router";


export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();

    const res = await fetch("http://localhost:8080/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    localStorage.setItem("role", data.role);

    router.push("/");
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
          onChange={e => setUsername(e.target.value)}
          required
        />

        <label>Wachtwoord</label>
        <input
          type="password"
          placeholder="Wachtwoord"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="login-btn">Login</button>

        <button
          type="button"
          className="register-btn"
          onClick={() => router.push("/register")}
        >
          Account aanmaken
        </button>
      </form>
    </div>
  );
}
