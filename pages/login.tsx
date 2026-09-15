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
    <form onSubmit={handleLogin}>
      <input placeholder="Gebruikersnaam" onChange={e => setUsername(e.target.value)} />
      <input placeholder="Wachtwoord" type="password" onChange={e => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}
