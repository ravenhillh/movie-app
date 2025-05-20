import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../UserContext";

const AllMovies = () => {
  const [watchlist, setWatchlist] = useState([]);
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    getAllMovies();
  }, []);
  const addToWatchlistClick = async (e, m) => {
    e.preventDefault;
    try {
      const response = await fetch(`http://localhost:3000/watchlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movie: m, user }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      // Show success toast
      const toast = document.createElement("div");
      toast.style.position = "fixed";
      toast.style.bottom = "20px";
      toast.style.right = "20px";
      toast.style.backgroundColor = "#4CAF50";
      toast.style.color = "white";
      toast.style.padding = "16px";
      toast.style.borderRadius = "4px";
      toast.style.zIndex = "1000";
      toast.textContent = "Movie added to your watchlist!";

      document.body.appendChild(toast);

      // Remove toast after 3 seconds
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 3000);
    } catch (error) {
      console.error("Failed to save movie recommentation:", error);
    }
  };
  const getAllMovies = async () => {
    try {
      const response = await fetch("http://localhost:3000/watchlist", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      const flattenedData = data.flat(Infinity);
      const duplicateFreeData = [
        ...new Map(flattenedData.map((item) => [item.id, item])).values(),
      ];
      setWatchlist(duplicateFreeData);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    }
  };
  const handleLongDescription = (string) => {
    if (string.length > 250) {
      return string.substring(0, 245) + "...";
    } else {
      return string;
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };
  const navbarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.75rem 1.5rem",
    backgroundColor: "#333",
    color: "white",
  };
  const linksContainerStyle = {
    display: "flex",
    gap: "1.5rem",
    alignItems: "center",
  };
  const linkStyle = {
    color: "white",
    textDecoration: "none",
    fontSize: "1.25rem",
    fontWeight: "bold",
  };
  return (
    <div>
      <nav className="navbar" style={navbarStyle}>
        <Link
          to="/"
          style={{
            color: "white",
            textDecoration: "none",
            fontSize: "2rem",
            fontWeight: "bold",
          }}
        >
          Movie Pal 🍿
        </Link>
        <div style={linksContainerStyle}>
          {user && (
            <Link style={linkStyle} to="/watchlist">
              My Profile
            </Link>
          )}
          <Link style={linkStyle} to="/movielist">
            Movie Lists
          </Link>
          <Link style={linkStyle} to="/allmovies">
            All Movies
          </Link>
          {user ? (
            <Link style={linkStyle} to="/login">
              <button onClick={logout}>Logout</button>
            </Link>
          ) : (
            <Link style={linkStyle} to="/login">
              <button>Login</button>
            </Link>
          )}
        </div>
      </nav>
      <div>
        <h1>All Movies</h1>
        <h2>Explore what others have been watching 🔍</h2>
        <h3>and click to add to your watchlist</h3>
        {watchlist.map((movie, index) => (
          <div
            key={`${movie.id} + ${index} `}
            style={{
              width: "225px",
              margin: "1%",
              padding: "15px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              borderRadius: "8px",
              display: "inline-block",
              verticalAlign: "top",
              backgroundColor: "white",
            }}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              style={{ width: "100%", height: "auto" }}
            />
            <p style={{ fontSize: "1.2em", fontWeight: "bold" }}>
              {movie.title}
            </p>
            <p
              style={{
                fontSize: "0.9em",
                lineHeight: "1.4",
                textAlign: "left",
              }}
            >
              {handleLongDescription(movie.overview)}
            </p>
            <p style={{ color: "#666", fontWeight: "bold" }}>
              Release Date: {formatDate(movie.release_date)}
            </p>{" "}
            {user ? (
              <button onClick={(e) => addToWatchlistClick(e, movie)}>
                Add to your Watchlist
              </button>
            ) : (
              <p style={{ background: "lightblue" }}>
                sign in to add to watchlist
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default AllMovies;
