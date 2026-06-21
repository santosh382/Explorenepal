import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);

      // Saves user object with name, email, and role matching system structure
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login Successful 😎");

      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Authentication Error:", err);
      alert("Invalid Email or Password ❌");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7fa",
        fontFamily: "system-ui, sans-serif"
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          width: "400px",
          background: "white",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
          border: "1px solid #e2e8f0"
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "25px", color: "#0f172a", fontSize: "28px" }}>
          Explore Nepal 🌍
        </h1>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>EMAIL ADDRESS</label>
          <input
            type="email"
            placeholder="name@domain.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", boxSizing: "border-box" }}
            required
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>PASSWORD</label>
          <input
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", boxSizing: "border-box" }}
            required
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            background: "#0d6efd",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "600"
          }}
        >
          Sign In
        </button>

        <div style={{ marginTop: "20px", textAlign: "center", color: "#64748b", fontSize: "14px" }}>
          <p style={{ margin: "0 0 8px 0" }}>Don't have an account?</p>
          <Link to="/register" style={{ color: "#0d6efd", textDecoration: "none", fontWeight: "600" }}>
            Register Here
          </Link>
        </div>
      </form>
    </div>
  );
}