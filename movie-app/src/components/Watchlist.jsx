import React, { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function Watchlist({ watchlist, setWatchlist }) {
  // add in delete movie list button
  // add in delete movie from movie list button
  // fix up css styling
  // add in a page to show all movie lists
  // add in a page to show all movies from everyones watchlist
  // come up with a better name for the app
  // see if theres an endpoint to show where a movie is streaming
  // fix the issue with the movie list dropdown
  // fix the issue with the page refreshing
  const { user } = useContext(UserContext);
  const [movieListTitle, setMovieListTitle] = useState("");
  const [movieListDescription, setMovieListDescription] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [movieListOptionId, setMovieListOptionId] = useState(null);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  // fetch the watchlist for the current user - all movies
  const getWatchlist = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/watchlist/user/${user.user.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setWatchlist(data);
    } catch (error) {
      console.error("Failed to fetch movie recommendation:", error);
    }
  };

  const getMovieLists = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/movielist/user/${user.user.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setMovieList(data, "inside of get movie list");
    } catch (error) {
      console.error("Failed to fetch movie recommendation:", error);
    }
  };

  const handleRemove = (event, movie) => {
    event.preventDefault();
    fetch(`http://localhost:3000/watchlist/${movie.id}/${user.user.id}`, {
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
  const handleCreateMovieList = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/movielist/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: movieListTitle,
          description: movieListDescription,
          id: user.user.id,
        }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      setMovieList(data);
      setMovieListTitle("");
      setMovieListDescription("");
    } catch (error) {
      console.error("Failed to create movie list:", error);
    }
  };
  const handleAddToMovieList = async (e, movie) => {
    e.preventDefault();
    try {
      console.log(movieListOptionId, "hello");
      const response = await fetch(`http://localhost:3000/movielist/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movie: movie,
          id: movieListOptionId,
        }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      console.log("success", data);
      getMovieLists();
    } catch (error) {
      console.error("Failed to add to movie list:", error);
    }
  };
  useEffect(() => {
    getWatchlist();
    getMovieLists();
  }, []);
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
        <div style={linksContainerStyle}>
          <Link to="/watchlist" style={linkStyle}>
            Watchlist
          </Link>
          <Link to="/" style={linkStyle}>
            Home
          </Link>
          <Link style={linkStyle} to="/watchlist">
            Movie Lists
          </Link>
          <Link style={linkStyle} to="/watchlist">
            All Movies
          </Link>
        </div>
      </nav>
      <h2>{user.user.username}'s Watchlist</h2>
      <button onClick={() => setIsWatchlistOpen(!isWatchlistOpen)}>
        View Watchlist
      </button>
      {isWatchlistOpen &&
        watchlist.map((movie) => (
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
            </p>
            <button onClick={(e) => handleRemove(e, movie)}>
              delete movie
            </button>
            <div className="add-to-list-button">
              <button onClick={(e) => handleAddToMovieList(e, movie)}>
                Add to a Movie List
              </button>
              <select onChange={(e) => setMovieListOptionId(e.target.value)}>
                <option value="">Select a list</option>
                {movieList.map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.title}
                  </option>
                ))}
              </select>
            </div>{" "}
          </div>
        ))}

      <div>
        <h2>Create a Movie List</h2>
        <form onSubmit={handleCreateMovieList}>
          <label>
            Title:
            <input
              type="text"
              value={movieListTitle}
              onChange={(e) => setMovieListTitle(e.target.value)}
            />
          </label>
          <label>
            Description:
            <textarea
              value={movieListDescription}
              onChange={(e) => setMovieListDescription(e.target.value)}
            />
          </label>
          <button type="submit">Create Movie List</button>
        </form>
        {movieList && (
          <div>
            <h2>Movie Lists</h2>
            <ul>
              {movieList.map((list) => (
                <li
                  key={list.id}
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
                  {list.movies.map((movie) => {
                    return (
                      <div
                        key={movie.id}
                        style={{
                          display: "inline-block",
                          position: "relative",
                          margin: "8px",
                        }}
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
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
        )}
      </div>
    </div>
  );
}
