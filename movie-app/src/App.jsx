import { useState, useEffect } from "react";

import "./App.css";
import Watchlist from "./components/Watchlist";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { UserProvider } from "./UserContext";
import Logout from "./components/Logout";

function App() {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    getWatchlist();
  }, []);

  const getWatchlist = async () => {
    try {
      const response = await fetch(`http://localhost:3000/watchlist`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setWatchlist(data);
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch movie recommendation:", error);
    }
  };

  return (
    <>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home getWatchlist={getWatchlist} />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/watchlist"
              element={
                <Watchlist watchlist={watchlist} setWatchlist={setWatchlist} />
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </>
  );
}

export default App;
