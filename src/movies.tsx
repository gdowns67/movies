import { format } from "date-fns";
import { useContext, useState } from "react";
import { MoviesContext } from "./context";

const Search = () => {
  const { search } = useContext(MoviesContext);

  return (
    <div
      style={{
        paddingTop: "10px",
        paddingRight: "10px",
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <input
        onChange={(event: any) => search(event.target.value)}
        type="text"
        placeholder="Search tags"
        className="Tag-Name-Search-Input"
      />
    </div>
  );
};

const Movies = () => {
  const { movies } = useContext(MoviesContext);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Search />
      <div className="Movies">
        {movies &&
          movies.map((m: any, index: number) => {
            return <Movie key={index} movie={m} />;
          })}
      </div>
    </div>
  );
};

const Movie = ({ movie }: { movie: any }) => {
  const { addTag } = useContext(MoviesContext);
  const [newTagValue, setNewTagValue] = useState();

  return (
    <div className="Movie">
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span>{movie.name}</span>
        <span style={{ marginTop: "4px" }}>
          {format(new Date(movie.created_at), "dd-MM-yyyy")}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        {movie.tags &&
          movie.tags.map((t: any, index: number) => (
            <Tag key={index} id={movie.id} tag={t} />
          ))}
        <input
          type="text"
          onChange={(event: any) => setNewTagValue(event.target.value)}
          placeholder="New tag name"
          className="Tag-Name-Input"
        />
        <button
          onClick={() => {
            newTagValue && addTag(movie.id, newTagValue);
          }}
          className="Add-Tag"
        >
          Add Tag
        </button>
      </div>
    </div>
  );
};

const Tag = ({ id, tag }: { id: number; tag: any }) => {
  const { removeTag } = useContext(MoviesContext);

  return (
    <button onClick={() => removeTag(id, tag.id)} className="Tag">
      <span style={{ marginRight: "4px" }}>{tag.value}</span>
      <i className="fa fa-close"></i>
    </button>
  );
};

export default Movies;
