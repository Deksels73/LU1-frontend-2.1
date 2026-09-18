import Link from "next/link";

export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <h1>Vrij Lezen op Maat</h1>
        <p>Persoonlijk leesadvies voor elke student</p>
      </div>

     <Link href="/profiel/login">
  <button className="account-btn">Account</button>
</Link>
    </header>
  );
}
