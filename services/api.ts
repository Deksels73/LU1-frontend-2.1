export async function getSuggestion() {
  const res = await fetch("http://localhost:8080/suggestion");
  return res.text();
}

export async function saveReadingProfile(profile) {
  const res = await fetch("http://localhost:8080/readingProfile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile)
  });
  return res.json();
}
