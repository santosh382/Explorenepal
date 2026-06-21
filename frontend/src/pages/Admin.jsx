import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Admin() {
  const [destinations, setDestinations] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]); // 🌟 NEW: Bookings State
  const [search, setSearch] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    location: "",
    description: "",
    image_url: "",
    rating: "",
    category_id: "",
    budget: "",
    difficulty: "",
    weather: "",
    hotels: "",
    restaurants: "",
    travel_tips: ""
  });

  const categoryMap = {
    "1": "Trekking",
    "2": "Cultural",
    "3": "Lakes",
    "4": "Wildlife"
  };

  // FETCH ENGINES
  const fetchDestinations = async () => {
    try {
      const res = await api.get("/destinations");
      setDestinations(res.data);
    } catch (err) {
      console.error("Failed fetching destinations:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed fetching users:", err);
    }
  };

  // 🌟 NEW: Fetch Bookings Engine
  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings"); // Connects to backend booking records
      setBookings(res.data);
    } catch (err) {
      console.error("Failed fetching package bookings:", err);
    }
  };

  useEffect(() => {
    fetchDestinations();
    fetchUsers();
    fetchBookings(); // 🌟 Sync bookings data on component mount
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await handleUpdate();
    } else {
      await handleAdd();
    }
  };

  const getSanitizedPayload = () => {
    return {
      ...form,
      rating: form.rating ? parseFloat(form.rating) : 0.0,
      category_id: form.category_id ? parseInt(form.category_id, 10) : 1,
      image_url: form.image_url || "https://images.unsplash.com/photo-1544735716-392fe2489ffa",
      hotels: form.hotels || "",
      restaurants: form.restaurants || "",
      travel_tips: form.travel_tips || ""
    };
  };

  const handleAdd = async () => {
    try {
      const payload = getSanitizedPayload();
      await api.post("/destinations", payload);
      alert("Destination Published Live! 🚀");
      handleClearForm();
      fetchDestinations();
    } catch (err) {
      console.error(err);
      alert("Submission Failed ❌");
    }
  };

  const handleUpdate = async () => {
    try {
      const payload = getSanitizedPayload();
      await api.put(`/destinations/${editingId}`, payload);
      alert("Blueprint Modifications Committed! ✨");
      handleClearForm();
      fetchDestinations();
    } catch (err) {
      console.error(err);
      alert("Update Failed ❌");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete permanently?")) return;
    try {
      await api.delete(`/destinations/${id}`);
      fetchDestinations();
    } catch (err) {
      console.error(err);
    }
  };

  // 🌟 NEW: Update Booking Status Action Handler (e.g., Confirming or Cancelling a booking)
  const handleUpdateBookingStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}`, { status });
      alert(`Booking status marked as ${status}! 📝`);
      fetchBookings();
    } catch (err) {
      console.error("Failed to update booking status:", err);
      alert("Status update failed ❌");
    }
  };

  const handleEdit = (d) => {
    setEditingId(d.id);
    setForm({
      name: d.name || "", location: d.location || "", description: d.description || "",
      image_url: d.image_url || "", rating: d.rating || "", category_id: d.category_id || "",
      budget: d.budget || "", difficulty: d.difficulty || "", weather: d.weather || "",
      hotels: d.hotels || "", restaurants: d.restaurants || "", travel_tips: d.travel_tips || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const makeAdmin = async (id) => {
    try {
      await api.put(`/users/make-admin/${id}`);
      alert("User promoted to Admin! 👑");
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Evict user?")) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearForm = () => {
    setForm({
      name: "", location: "", description: "", image_url: "",
      rating: "", category_id: "", budget: "", difficulty: "",
      weather: "", hotels: "", restaurants: "", travel_tips: ""
    });
    setEditingId(null);
  };

  const filteredDestinations = destinations.filter((d) => {
    const searchString = `${d.name || ""} ${d.location || ""}`.toLowerCase();
    const matchesSearch = searchString.includes(search.toLowerCase());
    const currentCategory = String(d.category_id || d.category || "");
    return matchesSearch && (selectedCategoryFilter === "all" || currentCategory === selectedCategoryFilter);
  });

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1",
    backgroundColor: "#fff", fontSize: "14px", color: "#334155", outline: "none", boxSizing: "border-box"
  };

  return (
    <div style={{ padding: "30px", background: "#f8fafc", minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>
      
      {/* HEADER SECTION */}
      <div style={{ marginBottom: "30px" }}>
        <h1 style={{ color: "#0f172a", fontSize: "26px", margin: "0 0 4px 0", fontWeight: "700" }}>👑 Admin Control Center</h1>
        <p style={{ color: "#64748b", margin: 0, fontSize: "14px" }}>Manage platform records, design itineraries, and manage active customer reservations.</p>
      </div>

      {/* OVERVIEW CARDS (WITH NEW BOOKING COUNTER) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "35px" }}>
        <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <span style={{ color: "#64748b", fontSize: "13px", fontWeight: "500" }}>Total Destinations</span>
          <h1 style={{ margin: "8px 0 0 0", color: "#0f172a", fontSize: "32px" }}>{destinations.length}</h1>
        </div>
        <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <span style={{ color: "#64748b", fontSize: "13px", fontWeight: "500" }}>Active System Users</span>
          <h1 style={{ margin: "8px 0 0 0", color: "#0f172a", fontSize: "32px" }}>{users.length}</h1>
        </div>
        <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <span style={{ color: "#64748b", fontSize: "13px", fontWeight: "500" }}>Active Package Bookings</span>
          <h1 style={{ margin: "8px 0 0 0", color: "#16a34a", fontSize: "32px", fontWeight: "700" }}>{bookings.length}</h1>
        </div>
      </div>

      {/* QUERY CONTROLS BAR */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "25px", background: "white", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
        <input placeholder="🔍 Query existing registry logs..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ ...inputStyle, background: "#f8fafc" }} />
        <select value={selectedCategoryFilter} onChange={(e) => setSelectedCategoryFilter(e.target.value)} style={{ ...inputStyle, background: "#f8fafc", width: "220px" }}>
          <option value="all">All Categories</option>
          {[...new Set(destinations.map(d => String(d.category_id || "")))].filter(Boolean).map(cat => (
            <option key={cat} value={cat}>{categoryMap[cat] || `Category ${cat}`}</option>
          ))}
        </select>
      </div>

      {/* MAIN TWO COLUMN WORKSPACE */}
      <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: "30px", alignItems: "start", marginBottom: "40px" }}>
        <form onSubmit={handleFormSubmit} style={{ background: "white", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0", display: "grid", gap: "12px" }}>
          <h3 style={{ margin: 0, color: "#0f172a", fontSize: "16px" }}>{editingId ? "📝 Edit Destination Profile" : "🌎 Create Destination Entry"}</h3>
          <input placeholder="Destination Name" name="name" value={form.name} onChange={handleInputChange} style={inputStyle} required />
          <input placeholder="Geographic Location" name="location" value={form.location} onChange={handleInputChange} style={inputStyle} required />
          <input placeholder="Image URL Link" name="image_url" value={form.image_url} onChange={handleInputChange} style={inputStyle} />
          <textarea placeholder="Overview Description..." name="description" value={form.description} onChange={handleInputChange} style={{ ...inputStyle, minHeight: "70px", resize: "none" }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
            <input placeholder="Rating" name="rating" value={form.rating} onChange={handleInputChange} style={inputStyle} />
            <input placeholder="Cat ID" name="category_id" value={form.category_id} onChange={handleInputChange} style={inputStyle} />
            <input placeholder="Difficulty" name="difficulty" value={form.difficulty} onChange={handleInputChange} style={inputStyle} />
          </div>
          <button type="submit" style={{ padding: "12px", background: editingId ? "#eab308" : "#2563eb", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
            {editingId ? "Commit Changes ✅" : "Publish Live Blueprint 🚀"}
          </button>
        </form>

        <div>
          <h3 style={{ margin: "0 0 16px 0", color: "#1e293b", fontSize: "16px" }}>Catalog Records ({filteredDestinations.length})</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
            {filteredDestinations.map((d) => (
              <div key={d.id} style={{ background: "white", borderRadius: "12px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
                <img src={d.image_url || "https://images.unsplash.com/photo-1544735716-392fe2489ffa"} alt={d.name} style={{ width: "100%", height: "110px", objectFit: "cover" }} />
                <div style={{ padding: "12px" }}>
                  <h4 style={{ margin: "0 0 2px 0", fontSize: "14px" }}>{d.name}</h4>
                  <p style={{ margin: "0 0 8px 0", color: "#64748b", fontSize: "12px" }}>📍 {d.location}</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                    <button type="button" onClick={() => handleEdit(d)} style={{ background: "#f0fdf4", color: "#16a34a", border: "none", padding: "5px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>Edit</button>
                    <button type="button" onClick={() => handleDelete(d.id)} style={{ background: "#fff5f5", color: "#dc2626", border: "none", padding: "5px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🌟 NEW SECTION: REAL-TIME PACKAGE BOOKINGS MATRIX */}
      <div style={{ background: "white", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0", marginBottom: "40px" }}>
        <h3 style={{ margin: "0 0 4px 0", color: "#0f172a", fontSize: "16px", fontWeight: "600" }}>📬 Package Bookings Log Matrix</h3>
        <p style={{ color: "#64748b", fontSize: "13px", margin: "0 0 16px 0" }}>Live customer tracking logs containing chosen tour dates, user accounts, and trip confirmation statuses.</p>
        
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0", textAlign: "left" }}>
                <th style={{ padding: "12px", color: "#475569" }}>Booking ID</th>
                <th style={{ padding: "12px", color: "#475569" }}>Customer Identity</th>
                <th style={{ padding: "12px", color: "#475569" }}>Selected Package/Destination</th>
                <th style={{ padding: "12px", color: "#475569" }}>Scheduled Date</th>
                <th style={{ padding: "12px", color: "#475569" }}>Verification Status</th>
                <th style={{ padding: "12px", color: "#475569", textAlign: "right" }}>Process Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: "24px", textAlign: "center", color: "#94a3b8" }}>No active package bookings registered in system database logs yet.</td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "12px", color: "#64748b", fontWeight: "500" }}>#BK-{b.id}</td>
                    <td style={{ padding: "12px", color: "#0f172a", fontWeight: "600" }}>
                      {b.user_name || b.User?.name || `User ID: ${b.user_id}`}
                      <div style={{ fontSize: "11px", color: "#64748b", fontWeight: "400" }}>{b.user_email || b.User?.email}</div>
                    </td>
                    <td style={{ padding: "12px", color: "#0284c7", fontWeight: "500" }}>
                      {b.destination_name || b.Destination?.name || `Destination ID: ${b.destination_id}`}
                    </td>
                    <td style={{ padding: "12px", color: "#334155" }}>
                      {b.booking_date ? new Date(b.booking_date).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }) : "N/A"}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span style={{
                        padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700",
                        background: b.status === "Confirmed" ? "#dcfce7" : b.status === "Cancelled" ? "#fee2e2" : "#fef9c3",
                        color: b.status === "Confirmed" ? "#15803d" : b.status === "Cancelled" ? "#b91c1c" : "#a16207"
                      }}>
                        {(b.status || "Pending").toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: "12px", textAlign: "right" }}>
                      <button
                        onClick={() => handleUpdateBookingStatus(b.id, "Confirmed")}
                        disabled={b.status === "Confirmed"}
                        style={{
                          marginRight: "6px", padding: "4px 8px", background: "#16a34a", color: "white",
                          border: "none", borderRadius: "4px", cursor: b.status === "Confirmed" ? "not-allowed" : "pointer", fontSize: "11px"
                        }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdateBookingStatus(b.id, "Cancelled")}
                        disabled={b.status === "Cancelled"}
                        style={{
                          padding: "4px 8px", background: "#dc2626", color: "white",
                          border: "none", borderRadius: "4px", cursor: b.status === "Cancelled" ? "not-allowed" : "pointer", fontSize: "11px"
                        }}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* USER ACCESS MATRIX */}
      <div style={{ background: "white", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
        <h3 style={{ margin: "0 0 16px 0", color: "#0f172a", fontSize: "16px" }}>System User Access Matrix 👥</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0", textAlign: "left" }}>
                <th style={{ padding: "12px", color: "#475569" }}>System ID</th>
                <th style={{ padding: "12px", color: "#475569" }}>User Identity</th>
                <th style={{ padding: "12px", color: "#475569" }}>Communications</th>
                <th style={{ padding: "12px", color: "#475569" }}>Access Permission</th>
                <th style={{ padding: "12px", color: "#475569", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "12px", color: "#64748b" }}>#{u.id}</td>
                  <td style={{ padding: "12px", color: "#0f172a", fontWeight: "600" }}>{u.name || "Test User"}</td>
                  <td style={{ padding: "12px", color: "#475569" }}>{u.email}</td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", background: u.role === "admin" ? "#eff6ff" : "#f1f5f9", color: u.role === "admin" ? "#2563eb" : "#475569" }}>
                      {(u.role || "user").toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "12px", textAlign: "right" }}>
                    <button type="button" onClick={() => makeAdmin(u.id)} disabled={u.role === "admin"} style={{ marginRight: "8px", padding: "5px 10px", background: u.role === "admin" ? "#f1f5f9" : "#fff", border: "1px solid #cbd5e1", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>Promote</button>
                    <button type="button" onClick={() => deleteUser(u.id)} style={{ background: "#fff5f5", color: "#dc2626", border: "1px solid #fecaca", padding: "5px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>Evict</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}