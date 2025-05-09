import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import process from "process";

const atlas_uri = process.env.ATLAS_URI;

mongoose
  .connect(atlas_uri)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.error("Error connecting to MongoDB Atlas:", error));

const WatcherSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  username: String,
  password: String,
  watchlist: {
    type: [
      {
        title: String,
        overview: String,
        release_date: String,
        poster_path: String,
        id: Number,
      },
    ],
    default: [],
  },
});

const MovieSchema = new mongoose.Schema({
  title: String,
  overview: String,
  release_date: String,
  poster_path: String,
  id: Number,
});

const MovieListSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  creatorId: Number,
  title: String,
  description: String,
  movies: {
    type: [
      {
        title: String,
        overview: String,
        release_date: String,
        poster_path: String,
        id: Number,
      },
    ],
    default: [],
  },
});

const Movie = mongoose.model("Movie", MovieSchema);
const Watcher = mongoose.model("Watcher", WatcherSchema);
const MovieList = mongoose.model("MovieList", MovieListSchema);

export { Movie, Watcher, MovieList };
