import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="sidebar">

      {/* Logo bovenaan */}
      <Link href="/" className="logo">
        <img src="/img/logo.png" alt="Logo" />
      </Link>

      <ul>
        <li><Link href="/leesprofiel/ProfielBekijken">Leesprofiel</Link></li>
        <li><Link href="/advice">Advies</Link></li>
        <li><Link href="/catalog">Catalogus</Link></li>
        <li><Link href="/reading-list">Leeslijst</Link></li>
        <li><Link href="/teacher">Docent</Link></li>
      </ul>
    </div>
  );
}
