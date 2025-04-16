import express from "express";
import cors from "cors";

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

app.post("/movie", (req, res) => {
  const { movie } = req.body;

  const url = `https://api.themoviedb.org/3/search/movie?query=${movie}&include_adult=false&language=en-US&page=1`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYWQ4NzY5NzAwMWU5ZjRiM2ExZmVmYzQ5MzFhMjc5ZCIsIm5iZiI6MTc0NDc0NDU3Mi4wNDYwMDAyLCJzdWIiOiI2N2ZlYjA3YzYxYjFjNGJiMzI5OTgxOGMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.XkDf0rA6Hgt08cpSyN8etTodpbY11F4bBlqUGnrgWWU",
    },
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
      res.json(json);
    })
    .catch((err) => console.error(err));
});
app.post("/recommendation", (req, res) => {
    const { id } = req.body;
        const url = `https://api.themoviedb.org/3/search/movie?query=${id}&include_adult=false&language=en-US&page=1`;
        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYWQ4NzY5NzAwMWU5ZjRiM2ExZmVmYzQ5MzFhMjc5ZCIsIm5iZiI6MTc0NDc0NDU3Mi4wNDYwMDAyLCJzdWIiOiI2N2ZlYjA3YzYxYjFjNGJiMzI5OTgxOGMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.XkDf0rA6Hgt08cpSyN8etTodpbY11F4bBlqUGnrgWWU",
          },
        };
      
        fetch(url, options)
          .then((res) => res.json())
          .then((json) => {
            console.log(json);
            res.json(json);
          })
          .catch((err) => console.error(err));
      });
  });
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
