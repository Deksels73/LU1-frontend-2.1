import { useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "../components/sidebar";
import Header from "../components/header";

export default function TeacherPage() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "teacher") {
      router.push("/"); // terug naar home
    }
  }, []);

  return (
    <div>
      <Sidebar />
      <main className="content">
        <Header />
        <h2>Docent Dashboard</h2>
        <p>Alleen zichtbaar voor ingelogde docenten.</p>
      </main>
    </div>
  );
}
