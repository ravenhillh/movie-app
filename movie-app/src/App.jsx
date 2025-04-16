import { useState } from "react";

import "./App.css";

function App() {
  const [movie, setMovie] = useState("");
  const [_recommendation, _setRecommendation] = useState(null);
  const [options, setOptions] = useState([]);

  console.log(movie);

  const getMovieRec = async () => {
    try {
      const response = await fetch(`http://localhost:3000/movie`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movie: movie }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setOptions(data.results);
      setMovie("");
    } catch (error) {
      console.error("Failed to fetch movie recommendation:", error);
      // Consider adding user feedback here
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    getMovieRec();
  };
  const handleClick = async (e, m) => {
    e.preventDefault;
    try {
      const response = await fetch(`http://localhost:3000/recommendation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: m }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setOptions([]);
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch movie recommendation:", error);
      // Consider adding user feedback here
    }
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={movie}
            onChange={(e) => setMovie(e.target.value)}
            placeholder="Enter a movie title"
          />
          <button type="submit">Get Movie</button>
        </form>
        <div>
          <h2>Click the movie you want recommendations for:</h2>
          {options.map((option) => (
            <div
              key={option.id}
              style={{
                width: "200px",
                padding: "10px",
                boxSizing: "border-box",
                display: "inline-block",
                verticalAlign: "top",
                margin: "10px",
              }}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${option.poster_path}`}
                alt={option.title}
                style={{ width: "100%", height: "auto" }}
                onClick={(e) => handleClick(e, option.id)}
                onMouseOver={(e) => {
                  e.currentTarget.style.cursor = "pointer";
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
