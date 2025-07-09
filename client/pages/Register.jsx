import React, { useState } from "react";
import styles from "./Register.module.css";
import { register as registerAPI } from "../services/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerAPI(form);
      alert("Registered successfully! You can now login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          className={styles.input}
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
        />
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
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button className={styles.button} type="submit">Register</button>
      </form>
    </div>
  );
}
