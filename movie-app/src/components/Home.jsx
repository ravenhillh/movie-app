import React from "react";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function Home({ getWatchlist }) {
  const { user } = useContext(UserContext);

  const [movie, setMovie] = useState("");
  const [recommendations, setRecommendations] = useState(null);
  const [options, setOptions] = useState([]);
  const getMovieRec = async () => {
    try {
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
        body: JSON.stringify({ movie: m }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      getWatchlist();
    } catch (error) {
      console.error("Failed to save movie recommentation:", error);
    }
  };
  return (
    <div>
      <nav
        className="navbar"
        style={{
          display: "flex",
          padding: "10px",
          gap: "100px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2>Movie Recommender</h2>
        {user && <Link to="/watchlist">Watchlist</Link>}
        {user ? (
          <Link to="/logout">
            <button>Logout</button>
          </Link>
        ) : (
          <Link to="/login">
            <button>Login</button>
          </Link>
        )}
      </nav>

      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={movie}
          onChange={(e) => setMovie(e.target.value)}
          placeholder="Enter a movie title"
        />
        <button type="submit">Find Movie</button>
      </form>
      <div className="movie-container">
        {options.length != 0 && (
          <h2>Click the movie you want recommendations for:</h2>
        )}
        {options.map((option) => {
          if (option.poster_path) {
            return (
              <div
                key={option.id}
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
            {recommendations.map((rec) => (
              <div
                key={rec.id}
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
