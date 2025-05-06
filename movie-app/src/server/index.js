import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { Movie, User } from "../db/index.js";
import process from "process";

const apiReadKey = process.env.API_READ_KEY;
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

const generateRandomId = () => {
  const min = 1000000000;
  const max = 9999999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (!user) {
    res.status(401).json({ error: "Invalid username or password" });
  } else {
    res.status(200).json({ user });
  }
});

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  let id = generateRandomId();
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: "Username already exists" });
    }
    const user = new User({ username, password, id });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/watchlist", async (req, res) => {
  const watchlist = await Movie.find({});
  res.json(watchlist);
});

app.delete("/watchlist/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const movie = await Movie.findOneAndDelete({ id: id });
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    res.json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/movie", (req, res) => {
  const { movie } = req.body;

  const url = `https://api.themoviedb.org/3/search/movie?query=${movie}&include_adult=false&language=en-US&page=1`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${apiReadKey}`,
    },
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      res.json(json);
    })
    .catch((err) => console.error(err));
});
app.post("/recommendation", (req, res) => {
  const { id } = req.body;
  const url = `https://api.themoviedb.org/3/movie/${id}/recommendations?language=en-US&page=1`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${apiReadKey}`,
    },
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((json) => res.json(json))
    .catch((err) => console.error(err));
});
app.post("/watchlist", async (req, res) => {
  const { movie } = req.body;
  const newMovie = new Movie({
    title: movie.title,
    overview: movie.overview,
    release_date: movie.release_date,
    poster_path: movie.poster_path,
    id: movie.id,
  });
  const existingMovie = await Movie.findOne({ id: movie.id });
  if (existingMovie) {
    return res
      .status(409)
      .json({ message: "Movie already exists in watchlist" });
  }
  const newMovie1 = await newMovie.save();
  if (!newMovie1) {
    return res.status(400).json({ message: "Failed to add movie" });
  } else {
    return res.status(201).json({ message: "Movie added to watchlist" });
  }
});
app.get("/watchlist/user/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ id: id });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  } else {
    res.json(user.watchlist);
  }
  console.log(user.watchlist);
});
app.post("/watchlist/user/:id", async (req, res) => {
  const { id } = req.params;
  const { movie } = req.body;
  const user = await User.findOne({ id: id });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  } else {
    user.watchlist.push(movie);
    await user.save();
    res.status(201).json({ message: "Movie added to watchlist" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
