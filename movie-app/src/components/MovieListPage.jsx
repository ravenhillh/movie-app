import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../UserContext";
import { Link } from "react-router-dom";

const MovieListPage = () => {
  const { user, logout } = useContext(AuthContext);
  const [movieLists, setMovieLists] = useState([]);

  useEffect(() => {
    getAllMovieLists();
  }, []);

  const getAllMovieLists = async () => {
    try {
      const response = await fetch(`http://localhost:3000/movielist/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setMovieLists(data);
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch movie recommendation:", error);
    }
  };
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
        // Show error toast
        const toast = document.createElement("div");
        toast.style.position = "fixed";
        toast.style.bottom = "20px";
        toast.style.right = "20px";
        toast.style.backgroundColor = "#F44336";
        toast.style.color = "white";
        toast.style.padding = "16px";
        toast.style.borderRadius = "4px";
        toast.style.zIndex = "1000";
        toast.textContent = "Sign in to add to watchlist";
        document.body.appendChild(toast);
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 3000);
        return;
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
        <Link to="/" style={linkStyle}>
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
            <button onClick={logout}>Logout</button>
          ) : (
            <Link style={linkStyle} to="/login">
              <button>Login</button>
            </Link>
          )}
        </div>
      </nav>
      <div className="movie-list-container">
        <h1>Movie Lists</h1>
        <h2>Explore other people's movie lists to get ideas 👀</h2>
        <h3>and click to add to your watchlist!</h3>
        <ul>
          {movieLists.map((list, index) => (
            <li
              key={`${list.id} + ${index} `}
              style={{
                backgroundColor: "#f8f9fa",
                padding: "15px",
                marginBottom: "10px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                listStyle: "none",
              }}
            >
              <h3
                style={{
                  color: "#2c3e50",
                  marginBottom: "8px",
                  fontSize: "1.2em",
                }}
              >
                {list.title}
              </h3>
              <p
                style={{
                  color: "#666",
                  fontSize: "0.9em",
                  lineHeight: "1.5",
                  margin: "0",
                }}
              >
                {list.description}
              </p>
              {list.movies.map((movie, index) => {
                return (
                  <div
                    key={`${movie.id} + ${index} `}
                    style={{
                      display: "inline-block",
                      position: "relative",
                      margin: "8px",
                    }}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      onClick={(e) => addToWatchlistClick(e, movie)}
                      style={{
                        width: "auto",
                        height: "192px",
                        borderRadius: "4px",
                      }}
                      onMouseEnter={(e) => {
                        const tooltip = e.currentTarget.nextSibling;
                        tooltip.style.visibility = "visible";
                        tooltip.style.opacity = 1;
                      }}
                      onMouseLeave={(e) => {
                        const tooltip = e.currentTarget.nextSibling;
                        tooltip.style.visibility = "hidden";
                        tooltip.style.opacity = 0;
                      }}
                    />
                    <div
                      style={{
                        visibility: "hidden",
                        opacity: 0,
                        transition: "opacity 0.3s",
                        backgroundColor: "rgba(0, 0, 0, 0.75)",
                        color: "#fff",
                        textAlign: "left",
                        padding: "10px",
                        borderRadius: "4px",
                        position: "absolute",
                        bottom: "100%",
                        left: "0",
                        width: "200px",
                        zIndex: 1,
                        pointerEvents: "none", // prevents accidental interaction
                      }}
                    >
                      <strong>{movie.title}</strong>
                      <p style={{ margin: 0, fontSize: "12px" }}>
                        {movie.overview}
                      </p>
                    </div>
                  </div>
                );
              })}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default MovieListPage;
