// import { useState } from "react";
// import { UserContext } from "./UserContext";

import "./App.css";
import Watchlist from "./components/Watchlist";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import AllMovies from "./components/AllMovies";
import MovieListPage from "./components/MovieListPage";
import { AuthProvider } from "./UserContext";
import Details from "./components/Details";

function App() {
  // const [watchlist, setWatchlist] = useState([]);

  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/allmovies" element={<AllMovies />} />
            <Route path="/movielist" element={<MovieListPage />} />
            <Route path="/details" element={<Details />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
