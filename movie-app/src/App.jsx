import { useState } from "react";
import { UserContext } from "./UserContext";

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

  return (
    <>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
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
