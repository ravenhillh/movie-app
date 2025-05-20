export const getWatchlist = async (id, setWatchlist) => {
  try {
    const response = await fetch(`http://localhost:3000/watchlist/user/${id}`, {
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
  } catch (error) {
    console.error("Failed to fetch movie recommendation:", error);
  }
};

export const getMovieLists = async (id, setMovieList) => {
  try {
    const response = await fetch(`http://localhost:3000/movielist/user/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    setMovieList(data, "inside of get movie list");
  } catch (error) {
    console.error("Failed to fetch movie recommendation:", error);
  }
};

export const handleRemove = async (
  event,
  movie,
  id,
  getWatchlist,
  setWatchlist
) => {
  event.preventDefault();
  try {
    const response = await fetch(
      `http://localhost:3000/watchlist/${movie.id}/${id}`,
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
    getWatchlist(id, setWatchlist);
  } catch (error) {
    console.error("Failed to remove movie from watchlist:", error);
  }
};
export const handleLongDescription = (string) => {
  if (string.length > 250) {
    return string.substring(0, 245) + "...";
  } else {
    return string;
  }
};
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString(undefined, options);
};

export const handleCreateMovieList = async (
  e,
  title,
  description,
  userId,
  setMovieList,
  setMovieListTitle,
  setMovieListDescription
) => {
  e.preventDefault();
  try {
    const response = await fetch(`http://localhost:3000/movielist/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        id: userId,
      }),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const toast = document.createElement("div");
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.backgroundColor = "#4CAF50";
    toast.style.color = "white";
    toast.style.padding = "16px";
    toast.style.borderRadius = "4px";
    toast.style.zIndex = "1000";
    toast.textContent = "new list created!";

    document.body.appendChild(toast);

    // Remove toast after 3 seconds
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);

    setMovieListTitle("");
    setMovieListDescription("");
    getMovieLists(userId, setMovieList);
  } catch (error) {
    console.error("Failed to create movie list:", error);
  }
};
export const handleAddToMovieList = async (
  e,
  movie,
  movieListOptionId,
  userId,
  setMovieList
) => {
  e.preventDefault();
  try {
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

    const toast = document.createElement("div");
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.backgroundColor = "#4CAF50";
    toast.style.color = "white";
    toast.style.padding = "16px";
    toast.style.borderRadius = "4px";
    toast.style.zIndex = "1000";
    toast.textContent = "added to your movie list!";

    document.body.appendChild(toast);

    // Remove toast after 3 seconds
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);

    getMovieLists(userId, setMovieList);
  } catch (error) {
    console.error("Failed to add to movie list:", error);
  }
};
export const handleDeleteMovieList = async (e, id, user, setMovieList) => {
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
    getMovieLists(user.user.id, setMovieList);
  } catch (error) {
    console.error("Failed to delete movie list:", error);
  }
};
