import React from "react";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../UserContext";

export default function Home() {
  const { user } = useContext(AuthContext);
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
      // console.log(data.results);
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
      console.log(data.results);
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

  return (
    <div>
      <div className="search-container">
        <h1>Find a movie 🎥</h1>
        <div
          style={{
            fontSize: "1.25rem",
            maxWidth: "800px",
            margin: "0 auto",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          <p>Enter the name of the movie you want recommendations for</p>
          <p>
            {" "}
            then select the correct option from the images to get your
            recommendations:
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="search-form"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <input
            type="text"
            value={movie}
            onChange={(e) => setMovie(e.target.value)}
            placeholder="Enter a movie title"
            style={{
              padding: "0.5rem",
              fontSize: "1.25rem",
              borderRadius: "0.25rem",
              border: "1px solid #ccc",
              width: "100%",
              maxWidth: "400px",
            }}
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
