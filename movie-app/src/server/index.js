import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { Movie, Watcher, MovieList } from "../db/index.js";
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
  const user = await Watcher.findOne({ username, password });
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
    const existingUser = await Watcher.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: "Username already exists" });
    }
    const user = new Watcher({ username, password, id });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/watchlist", async (req, res) => {
  const allUsers = await Watcher.find({});
  const watchlist = allUsers.map((user) => user.watchlist);
  //comment here
  res.json(watchlist);
});

app.delete("/watchlist/:movie/:id", async (req, res) => {
  const { movie, id } = req.params;
  try {
    const user = await Watcher.findOne({ id: id });
    const movieIndex = user.watchlist.findIndex(
      (item) => item.id === Number(movie)
    );
    if (movieIndex !== -1) {
      user.watchlist.splice(movieIndex, 1);
      await user.save();
      res.json({ message: "Movie removed from watchlist" });
    } else {
      res.status(404).json({ error: "Movie not found" });
    }
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
  const { movie, user } = req.body;
  const newMovie = new Movie({
    title: movie.title,
    overview: movie.overview,
    release_date: movie.release_date,
    poster_path: movie.poster_path,
    id: movie.id,
  });

  try {
    const user1 = await Watcher.findOne({ id: user.user.id });
    if (user1.watchlist.some((item) => item.id === movie.id)) {
      res.status(409).json({ message: "Movie already exists in watchlist" });
    } else {
      user1.watchlist.push(newMovie);
      await user1.save();
      res.status(201).json({ message: "Movie added to watchlist" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/watchlist/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Watcher.findOne({ id: id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      res.json(user.watchlist);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/watchlist/user/:id", async (req, res) => {
  const { id } = req.params;
  const { movie } = req.body;
  try {
    const user = await Watcher.findOne({ id: id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      user.watchlist.push(movie);
      await user.save();
      res.status(201).json({ message: "Movie added to watchlist" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/movielist/all", async (req, res) => {
  try {
    const lists = await MovieList.find({});
    res.json(lists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/movielist/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const list = await MovieList.findOneAndDelete({ id: id });
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    } else {
      res.json({ message: "List deleted successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/movielist/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const lists = await MovieList.find({ creatorId: id });
    if (!lists) {
      return res.status(404).json({ message: "Lists not found" });
    } else {
      res.json(lists);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.post("/movielist/user", async (req, res) => {
  const { title, description, id } = req.body;
  try {
    const user = await Watcher.findOne({ id: id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      const newMovieList = new MovieList({
        title: title,
        description: description,
        creatorId: id,
        movies: [],
        id: generateRandomId(),
      });
      await newMovieList.save();
      MovieList.find({ creatorId: id }).then((movieLists) => {
        res.status(201).json(movieLists);
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.post("/movielist/add", async (req, res) => {
  const { movie, id } = req.body;
  try {
    const movieList = await MovieList.findOne({ id: id });
    if (!movieList) {
      return res.status(404).json({ message: "Movie list not found" });
    }
    movieList.movies.push(movie);
    await movieList.save();
    res.status(201).json({ message: "Movie added to movie list" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.delete("/movielist/movie/:movieId/:listId", async (req, res) => {
  const { movieId, listId } = req.params;
  try {
    const movieList = await MovieList.findOne({ id: listId });
    if (!movieList) {
      return res.status(404).json({ message: "Movie list not found" });
    }
    const movieIndex = movieList.movies.findIndex(
      (movie) => movie.id === movieId
    );
    movieList.movies.splice(movieIndex, 1);
    await movieList.save();
    res.status(200).json({ message: "Movie removed from movie list" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
