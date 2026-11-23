import Link from "next/link";
import { memo } from "react"; 

export function Sidebar() {
    console.log("Sidebar rendert");
  return (
    <div className="sidebar">

      <Link href="/" className="logo">
     <img src="/img/logo.png" alt="Vrij Lezen op Maat logo" />

      </Link>

      <ul>
        <li><Link href="/leesprofiel/ProfielBekijken">Leesprofiel</Link></li>
        <li><Link href="/advies">Advies</Link></li>
        <li><Link href="/catalogus">Catalogus</Link></li>
        <li><Link href="/leeslijst">Leeslijst</Link></li>
        <li><Link href="/docent">Docent</Link></li>
      </ul>
    </div>
  );
}

export default memo(Sidebar);
