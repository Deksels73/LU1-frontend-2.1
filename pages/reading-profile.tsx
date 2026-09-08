import { useState } from "react"

export default function ReadingProfile() {
  const [form, setForm] = useState({
    genre: "",
    taalniveau: "",
    onderwerp: "",
    lengte: "",
    leesdoel: ""
  })
  function handleChange(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }
}