import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Favorites() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const userId = JSON.parse(atob(token.split(".")[1])).id;

    api.get(`/favorites/${userId}`).then((res) => {
      setItems(res.data);
    });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>My Favorites ❤️</h1>

      {items.length === 0 ? (
        <h3>No favorites yet</h3>
      ) : (
        items.map((d) => (
          <div key={d.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
            <h3>{d.name}</h3>
            <p>{d.location}</p>
          </div>
        ))
      )}
    </div>
  );
}