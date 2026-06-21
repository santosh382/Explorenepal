import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Dashboard() {
  const navigate = useNavigate();

  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState("Guest");

  useEffect(() => {
    // Load User Session
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData.name || userData.email);
    }

    // Load Local Wishlist Registry
    const savedFavs = localStorage.getItem("nepal_fav_spots");
    if (savedFavs) {
      setFavorites(JSON.parse(savedFavs));
    }

    // Fetch Base API Records
    api.get("/destinations")
      .then((res) => {
        setDestinations(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Toggle favorite state handler
  const toggleFavorite = (id, e) => {
    e.stopPropagation(); // Stop routing trigger on heart click
    let updatedFavs = [...favorites];
    if (updatedFavs.includes(id)) {
      updatedFavs = updatedFavs.filter(favId => favId !== id);
    } else {
      updatedFavs.push(id);
    }
    setFavorites(updatedFavs);
    localStorage.setItem("nepal_fav_spots", JSON.stringify(updatedFavs));
  };

  // Comprehensive Pipeline Logic: Search + Category Filter + Wishlist Mode + Sorting
  const processedDestinations = destinations
    .filter((d) => {
      const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || 
                            d.location?.toLowerCase().includes(search.toLowerCase());
      const currentCategory = String(d.category_id || d.category || "");
      const matchesCategory = selectedCategory === "all" || currentCategory === selectedCategory;
      const matchesWishlist = !showFavoritesOnly || favorites.includes(d.id);
      
      return matchesSearch && matchesCategory && matchesWishlist;
    })
    .sort((a, b) => {
      if (sortBy === "rating-high") {
        return (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0);
      }
      if (sortBy === "budget-low") {
        return (parseFloat(a.budget) || 0) - (parseFloat(b.budget) || 0);
      }
      if (sortBy === "budget-high") {
        return (parseFloat(b.budget) || 0) - (parseFloat(a.budget) || 0);
      }
      return 0; // default initial layout
    });

  // Unique Categories dynamically determined
  const categories = ["all", ...new Set(destinations.map(d => String(d.category_id || d.category)).filter(Boolean))];

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div
      style={{
        padding: "40px 24px",
        background: "#f4f6f9",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
      }}
    >
      {/* 1. PREMIUM HEADER ACTION BRANDING BAR */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#1e293b",
          padding: "24px 36px",
          borderRadius: "20px",
          boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.15)",
          marginBottom: "36px",
          flexWrap: "wrap",
          gap: "20px"
        }}
      >
        <div>
          <h1 style={{ color: "#ffffff", fontSize: "34px", margin: "0 0 6px 0", fontWeight: "800", letterSpacing: "-0.5px" }}>
            Explore Nepal 🇳🇵
          </h1>
          <p style={{ color: "#94a3b8", margin: 0, fontSize: "16px" }}>
            Welcome back, <span style={{ color: "#38bdf8", fontWeight: "600" }}>{user}</span>! Planning your next Himalayan escape?
          </p>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: "12px 24px",
            border: "none",
            background: "rgba(239, 68, 68, 0.1)",
            color: "#f87171",
            borderRadius: "12px",
            fontWeight: "600",
            fontSize: "14px",
            cursor: "pointer",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            transition: "all 0.2s"
          }}
        >
          Logout Session
        </button>
      </div>

      {/* 2. DYNAMIC ANALYTICS SUMMARY COUNTERS */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "36px", flexWrap: "wrap" }}>
        <div style={{ background: "white", padding: "20px 28px", borderRadius: "16px", flex: "1 1 200px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", borderLeft: "5px solid #2563eb" }}>
          <div style={{ color: "#64748b", fontSize: "14px", fontWeight: "600" }}>Available Expeditions</div>
          <div style={{ fontSize: "28px", fontWeight: "800", color: "#1e293b", marginTop: "4px" }}>{destinations.length} Spots</div>
        </div>
        <div style={{ background: "white", padding: "20px 28px", borderRadius: "16px", flex: "1 1 200px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", borderLeft: "5px solid #ec4899" }}>
          <div style={{ color: "#64748b", fontSize: "14px", fontWeight: "600" }}>Your Personal Wishlist</div>
          <div style={{ fontSize: "28px", fontWeight: "800", color: "#1e293b", marginTop: "4px" }}>❤️ {favorites.length} Saved</div>
        </div>
      </div>

      {/* 3. MULTI-FUNCTIONAL CONTROL PANEL PANEL */}
      <div style={{ background: "white", padding: "24px", borderRadius: "20px", boxShadow: "0 4px 15px rgba(0,0,0,0.03)", marginBottom: "32px" }}>
        {/* ROW 1: SEARCH & SORT METRICS */}
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "20px" }}>
          <div style={{ flex: "1 1 400px" }}>
            <input
              type="text"
              placeholder="🔍 Search trails, landmarks, mountains or cities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 20px",
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
                backgroundColor: "#f8fafc"
              }}
            />
          </div>

          {/* ADVANCED SORT ENGINE */}
          <div style={{ flex: "1 1 200px" }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                fontSize: "14px",
                outline: "none",
                cursor: "pointer",
                backgroundColor: "#f8fafc",
                color: "#475569",
                fontWeight: "500"
              }}
            >
              <option value="default">↕️ Default Ordering</option>
              <option value="rating-high">⭐ Rating: High to Low</option>
              <option value="budget-low">💰 Budget: Low to High</option>
              <option value="budget-high">💰 Budget: High to Low</option>
            </select>
          </div>
        </div>

        {/* ROW 2: ADVANCED FILTERING TABS TOGGLES */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", borderTop: "1px solid #f1f5f9", paddingTop: "16px" }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "10px",
                  border: "none",
                  background: selectedCategory === cat ? "#2563eb" : "#f1f5f9",
                  color: selectedCategory === cat ? "white" : "#475569",
                  fontWeight: "600",
                  fontSize: "13px",
                  cursor: "pointer",
                  textTransform: "capitalize"
                }}
              >
                {cat === "all" ? "🌐 All Regions" : `Category ${cat}`}
              </button>
            ))}
          </div>

          {/* WISHLIST TOGGLE BUTTON */}
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            style={{
              padding: "8px 16px",
              borderRadius: "10px",
              border: "none",
              background: showFavoritesOnly ? "#ec4899" : "#fce7f3",
              color: showFavoritesOnly ? "white" : "#db2777",
              fontWeight: "700",
              fontSize: "13px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            {showFavoritesOnly ? "Show All Items" : "❤️ Saved Spots Only"}
          </button>
        </div>
      </div>

      {/* 4. MAIN INTERACTIVE DATA GRID INDEX */}
      {processedDestinations.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px", background: "white", borderRadius: "20px", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
          <h2 style={{ color: "#475569", fontWeight: "700", margin: "0 0 8px 0" }}>No Hidden Gems Uncovered</h2>
          <p style={{ color: "#94a3b8", margin: 0, fontSize: "15px" }}>Modify your query filters, adjust sorting or clear your parameters list.</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "30px"
          }}
        >
          {processedDestinations.map((d) => {
            const isFav = favorites.includes(d.id);
            return (
              <div
                key={d.id}
                style={{
                  background: "white",
                  borderRadius: "24px",
                  overflow: "hidden",
                  boxShadow: "0 10px 20px -5px rgba(0,0,0,0.05)",
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid #e2e8f0",
                  position: "relative"
                }}
              >
                {/* CARD CORE HERO COVER IMAGE */}
                <div style={{ position: "relative", height: "230px", overflow: "hidden" }}>
                  <img
                    src={d.image_url || "https://images.unsplash.com/photo-1544735716-392fe2489ffa"}
                    alt={d.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />

                  {/* ADVANCED WISHLIST LAYER BUTTON */}
                  <button
                    onClick={(e) => toggleFavorite(d.id, e)}
                    style={{
                      position: "absolute",
                      top: "14px",
                      right: "14px",
                      background: "white",
                      border: "none",
                      width: "38px",
                      height: "38px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.15)",
                      fontSize: "18px"
                    }}
                  >
                    {isFav ? "❤️" : "🤍"}
                  </button>
                  
                  {/* FLOATING RATING BADGE */}
                  <div style={{
                    position: "absolute",
                    bottom: "14px",
                    left: "14px",
                    background: "rgba(15, 23, 42, 0.75)",
                    backdropFilter: "blur(4px)",
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "30px",
                    fontSize: "12px",
                    fontWeight: "700"
                  }}>
                    ⭐ {d.rating || "N/A"}
                  </div>

                  {/* DIFFICULTY METRIC LAYER */}
                  {d.difficulty && (
                    <div style={{
                      position: "absolute",
                      top: "14px",
                      left: "14px",
                      background: "#fff7ed",
                      color: "#c2410c",
                      padding: "4px 10px",
                      borderRadius: "8px",
                      fontSize: "11px",
                      fontWeight: "700",
                      textTransform: "uppercase"
                    }}>
                      🏔️ {d.difficulty}
                    </div>
                  )}
                </div>

                {/* FILE CONFIGURATION DETAILS WRAPPER */}
                <div style={{ padding: "24px", flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                      <h2 style={{ margin: 0, color: "#0f172a", fontSize: "21px", fontWeight: "700" }}>
                        {d.name}
                      </h2>
                    </div>
                    
                    <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "14px", flexWrap: "wrap" }}>
                      <span style={{ color: "#64748b", fontSize: "13px", fontWeight: "600" }}>
                        📍 {d.location}
                      </span>
                      {d.budget && (
                        <span style={{ background: "#f0fdf4", color: "#16a34a", padding: "2px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700" }}>
                          रू {d.budget}
                        </span>
                      )}
                    </div>

                    <p style={{ color: "#475569", fontSize: "13px", lineHeight: "1.6", margin: "0 0 20px 0", display: "-webkit-box", WebkitLineClamp: "3", WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {d.description || "Comprehensive travel log description not added yet by platform orchestrators."}
                    </p>
                  </div>

                  {/* EXPLORATION REDIRECT ENGINE */}
                  <button
                    onClick={() => navigate(`/destination/${d.id}`)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "none",
                      background: "#2563eb",
                      color: "white",
                      borderRadius: "12px",
                      fontWeight: "700",
                      fontSize: "13px",
                      cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)"
                    }}
                  >
                    View Interactive Itinerary →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}