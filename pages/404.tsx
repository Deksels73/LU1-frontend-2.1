import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h1>404 - Deze pagina bestaat niet</h1>
      <Link href="/">Ga naar Home</Link>
    </div>
  );
}