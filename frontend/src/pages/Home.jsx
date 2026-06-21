import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Home() {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeAlertIndex, setActiveAlertIndex] = useState(0);

  // NEW FEATURE: Live Season Advisory Ticker Data
  const liveAlerts = [
    "🌤️ Premium Travel Alert: Autumn & Spring clearing windows are now fully active across Annapurna trails.",
    "🏔️ Local Guide: Permit registration matrices can now be directly verified via digital immigration portals.",
    "🎒 Safety Dispatch: Always maintain certified local satellite logs before venturing past 4,000m coordinates."
  ];

  useEffect(() => {
    api.get("/destinations")
      .then((res) => {
        setPlaces(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    // Carousel loop logic for the live announcement ticker
    const alertTimer = setInterval(() => {
      setActiveAlertIndex((prev) => (prev + 1) % liveAlerts.length);
    }, 5000);
    return () => clearInterval(alertTimer);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchKeyword.trim() !== "") {
      navigate("/dashboard", { state: { initialSearch: searchKeyword } });
    } else {
      navigate("/dashboard");
    }
  };

  // NEW FEATURE: Direct Route to Dashboard with auto-selected category tag
  const handleCategoryQuickRoute = (categoryName) => {
    navigate("/dashboard", { state: { directCategory: categoryName } });
  };

  const featuredPlaces = places
    .sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0))
    .slice(0, 4);

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif", color: "#1e293b" }}>
      
      {/* 1. NEW FEATURE: LIVE ADVISORY TICKER TOP BANNER */}
      <div style={{
        background: "#0f172a",
        color: "#38bdf8",
        padding: "10px 20px",
        fontSize: "13px",
        fontWeight: "600",
        textAlign: "center",
        borderBottom: "1px solid rgba(56, 189, 248, 0.2)",
        transition: "all 0.5s ease",
        letterSpacing: "0.3px"
      }}>
        {liveAlerts[activeAlertIndex]}
      </div>

      {/* 2. ADVANCED IMMERSIVE HERO BANNER */}
      <div 
        className="hero"
        style={{
          position: "relative",
          backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.85)), url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "110px 20px 90px 20px",
          textAlign: "center",
          color: "white"
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <span style={{ background: "rgba(255,255,255,0.18)", padding: "6px 16px", borderRadius: "30px", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.1)" }}>
            🇳🇵 Gateway to the Himalayas
          </span>
          
          <h1 style={{ fontSize: "54px", fontWeight: "800", margin: "20px 0 20px 0", letterSpacing: "-1.5px", lineHeight: "1.1" }}>
            Explore Beautiful Nepal
          </h1>
          
          <p style={{ fontSize: "19px", color: "#cbd5e1", margin: "0 auto 36px auto", maxWidth: "650px", lineHeight: "1.6" }}>
            Discover majestic mountains, sacred medieval temples, pristine glacial lakes, and unforgettable lifetime adventures.
          </p>

          {/* DYNAMIC FUNCTIONAL SEARCH BOX */}
          <form 
            onSubmit={handleSearchSubmit}
            style={{
              display: "flex",
              background: "white",
              padding: "8px",
              borderRadius: "18px",
              boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.4)",
              maxWidth: "580px",
              margin: "0 auto 32px auto",
              alignItems: "center"
            }}
          >
            <input 
              type="text"
              placeholder="Search Pokhara, Everest, Kathmandu..." 
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                padding: "14px 20px",
                fontSize: "16px",
                outline: "none",
                color: "#334155"
              }}
            />
            <button 
              type="submit"
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "14px 32px",
                borderRadius: "14px",
                fontSize: "15px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)"
              }}
            >
              Explore Now
            </button>
          </form>

          {/* NEW FEATURE: INTERACTIVE CATEGORY QUICK-FILTER TAGS */}
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "600" }}>Quick Launch:</span>
            {["Trekking", "Cultural", "Lakes", "Wildlife"].map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryQuickRoute(cat)}
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "#f8fafc",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  backdropFilter: "blur(4px)",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => { e.target.style.background = "white"; e.target.style.color = "#2563eb"; }}
                onMouseLeave={(e) => { e.target.style.background = "rgba(255, 255, 255, 0.1)"; e.target.style.color = "#f8fafc"; }}
              >
                ⛰️ {cat}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* 3. NEPAL TOURISM STATS INFOGRAPHIC BAR */}
      <div style={{ background: "#f8fafc", padding: "45px 20px", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "30px", textAlign: "center" }}>
          <div>
            <h3 style={{ fontSize: "38px", color: "#2563eb", margin: 0, fontWeight: "800" }}>8,848m</h3>
            <p style={{ color: "#64748b", margin: "6px 0 0 0", fontSize: "14px", fontWeight: "600" }}>Highest Peak (Mt. Everest)</p>
          </div>
          <div>
            <h3 style={{ fontSize: "38px", color: "#2563eb", margin: 0, fontWeight: "800" }}>10+</h3>
            <p style={{ color: "#64748b", margin: "6px 0 0 0", fontSize: "14px", fontWeight: "600" }}>UNESCO Heritage Sites</p>
          </div>
          <div>
            <h3 style={{ fontSize: "38px", color: "#2563eb", margin: 0, fontWeight: "800" }}>100+</h3>
            <p style={{ color: "#64748b", margin: "6px 0 0 0", fontSize: "14px", fontWeight: "600" }}>Exotic Trekking Trails</p>
          </div>
        </div>
      </div>

      {/* 4. REFINED FEATURED PLACES GRID SECTION */}
      <div className="places-section" style={{ padding: "80px 24px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h2 className="section-title" style={{ fontSize: "34px", fontWeight: "800", color: "#0f172a", margin: "0 0 8px 0", letterSpacing: "-0.5px" }}>
              Trending Destinations ⚡
            </h2>
            <p style={{ color: "#64748b", margin: 0, fontSize: "16px" }}>
              Handpicked highly-rated sanctuary maps recommended by native experts.
            </p>
          </div>
          
          <button 
            onClick={() => navigate("/dashboard")}
            style={{
              background: "transparent",
              color: "#2563eb",
              border: "2px solid #2563eb",
              padding: "12px 24px",
              borderRadius: "12px",
              fontWeight: "700",
              cursor: "pointer",
              fontSize: "14px",
              transition: "all 0.2s"
            }}
          >
            See All Spots →
          </button>
        </div>

        {/* DESIGN ARCHITECTURE CARDS GRID */}
        <div 
          className="places-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
            gap: "35px"
          }}
        >
          {featuredPlaces.map((place) => (
            <div
              className="place-card"
              key={place.id}
              onClick={() => navigate(`/destination/${place.id}`)}
              style={{
                background: "white",
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
                cursor: "pointer",
                transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), boxShadow 0.3s ease",
                border: "1px solid #e2e8f0",
                display: "flex",
                flexDirection: "column"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 20px 30px rgba(15, 23, 42, 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.04)";
              }}
            >
              <div style={{ position: "relative", height: "230px" }}>
                <img
                  src={place.image_url || "https://images.unsplash.com/photo-1544735716-392fe2489ffa"}
                  alt={place.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                {place.rating && (
                  <div style={{
                    position: "absolute",
                    top: "14px",
                    right: "14px",
                    background: "rgba(15, 23, 42, 0.85)",
                    backdropFilter: "blur(4px)",
                    color: "white",
                    padding: "5px 12px",
                    borderRadius: "30px",
                    fontSize: "12px",
                    fontWeight: "700"
                  }}>
                    ⭐ {place.rating}
                  </div>
                )}
              </div>

              <div className="place-content" style={{ padding: "24px", flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ margin: "0 0 6px 0", fontSize: "20px", fontWeight: "700", color: "#0f172a", letterSpacing: "-0.3px" }}>
                    {place.name}
                  </h3>
                  <p style={{ margin: "0 0 14px 0", color: "#64748b", fontSize: "14px", fontWeight: "600" }}>
                    📍 {place.location}
                  </p>
                  <p style={{ color: "#475569", fontSize: "13.5px", lineHeight: "1.6", display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflow: "hidden", margin: "0 0 20px 0" }}>
                    {place.description || "Click to explore and discover specific itinerary charts mapped for this basecamp."}
                  </p>
                </div>

                <div style={{ color: "#2563eb", fontSize: "13px", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px", borderTop: "1px solid #f1f5f9", paddingTop: "14px" }}>
                  Discover Details ➔
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. PREMIUM FOOTER */}
      <footer style={{ background: "#0f172a", color: "#64748b", padding: "50px 20px", textAlign: "center", fontSize: "14px", borderTop: "1px solid #1e293b" }}>
        <p style={{ margin: 0, fontWeight: "500" }}>© 2026 Explore Nepal Portal Inc. Built beautifully for premium mountain expeditions.</p>
      </footer>

    </div>
  );
}