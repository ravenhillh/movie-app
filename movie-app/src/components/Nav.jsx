import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../UserContext";

const Nav = () => {
  const { user, logout } = useContext(AuthContext);

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
  );
};

export default Nav;
