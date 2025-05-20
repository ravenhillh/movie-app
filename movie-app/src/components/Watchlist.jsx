import React, { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../UserContext";
import {
  getWatchlist,
  getMovieLists,
  handleRemove,
  handleLongDescription,
  formatDate,
  handleCreateMovieList,
  handleAddToMovieList,
  handleDeleteMovieList,
} from "../utils/utils";

export default function Watchlist() {
  const { user, logout } = useContext(AuthContext);
  const [movieListTitle, setMovieListTitle] = useState("");
  const [movieListDescription, setMovieListDescription] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [movieListOptionId, setMovieListOptionId] = useState(null);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(true);
  const [isMovieListOpen, setIsMovieListOpen] = useState(false);
  const [isCreateListOpen, setIsCreateListOpen] = useState(false);
  const [watchlist, setWatchlist] = useState([]);

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
      getMovieLists(user.user.id, setMovieList);
    } catch (error) {
      console.error("Failed to delete from movie list:", error);
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
        <button
          onClick={(e) =>
            handleRemove(e, movie, user.user.id, getWatchlist, setWatchlist)
          }
        >
          delete movie
        </button>
        <div className="add-to-list-button">
          <button
            onClick={(e) =>
              handleAddToMovieList(
                e,
                movie,
                movieListOptionId,
                user.user.id,
                setMovieList
              )
            }
          >
            Add to Movie List
          </button>
          <select
            onChange={(e) => setMovieListOptionId(e.target.value)}
            style={{
              padding: "8px 12px",
              fontSize: "14px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              backgroundColor: "#fff",
              cursor: "pointer",
              outline: "none",
              width: "100%",
              marginBottom: "10px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              transition: "border-color 0.3s ease",
            }}
          >
            <option value="">Select a list</option>
            {movieList.map((list, index) => (
              <option key={`${list.id} + ${index} `} value={list.id}>
                {list.title}
              </option>
            ))}
          </select>{" "}
        </div>{" "}
      </div>
    ));
  };
  const handleMovieListClick = () => {
    setIsCreateListOpen(false);
    setIsWatchlistOpen(false);
    setIsMovieListOpen(true);
  };
  const handleCreateListClick = () => {
    setIsCreateListOpen(true);
    setIsWatchlistOpen(false);
    setIsMovieListOpen(false);
  };
  const handleWatchlistClick = () => {
    setIsCreateListOpen(false);
    setIsWatchlistOpen(true);
    setIsMovieListOpen(false);
  };
  useEffect(() => {
    if (user && user.user && user.user.id) {
      getWatchlist(user.user.id, setWatchlist);
      getMovieLists(user.user.id, setMovieList);
    }
  }, [user]);
  // const handleFindStreaming = async (e, id) => {
  //   e.preventDefault();
  //   try {
  //     const response = await fetch(
  //       `http://localhost:3000/movielist/streaming/${id}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     if (!response.ok) {
  //       throw new Error(`Error: ${response.status}`);
  //     }
  //     const data = await response.json();
  //     setStreamers(data.results.US);
  //     return data.results.US;
  //   } catch (error) {
  //     console.error("Failed to find streaming:", error);
  //   }
  // };

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
          <Link to="/watchlist" style={linkStyle}>
            My Profile
          </Link>
          <Link style={linkStyle} to="/movielist">
            Movie Lists
          </Link>
          <Link style={linkStyle} to="/allmovies">
            All Movies
          </Link>
          <Link style={linkStyle} to="/login">
            <button onClick={logout}>Logout</button>
          </Link>
        </div>
      </nav>
      <h2>Explore your movies and movie lists 🕵️‍♀️</h2>
      <div className="list-tabs">
        <button onClick={handleWatchlistClick}>Watchlist</button>
        <button onClick={handleCreateListClick}>Create List</button>
        <button onClick={handleMovieListClick}>Movie Lists</button>
      </div>
      {isWatchlistOpen && watchlistDiv()}
      <div>
        {isCreateListOpen && (
          <div className="create-movie-list">
            <form
              style={{
                margin: "20px auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "15px",
                width: "80%",
                maxWidth: "600px",
                background: "linear-gradient(145deg, #2c3e50, #34495e)",
                padding: "30px",
                borderRadius: "15px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                color: "#fff",
              }}
              onSubmit={(e) =>
                handleCreateMovieList(
                  e,
                  movieListTitle,
                  movieListDescription,
                  user.user.id,
                  setMovieList,
                  setMovieListTitle,
                  setMovieListDescription
                )
              }
            >
              <h2
                style={{
                  fontSize: "2.2em",
                  marginBottom: "10px",
                  textAlign: "center",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                  fontFamily: "'Helvetica Neue', sans-serif",
                }}
              >
                🎬 Create a Movie List 🎥
              </h2>
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  width: "100%",
                }}
              >
                <span style={{ fontSize: "1.1em", fontWeight: "500" }}>
                  Title:
                </span>
                <input
                  type="text"
                  value={movieListTitle}
                  onChange={(e) => setMovieListTitle(e.target.value)}
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: "2px solid #3498db",
                    backgroundColor: "rgba(255,255,255,0.9)",
                    fontSize: "1em",
                    transition: "all 0.3s ease",
                  }}
                />
              </label>
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  width: "100%",
                }}
              >
                <span style={{ fontSize: "1.1em", fontWeight: "500" }}>
                  Description:
                </span>
                <textarea
                  value={movieListDescription}
                  onChange={(e) => setMovieListDescription(e.target.value)}
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: "2px solid #3498db",
                    backgroundColor: "rgba(255,255,255,0.9)",
                    fontSize: "1em",
                    minHeight: "100px",
                    resize: "vertical",
                    transition: "all 0.3s ease",
                  }}
                />
              </label>
              <button
                type="submit"
                style={{
                  backgroundColor: "#e74c3c",
                  color: "white",
                  padding: "12px 25px",
                  border: "none",
                  borderRadius: "25px",
                  fontSize: "1.1em",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(231, 76, 60, 0.3)",
                  marginTop: "10px",
                }}
              >
                Create Movie List 🎬
              </button>
            </form>
          </div>
        )}

        {isMovieListOpen && (
          <div className="movie-list-container">
            <ul
              style={{
                listStyle: "none",
                padding: "0",
                margin: "0",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                // backgroundColor: "#fbfcfd",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              {movieList.map((list, index) => (
                <li
                  key={`${list.id} + ${index} `}
                  style={{
                    marginBottom: "10px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    listStyle: "none",
                    // backgroundColor: "#f880ba",
                  }}
                >
                  <h3
                    style={{
                      color: "#2c3e50",
                      marginBottom: "8px",
                      fontSize: "2em",
                    }}
                  >
                    {list.title}
                  </h3>
                  <p
                    style={{
                      color: "#666",
                      fontSize: "1.2em",
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
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                          margin: "8px",
                          position: "relative",
                        }}
                      >
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
                        <img
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          style={{
                            width: "auto",
                            height: "192px",
                            borderRadius: "4px",
                          }}
                        />
                        <div
                          style={{
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                            marginBottom: "8px",
                            flex: "1",
                            minWidth: "15%",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "1.5rem",
                              fontWeight: "bold",
                              marginBottom: "8px",
                            }}
                          >
                            Title
                          </div>
                          <div style={{ fontSize: "2rem" }}>{movie.title}</div>
                        </div>
                        <div
                          style={{
                            flex: "1",
                            minWidth: "45%",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "1.5rem",
                              fontWeight: "bold",
                              marginBottom: "8px",
                            }}
                          >
                            Description
                          </div>
                          <div style={{ textAlign: "left" }}>
                            {movie.overview}
                          </div>
                          {/* <button
                            onClick={(e) => handleFindStreaming(e, movie.id)}
                          >
                            Where Can I Watch?
                          </button> */}
                        </div>{" "}
                      </div>
                    );
                  })}
                  <button
                    onClick={(e) =>
                      handleDeleteMovieList(e, list.id, user, setMovieList)
                    }
                    style={{
                      color: "red",
                      marginRight: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    Delete List
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
