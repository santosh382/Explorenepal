import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");

  const handleLogout = () => {
    localStorage.removeItem("user");
    // Clear any active destination package temporary locks if desired
    alert("Logged out successfully. See you next time! 👋");
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 40px",
        background: "#0d6efd",
        color: "white",
      }}
    >
      {/* LOGO */}
      <h2 style={{ cursor: "pointer", margin: 0 }} onClick={() => navigate("/")}>
        Explore Nepal 🌍
      </h2>

      {/* MENU */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <Link to="/" style={{ color: "white", textDecoration: "none", fontWeight: "500" }}>
          Home
        </Link>

        {/* IF USER LOGGED IN */}
        {user ? (
          <>
            <Link to="/dashboard" style={{ color: "white", textDecoration: "none", fontWeight: "500" }}>
              Explore
            </Link>

            <Link to="/favorites" style={{ color: "white", textDecoration: "none", fontWeight: "500" }}>
              Favorites
            </Link>

            <button
              onClick={handleLogout}
              style={{
                background: "#dc3545",
                color: "white",
                border: "none",
                padding: "8px 14px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: "white", textDecoration: "none", fontWeight: "500" }}>
              Login
            </Link>

            <Link to="/register" style={{ color: "white", textDecoration: "none", fontWeight: "500" }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}