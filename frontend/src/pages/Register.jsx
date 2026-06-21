import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleRegister = async (e) => {

    e.preventDefault();

    try {

      await api.post(
        "/auth/register",
        form
      );

      alert("Registration Successful 😎");

      navigate("/login");

    } catch (err) {

      console.log(err);

      alert("Registration Failed ❌");

    }

  };

  return (

    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f5f7fa",
      }}
    >

      <form
        onSubmit={handleRegister}
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "15px",
          width: "350px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >

        <h1
          style={{
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          Register 🌍
        </h1>

        <input
          type="text"
          placeholder="Enter Name"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value
            })
          }
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value
            })
          }
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value
            })
          }
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            border: "none",
            borderRadius: "8px",
            background: "#198754",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Register
        </button>

      </form>

    </div>

  );

}