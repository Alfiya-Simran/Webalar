import React, { useState } from "react";
import { login as loginAPI } from "../services/auth";
import { useAuth } from "../content/AuthContext";
import { useNavigate, Link } from "react-router-dom"; // <-- Link added
import styles from "./Login.module.css"; // Assuming you use CSS Modules

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginAPI(form);
      login(data.user, data.token);
      navigate("/board");
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          className={styles.input}
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          className={styles.input}
          name="password"
          placeholder="Password"
          type="password"
          onChange={handleChange}
          required
        />
        <button className={styles.button} type="submit">
          Login
        </button>
      </form>

      {/* 🔗 Register Link */}
      <p style={{ marginTop: "1rem", textAlign: "center" }}>
        Don't have an account?{" "}
        <Link to="/register" style={{ color: "#4f46e5", textDecoration: "underline" }}>
          Register here
        </Link>
      </p>
    </div>
  );
}
