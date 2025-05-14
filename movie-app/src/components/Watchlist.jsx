import React, { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../UserContext";

export default function Watchlist() {
  // fix up css styling
  // see if theres an endpoint to show where a movie is streaming

  const { user, logout } = useContext(AuthContext);
  const [movieListTitle, setMovieListTitle] = useState("");
  const [movieListDescription, setMovieListDescription] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [movieListOptionId, setMovieListOptionId] = useState(null);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(true);
  const [watchlist, setWatchlist] = useState([]);
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

  const handleRemove = async (event, movie) => {
    //figure out how to address multiple users adding same movie to watchlist and then deleting
    event.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3000/watchlist/${movie.id}/${user.user.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      getWatchlist();
    } catch (error) {
      console.error("Failed to remove movie from watchlist:", error);
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
  const handleDeleteMovieList = async (e, id) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/movielist/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      getMovieLists();
    } catch (error) {
      console.error("Failed to delete movie list:", error);
    }
  };
  const handleDeleteMovieListOption = async (e, movieId, listId) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3000/movielist/movie/${movieId}/${listId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      getMovieLists();
    } catch (error) {
      console.error("Failed to delete from movie list:", error);
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
  const popupStyle = {
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
    pointerEvents: "none",
  };
  const watchlistDiv = () => {
    return watchlist.map((movie, index) => (
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
          style={{ width: "100%", height: "auto", borderRadius: "4px" }}
        />
        <p style={{ fontSize: "1.2em", fontWeight: "bold" }}>{movie.title}</p>
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
        <button onClick={(e) => handleRemove(e, movie)}>delete movie</button>
        <div className="add-to-list-button">
          <button onClick={(e) => handleAddToMovieList(e, movie)}>
            Add to a Movie List
          </button>
          <select onChange={(e) => setMovieListOptionId(e.target.value)}>
            <option value="">Select a list</option>
            {movieList.map((list, index) => (
              <option key={`${list.id} + ${index} `} value={list.id}>
                {list.title}
              </option>
            ))}
          </select>
        </div>{" "}
      </div>
    ));
  };

  return (
    <div>
      <nav className="navbar" style={navbarStyle}>
        <Link to="/" style={linkStyle}>
          Movie Pal 🍿
        </Link>
        <div style={linksContainerStyle}>
          <Link to="/watchlist" style={linkStyle}>
            My Profile
          </Link>
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
      <h2>{user.user.username}'s Watchlist</h2>
      {isWatchlistOpen ? (
        <button onClick={() => setIsWatchlistOpen(!isWatchlistOpen)}>
          Hide
        </button>
      ) : (
        <button onClick={() => setIsWatchlistOpen(!isWatchlistOpen)}>
          View Watchlist
        </button>
      )}
      {isWatchlistOpen && watchlistDiv()}
      <div>
        <div className="create-movie-list">
          <form
            style={{
              margin: "20px auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              width: "100%",
              backgroundColor: "#d7c4e2",
              padding: "20px",
            }}
            onSubmit={handleCreateMovieList}
          >
            <h2>Create a Movie List</h2>
            <label
              style={{ display: "flex", flexDirection: "column", gap: "5px" }}
            >
              Title:
              <input
                type="text"
                value={movieListTitle}
                onChange={(e) => setMovieListTitle(e.target.value)}
              />
            </label>
            <label
              style={{ display: "flex", flexDirection: "column", gap: "5px" }}
            >
              Description:
              <textarea
                value={movieListDescription}
                onChange={(e) => setMovieListDescription(e.target.value)}
              />
            </label>
            <button type="submit" style={{ backgroundColor: "yellow" }}>
              Create Movie List
            </button>
          </form>
        </div>

        {movieList && (
          <div className="movie-list-container">
            <ul
              style={{
                listStyle: "none",
                padding: "0",
                margin: "0",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              <h2>Movie Lists</h2>
              {movieList.map((list, index) => (
                <li
                  key={`${list.id} + ${index} `}
                  style={{
                    marginBottom: "10px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    listStyle: "none",
                  }}
                >
                  <button
                    onClick={(e) => handleDeleteMovieList(e, list.id)}
                    style={{ color: "red", marginRight: "10px" }}
                  >
                    Delete List
                  </button>
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
                        <div style={popupStyle}>
                          <strong>{movie.title}</strong>
                          <p style={{ margin: 0, fontSize: "12px" }}>
                            {movie.overview}
                          </p>
                        </div>
                        //fix button so that it is clearly connected to the
                        correct movie that it will delete
                        <button
                          style={{
                            color: "red",
                          }}
                          onClick={(e) =>
                            handleDeleteMovieListOption(e, movie.id, list.id)
                          }
                        >
                          X
                        </button>
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
