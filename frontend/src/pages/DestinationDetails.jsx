import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function DestinationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [place, setPlace] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [travelersCount, setTravelersCount] = useState(1);
  const [selectedGalleryImg, setSelectedGalleryImg] = useState("");

  // SYSTEM AUTHENTICATION FLOW STATE
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // TOURIST PACKAGE BOOKING STATES
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [packageDate, setPackageDate] = useState("");
  const [packageType, setPackageType] = useState("standard");
  const [packageSuccess, setPackageSuccess] = useState(false);
  const [activePackageDetails, setActivePackageDetails] = useState(null);

  useEffect(() => {
    // Synchronize seamlessly with Navbar auth state check
    const storedUserRaw = localStorage.getItem("user");
    
    if (storedUserRaw) {
      setIsLoggedIn(true);
      try {
        const parsedUser = JSON.parse(storedUserRaw);
        // Pre-populate input fields using existing system profile metrics
        if (parsedUser && parsedUser.name) setClientName(parsedUser.name);
        if (parsedUser && parsedUser.email) setClientEmail(parsedUser.email);
      } catch (e) {
        console.error("Error parsing user profile metrics:", e);
      }
    } else {
      setIsLoggedIn(false);
    }

    // Fetch destination payload metrics
    api.get("/destinations")
      .then((res) => {
        const found = res.data.find((d) => String(d.id) === String(id));
        setPlace(found);
        if (found) {
          setSelectedGalleryImg(found.image_url);
        }

        // Fetch active local package bookings instances for this destination
        const savedPackage = localStorage.getItem(`package_dest_${id}`);
        if (savedPackage) {
          setActivePackageDetails(JSON.parse(savedPackage));
        }
      })
      .catch((err) => {
        console.error("Data synchronization error:", err);
      });
  }, [id]);

  if (!place) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f8fafc" }}>
        <h2 style={{ color: "#2563eb", fontFamily: "system-ui", fontWeight: "600" }}>🔄 Loading Destination Logistics Data...</h2>
      </div>
    );
  }

  // Cost Configuration & Calculation Engine
  const baseBudgetNum = parseFloat(String(place.budget).replace(/[^0-9.]/g, "")) || 25000;
  const totalCalculatedCost = baseBudgetNum * travelersCount;

  const getPackagePriceMultiplier = () => {
    if (packageType === "deluxe") return 1.5;
    if (packageType === "premium") return 2.0;
    return 1.0;
  };
  const totalPackageCost = baseBudgetNum * travelersCount * getPackagePriceMultiplier();

  const renderListItems = (dataString) => {
    if (!dataString || dataString.trim() === "") return <p style={{ color: "#94a3b8", margin: 0, fontSize: "14px" }}>No verified entities cataloged yet.</p>;
    const items = dataString.split(",").map(item => item.trim()).filter(Boolean);
    return (
      <ul style={{ margin: 0, paddingLeft: "20px", color: "#334155" }}>
        {items.map((item, index) => (
          <li key={index} style={{ marginBottom: "10px", fontSize: "15px", lineHeight: "1.5" }}>{item}</li>
        ))}
      </ul>
    );
  };

  const handlePackageBooking = (e) => {
    e.preventDefault();
    
    // Hard check verification matching local authentication status
    if (!localStorage.getItem("user")) {
      alert("Security Protocol Triggered: Please complete system authentication sequence.");
      navigate("/login");
      return;
    }

    if (!clientName || !clientEmail || !clientPhone || !packageDate) {
      alert("Error: All requested declaration fields must be fulfilled.");
      return;
    }

    const packagePayload = {
      name: clientName,
      email: clientEmail,
      phone: clientPhone,
      date: packageDate,
      type: packageType,
      travelers: travelersCount,
      totalCost: totalPackageCost,
      destinationName: place.name
    };

    localStorage.setItem(`package_dest_${id}`, JSON.stringify(packagePayload));
    setActivePackageDetails(packagePayload);
    setPackageSuccess(true);
    
    setClientPhone("");
    setPackageDate("");
  };

  const handleCancelPackage = () => {
    localStorage.removeItem(`package_dest_${id}`);
    setActivePackageDetails(null);
    setPackageSuccess(false);
  };

  const galleryThumbnails = [
    place.image_url,
    "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=500",
    "https://images.unsplash.com/photo-1528164344705-47542687000d?w=500"
  ].filter(Boolean);

  return (
    <div style={{ padding: "40px 24px", background: "#f8fafc", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif", color: "#1e293b" }}>
      
      {/* HEADER CONTROL ACTIONS BAR */}
      <div style={{ maxWidth: "1200px", margin: "0 auto 32px auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: "white", border: "1px solid #e2e8f0", padding: "12px 24px", borderRadius: "14px", cursor: "pointer", color: "#475569", fontWeight: "700", fontSize: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
        >
          ← Back to Exploration Grid
        </button>

        <div style={{ background: parseFloat(place.rating) >= 4.5 ? "#dcfce7" : "#fef9c3", color: parseFloat(place.rating) >= 4.5 ? "#15803d" : "#a16207", padding: "8px 16px", borderRadius: "30px", fontSize: "13px", fontWeight: "700" }}>
          ● Destination Status: {parseFloat(place.rating) >= 4.5 ? "Highly Recommended" : "Unstable Weather Warning"}
        </div>
      </div>

      {/* CORE WORKSPACE INTERFACE */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "40px", alignItems: "start" }}>
        
        {/* LEFT COLUMN: VISUAL MEDIA HUB & SECURED SYSTEM BOOKING */}
        <div style={{ display: "grid", gap: "32px" }}>
          <div>
            <div style={{ height: "420px", borderRadius: "24px", overflow: "hidden", boxShadow: "0 20px 25px -5px rgba(15, 23, 42, 0.08)", position: "relative", marginBottom: "16px" }}>
              <img src={selectedGalleryImg || place.image_url} alt={place.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", bottom: "20px", left: "20px", background: "rgba(15, 23, 42, 0.8)", backdropFilter: "blur(6px)", padding: "8px 16px", borderRadius: "30px", color: "white", fontSize: "14px", fontWeight: "700" }}>
                📍 {place.location}
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              {galleryThumbnails.map((thumb, idx) => (
                <div key={idx} onClick={() => setSelectedGalleryImg(thumb)} style={{ flex: 1, height: "85px", borderRadius: "14px", overflow: "hidden", cursor: "pointer", border: (selectedGalleryImg === thumb) ? "3px solid #2563eb" : "2px solid transparent" }}>
                  <img src={thumb} alt="Preview Thumbnail" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
          </div>

          {/* SECURED BOOKING INTERFACE FRAMEWORK */}
          <div style={{ background: "white", padding: "30px", borderRadius: "24px", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.04)" }}>
            <h4 style={{ margin: "0 0 6px 0", fontSize: "20px", fontWeight: "800", color: "#0f172a" }}>🗺️ Book Your Exploration Package</h4>
            <p style={{ margin: "0 0 24px 0", fontSize: "14px", color: "#64748b" }}>Secure official logistics configuration slots instantly.</p>

            {/* CRITICAL SYSTEM GATEWAY: BLOCK ANONYMOUS USERS */}
            {!isLoggedIn ? (
              <div style={{ background: "#fff1f2", border: "1px dashed #f43f5e", padding: "26px", borderRadius: "16px", textAlign: "center" }}>
                <p style={{ color: "#e11d48", fontWeight: "800", fontSize: "15px", margin: "0 0 8px 0" }}>⚠️ Authentication Required</p>
                <p style={{ fontSize: "13.5px", color: "#64748b", margin: "0 0 20px 0", lineHeight: "1.5" }}>Anonymous booking configurations are deactivated. Please access your account profile via your application navbar.</p>
                <button 
                  onClick={() => navigate("/login")}
                  style={{ background: "#e11d48", color: "white", border: "none", padding: "13px 28px", borderRadius: "12px", fontWeight: "700", cursor: "pointer", fontSize: "14px", width: "100%" }}
                >
                  Proceed to Account Login
                </button>
              </div>
            ) : activePackageDetails ? (
              /* ACTIVE CONFIRMED TICKET RECEIPT DISPLAY */
              <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "16px", border: "2px dashed #cbd5e1" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <span style={{ fontSize: "11px", background: "#16a34a", color: "white", padding: "4px 12px", borderRadius: "20px", fontWeight: "800" }}>EXPLORATION TICKET ACTIVE</span>
                  <button onClick={handleCancelPackage} style={{ border: "none", background: "none", color: "#ef4444", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>Cancel Booking</button>
                </div>
                <h5 style={{ margin: "0 0 10px 0", fontSize: "16px", color: "#0f172a", fontWeight: "700" }}>{activePackageDetails.destinationName} Package</h5>
                <div style={{ display: "grid", gap: "8px", fontSize: "13.5px", color: "#475569" }}>
                  <div>👤 Primary Tourist: <b>{activePackageDetails.name}</b></div>
                  <div>📞 Contact Line: <b>{activePackageDetails.phone}</b></div>
                  <div>📅 Departure Date: <b>{activePackageDetails.date}</b></div>
                  <div>✨ Tier Tracking Level: <span style={{ textTransform: "uppercase", fontWeight: "700", color: "#2563eb" }}>{activePackageDetails.type}</span></div>
                  <div>👥 Registration Size: <b>{activePackageDetails.travelers} Guests</b></div>
                  <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "10px", marginTop: "4px", fontSize: "16px", color: "#16a34a", fontWeight: "800" }}>
                    Total Settled Price: NPR {activePackageDetails.totalCost.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            ) : (
              /* STANDARD PROCESSING COMPONENT REQUEST FORM */
              <form onSubmit={handlePackageBooking} style={{ display: "grid", gap: "16px" }}>
                {packageSuccess && (
                  <div style={{ background: "#dcfce7", color: "#15803d", padding: "10px", borderRadius: "8px", fontSize: "13px", fontWeight: "700" }}>
                    ✓ Expedition package booking metrics successfully saved in server cache!
                  </div>
                )}
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "800", color: "#475569", marginBottom: "6px" }}>FULL LEGAL NAME</label>
                  <input type="text" placeholder="John Doe" value={clientName} onChange={(e) => setClientName(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "14px", boxSizing: "border-box" }} required />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "800", color: "#475569", marginBottom: "6px" }}>EMAIL ADDRESS</label>
                    <input type="email" placeholder="name@domain.com" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "14px", boxSizing: "border-box" }} required />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "800", color: "#475569", marginBottom: "6px" }}>CONTACT PHONE</label>
                    <input type="tel" placeholder="+977 98XXXXXXXX" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "14px", boxSizing: "border-box" }} required />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "800", color: "#475569", marginBottom: "6px" }}>DEPARTURE DATE</label>
                    <input type="date" value={packageDate} onChange={(e) => setPackageDate(e.target.value)} style={{ width: "100%", padding: "11px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "14px", boxSizing: "border-box", fontWeight: "600" }} required />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "800", color: "#475569", marginBottom: "6px" }}>PACKAGE TIER LEVEL</label>
                    <select value={packageType} onChange={(e) => setPackageType(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "14px", background: "#f8fafc", fontWeight: "600" }}>
                      <option value="standard">Standard (Base Camp Accommodation)</option>
                      <option value="deluxe">Deluxe (Comfort Lodges + Porter Support)</option>
                      <option value="premium">Premium (Luxury Suite + Private Guide Services)</option>
                    </select>
                  </div>
                </div>

                <div style={{ background: "#eff6ff", padding: "14px", borderRadius: "12px", border: "1px solid #bfdbfe", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13.5px", color: "#1e40af", fontWeight: "700" }}>Package Quotation Engine:</span>
                  <span style={{ fontSize: "18px", color: "#2563eb", fontWeight: "800" }}>NPR {totalPackageCost.toLocaleString("en-IN")}</span>
                </div>

                <button type="submit" style={{ width: "100%", padding: "14px", border: "none", background: "#2563eb", color: "white", borderRadius: "12px", fontWeight: "700", fontSize: "14px", cursor: "pointer", boxShadow: "0 4px 6px rgba(37, 99, 235, 0.2)" }}>
                  Confirm & Lock Journey Package
                </button>
              </form>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILED SPECIFICATIONS ARCHITECTURE */}
        <div style={{ display: "grid", gap: "32px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
              <h1 style={{ fontSize: "42px", margin: 0, fontWeight: "800", color: "#0f172a", letterSpacing: "-1.5px" }}>{place.name} 🇳🇵</h1>
              <div style={{ background: "#eff6ff", color: "#2563eb", padding: "6px 14px", borderRadius: "12px", fontWeight: "800", fontSize: "15px" }}>
                ⭐ {place.rating || "Unrated Track"}
              </div>
            </div>
            <p style={{ margin: 0, color: "#64748b", fontSize: "16px" }}>Explore validated geographical terrains and local cultural points.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={{ background: "white", padding: "18px 22px", borderRadius: "18px", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "700", textTransform: "uppercase" }}>Difficulty Matrix</div>
              <div style={{ fontSize: "17px", color: "#0f172a", fontWeight: "800", marginTop: "6px" }}>🏔️ {place.difficulty || "Standard Grade"}</div>
            </div>
            <div style={{ background: "white", padding: "18px 22px", borderRadius: "18px", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "700", textTransform: "uppercase" }}>Optimal Weather Window</div>
              <div style={{ fontSize: "17px", color: "#0f172a", fontWeight: "800", marginTop: "6px" }}>☀️ {place.weather || "Seasonal Availability"}</div>
            </div>
          </div>

          {/* DYNAMIC REGISTRATION SCALE HUB */}
          <div style={{ background: "#f1f5f9", padding: "24px", borderRadius: "20px", border: "1px solid #cbd5e1" }}>
            <h4 style={{ margin: "0 0 14px 0", fontSize: "15px", color: "#1e293b", fontWeight: "800" }}>🎒 Dynamic Registration Scale (Applies to Calculator)</h4>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
              <span style={{ fontSize: "14px", color: "#475569", fontWeight: "500" }}>Active Tour Members Assigned:</span>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", background: "white", padding: "8px 14px", borderRadius: "12px", border: "1px solid #cbd5e1" }}>
                <button onClick={() => setTravelersCount(Math.max(1, travelersCount - 1))} style={{ border: "none", background: "none", fontWeight: "800", cursor: "pointer", fontSize: "18px", padding: "0 4px", color: "#64748b" }}>-</button>
                <span style={{ fontWeight: "800", color: "#0f172a", minWidth: "24px", textAlign: "center" }}>{travelersCount}</span>
                <button onClick={() => setTravelersCount(travelersCount + 1)} style={{ border: "none", background: "none", fontWeight: "800", cursor: "pointer", fontSize: "18px", padding: "0 4px", color: "#64748b" }}>+</button>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed #cbd5e1", paddingTop: "14px" }}>
              <span style={{ fontSize: "14px", color: "#475569", fontWeight: "600" }}>Calculated Base Overhead:</span>
              <span style={{ fontSize: "22px", color: "#16a34a", fontWeight: "800" }}>NPR {totalCalculatedCost.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* TOURIST LOGISTICS INFORMATION SYSTEM */}
          <div style={{ background: "white", borderRadius: "22px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
            <div style={{ display: "flex", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              {["overview", "services", "guide"].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, padding: "18px 16px", border: "none", background: activeTab === tab ? "white" : "transparent", color: activeTab === tab ? "#2563eb" : "#64748b", fontWeight: "700", fontSize: "14px", cursor: "pointer", borderBottom: activeTab === tab ? "3px solid #2563eb" : "3px solid transparent" }}>
                  {tab === "overview" ? "Overview" : tab === "services" ? "Accommodations" : "🗺️ Travel Guide (Transit/Stay)"}
                </button>
              ))}
            </div>

            <div style={{ padding: "26px" }}>
              {activeTab === "overview" && (
                <div>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "18px", fontWeight: "700", color: "#0f172a" }}>Expedition Profile</h3>
                  <p style={{ color: "#475569", fontSize: "14.5px", lineHeight: "1.75", margin: 0 }}>{place.description || "Detailed informational data strings are absent for this precise platform data marker."}</p>
                </div>
              )}

              {activeTab === "services" && (
                <div style={{ display: "grid", gap: "24px" }}>
                  <div>
                    <h4 style={{ margin: "0 0 10px 0", color: "#0f172a", fontSize: "15px", fontWeight: "700" }}>🏨 Verified Lodges & Basecamps</h4>
                    {renderListItems(place.hotels)}
                  </div>
                  <div>
                    <h4 style={{ margin: "0 0 10px 0", color: "#0f172a", fontSize: "15px", fontWeight: "700" }}>🍜 Dine & Local Hotspots</h4>
                    {renderListItems(place.restaurants)}
                  </div>
                </div>
              )}

              {/* ACTIONABLE ENGLISH TOURIST MAP AND LOGISTICS */}
              {activeTab === "guide" && (
                <div style={{ display: "grid", gap: "20px" }}>
                  <div style={{ background: "#f0fdf4", padding: "18px", borderRadius: "14px", border: "1px solid #bbf7d0" }}>
                    <h4 style={{ margin: "0 0 8px 0", color: "#166534", fontSize: "15px", fontWeight: "800" }}>🚗 How to Get There (Transit Route)</h4>
                    <p style={{ color: "#14532d", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                      Direct deluxe tourist coaches, shared local microbuses, or private 4WD jeeps depart daily from Kathmandu terminal networks directly bound for <b>{place.location}</b>. Alternatively, domestic commercial flights connect to the closest regional airport hub, followed by standard ground shuttles.
                    </p>
                  </div>

                  <div style={{ background: "#fff7ed", padding: "18px", borderRadius: "14px", border: "1px solid #fed7aa" }}>
                    <h4 style={{ margin: "0 0 8px 0", color: "#9a3412", fontSize: "15px", fontWeight: "800" }}>🏡 Where to Stay (Lodging Logistics)</h4>
                    <p style={{ color: "#7c2d12", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                      Accommodations vary widely from premium high-end modern resorts to verified local community Homestays. Booking homestays is highly advised to engage directly with traditional cultural hospitality, localized customs, and fresh organic meals.
                    </p>
                  </div>

                  <div style={{ background: "#eff6ff", padding: "18px", borderRadius: "14px", border: "1px solid #bfdbfe" }}>
                    <h4 style={{ margin: "0 0 4px 0", color: "#1e40af", fontSize: "14px", fontWeight: "700" }}>💡 Critical Advisory Tip</h4>
                    <p style={{ color: "#1e3a8a", fontSize: "13.5px", margin: 0 }}>{place.travel_tips || "Track dynamic weather patterns prior to departure. Always secure sufficient physical Nepalese Currency notes (NPR) as cellular banking grids can drop down in remote regions."}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}