import { useState } from "react"

export default function ReadingProfile() {
  const [form, setForm] = useState({
    genre: "",
    taalniveau: "",
    onderwerp: "",
    lengte: "",
    leesdoel: ""
  })}