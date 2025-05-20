const Details = ({ details, movie }) => {
  console.log(details, movie);
  return (
    <div>
      <h1>Details</h1>
      <p>Title: {movie.title}</p>
      <p>Overview: {movie.overview}</p>
      <p>Release Date: {movie.release_date}</p>
      <p>Runtime: {movie.runtime} minutes</p>
      <p>Genres: {movie.genres.map((genre) => genre.name).join(", ")}</p>
      <p>
        Streaming Services:
        {/* {streamers &&
          Object.keys(streamers).map((service) => (
            <div key={service}>
              <strong>{service}:</strong>
              <ul>
                {streamers[service].map((link) => (
                  <li key={link.link}>
                    <a
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))} */}
      </p>
    </div>
  );
};

export default Details;
