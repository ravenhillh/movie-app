import React from "react";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../UserContext";

export default function Home() {
  const { user, logout } = useContext(AuthContext);
  const [movie, setMovie] = useState("");
  const [recommendations, setRecommendations] = useState(null);
  const [options, setOptions] = useState([]);
  const getMovieRec = async () => {
    try {
      if (!user) {
        alert("You must be logged in to get movie recommendations.");
        return;
      }
      const response = await fetch(`http://localhost:3000/movie`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movie: movie }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setOptions(data.results);
      setMovie("");
    } catch (error) {
      console.error("Failed to fetch movie recommendation:", error);
      // Consider adding user feedback here
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    getMovieRec();
    setRecommendations(null);
  };
  const handleClick = async (e, m) => {
    e.preventDefault;
    try {
      const response = await fetch(`http://localhost:3000/recommendation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: m }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setOptions([]);
      setRecommendations(data.results);
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
        throw new Error(`Error: ${response.status}`);
      }
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
        <h2 style={{ fontSize: "2rem" }}>Movie Pal 🍿</h2>
        <div className="links-container" style={linksContainerStyle}>
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
      <div className="search-container">
        <h1>Find a movie 🎥</h1>
        <h3>
          Enter the name of the movie you want recommendations for and select
          the correct option from the images to get your recommendations:
        </h3>
        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            value={movie}
            onChange={(e) => setMovie(e.target.value)}
            placeholder="Enter a movie title"
          />
          <button type="submit">Find Movie</button>
        </form>
      </div>
      <div className="movie-container">
        {options.length != 0 && (
          <h2>Click the movie you want recommendations for:</h2>
        )}
        {options.map((option, index) => {
          if (option.poster_path) {
            return (
              <div
                key={`${option.id} + ${index} `}
                style={{
                  width: "200px",
                  padding: "10px",
                  boxSizing: "border-box",
                  display: "inline-block",
                  verticalAlign: "top",
                  margin: "10px",
                }}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${option.poster_path}`}
                  alt={option.title}
                  style={{ width: "100%", height: "auto" }}
                  onClick={(e) => handleClick(e, option.id)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.cursor = "pointer";
                  }}
                />
              </div>
            );
          } else {
            console.log(option.poster_path);
          }
        })}{" "}
        {recommendations && (
          <div>
            <h2>Recommendations:</h2>
            <h3>Click movies to add to your watchlist</h3>
            {recommendations.map((rec, index) => (
              <div
                key={`${rec.id} + ${index} `}
                style={{
                  width: "200px",
                  padding: "10px",
                  boxSizing: "border-box",
                  display: "inline-block",
                  verticalAlign: "top",
                  margin: "10px",
                  position: "relative",
                }}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${rec.poster_path}`}
                  alt={rec.title}
                  style={{ width: "100%", height: "auto" }}
                  onClick={(e) => {
                    addToWatchlistClick(e, rec);
                    e.currentTarget.parentElement.setAttribute(
                      "data-clicked",
                      "true"
                    );
                    e.currentTarget.style.opacity = "0.7";
                    const flag = document.createElement("div");
                    flag.style.position = "absolute";
                    flag.style.top = "20px";
                    flag.style.right = "20px";
                    flag.style.background = "#4CAF50";
                    flag.style.color = "white";
                    flag.style.padding = "5px 10px";
                    flag.style.borderRadius = "3px";
                    flag.textContent = "Added";
                    e.currentTarget.parentElement.appendChild(flag);
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
