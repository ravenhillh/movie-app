import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../UserContext";
// import moviePic from "../assets/movie_theater.jpeg";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const user = await response.json();
      login(user);
      setSuccess("Login successful!");
      setUsername("");
      setPassword("");
      navigate("/");
    } catch (error) {
      console.error("Failed to login:", error);
      setError("Invalid username or password");
    }
  };
  return (
    <div>
      <h1 style={{ fontSize: "3rem", paddingBottom: "100px" }}>Movie Pal 🍿</h1>
      <h2 style={{ fontSize: "2rem" }}>Login</h2>
      <p>Please enter your username and password to login.</p>
      <p>
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
          padding: "2.5rem",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "400px",
          margin: "0 auto",
        }}
      >
        <label
          style={{
            width: "100%",
            fontSize: "1rem",
            color: "#333",
          }}
        >
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              marginTop: "0.5rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "1rem",
            }}
          />
        </label>
        <label
          style={{
            width: "100%",
            fontSize: "1rem",
            color: "#333",
          }}
        >
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              marginTop: "0.5rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "1rem",
            }}
          />
        </label>
        <button
          type="submit"
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "0.75rem 1.5rem",
            border: "none",
            borderRadius: "4px",
            fontSize: "1rem",
            cursor: "pointer",
            transition: "background-color 0.2s",
            width: "100%",
          }}
        >
          Login
        </button>
      </form>{" "}
      {error && <p>{error}</p>}
      {success && <p>{success}</p>}
    </div>
  );
}
