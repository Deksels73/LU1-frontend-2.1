import { useState } from "react";

export default function SpinnerButton() {
  const [loading, setLoading] = useState(false);

  function handleClick() {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  }

  return (
    <button className="btn" onClick={handleClick} disabled={loading}>
      {loading ? <div className="spinner" /> : "Klik mij"}
    </button>
  );
}
