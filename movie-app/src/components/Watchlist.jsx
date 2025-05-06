import React from "react";
import { Link } from "react-router-dom";

export default function Watchlist({ watchlist, setWatchlist }) {
  const handleRemove = (event, movie) => {
    event.preventDefault();
    fetch(`http://localhost:3000/watchlist/${movie.id}`, {
      method: "DELETE",
    }).then((response) => {
      if (response.ok) {
        console.log(`Removed movie ${movie.title} from watchlist`);
        setWatchlist(watchlist.filter((m) => m.id !== movie.id));
      } else {
        console.error(`Failed to remove movie ${movie.title} from watchlist`);
      }
    });
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

  return (
    <div>
      <nav
        className="navbar"
        style={{
          display: "flex",
          padding: "10px",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <h2>Movie Recommender</h2>
        <Link to="/watchlist">Watchlist</Link>
        <Link to="/">Home</Link>
      </nav>
      <h2>Watchlist</h2>
      {watchlist.map((movie) => (
        <div
          key={movie.id}
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
            style={{ width: "100%", height: "auto", borderRadius: "4px" }}
          />
          <p style={{ fontSize: "1.2em", fontWeight: "bold" }}>{movie.title}</p>
          <p
            style={{ fontSize: "0.9em", lineHeight: "1.4", textAlign: "left" }}
          >
            {handleLongDescription(movie.overview)}
          </p>
          <p style={{ color: "#666", fontWeight: "bold" }}>
            Release Date: {formatDate(movie.release_date)}
          </p>
          <button onClick={(e) => handleRemove(e, movie)}>delete movie</button>
        </div>
      ))}
    </div>
  );
}
