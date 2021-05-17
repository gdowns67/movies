import React, { createContext, useEffect, useReducer } from "react";
import { useComponentDidMount, useLocalStorage } from "./hooks";

const MoviesReducer = (state: any, action: any) => {
  let movies;
  let index;
  let movie;

  switch (action.type) {
    case "add_movies":
      return { ...state, movies: action.movies };

    case "add_tag":
      movies = [...state.movies];
      index = movies.findIndex((m: any) => m.id === action.id);
      if (index > -1) {
        movie = { ...movies[index] };
        if (!movie.tags) {
          movie.tags = [];
        }
        if (movie.tags.length === 5) {
          return state;
        }
        movie.tags.push({
          id: uuid(),
          value: action.value,
        });
        movies.splice(index, 1, movie);
        return { ...state, movies, tagAdded: true };
      }
      return state;

    case "remove_tag":
      movies = [...state.movies];
      index = movies.findIndex((m: any) => m.id === action.movieId);
      if (index > -1) {
        movie = { ...movies[index] };
        const tagIndex = movie.tags.findIndex((t: any) => t.id === action.id);
        movie.tags.splice(tagIndex, 1);
        movies.splice(index, 1, movie);
        return { ...state, movies, tagRemoved: true };
      }
      return state;

    case "search":
      if (action.search) {
        movies = action.localStorageMovies.filter((m: any) => {
          if (m.tags) {
            let items = m.tags.filter((t: any) => {
              return t.value.includes(action.search);
            });
            return items.length > 0;
          }
          return false;
        });
        return { ...state, movies };
      }
      return { ...state, movies: action.localStorageMovies };

    case "reset":
      return { ...state, tagAdded: undefined, tagRemoved: undefined };

    default:
      return state;
  }
};

export const MoviesContext = createContext({} as any);
export const MoviesProvider = ({ children }: { children: React.ReactNode }) => {
  const [{ movies, tagAdded, tagRemoved }, dispatch] = useReducer(
    MoviesReducer,
    { movies: [], tagAdded: undefined, tagRemoved: undefined }
  );
  const [localStorageMovies, setLocalStorageMovies] = useLocalStorage(
    "movies",
    ""
  );

  useEffect(() => {
    if (movies && (tagAdded || tagRemoved)) {
      dispatch({
        type: "reset",
      });
      setLocalStorageMovies(movies);
    }
  }, [movies, setLocalStorageMovies, tagAdded, tagRemoved]);

  useComponentDidMount(() => {
    if (!localStorageMovies) {
      fetch("https://my.api.mockaroo.com/movies.json?key=bf3c1c60")
        .then((response) => response.json())
        .then((movies) => {
          dispatch({
            type: "add_movies",
            movies,
          });
          setLocalStorageMovies(movies);
        });
    } else {
      dispatch({
        type: "add_movies",
        movies: localStorageMovies,
      });
    }
  });

  const addTag = (id: number, value: string) => {
    dispatch({
      type: "add_tag",
      id,
      value,
    });
  };

  const removeTag = (movieId: number, id: number) => {
    dispatch({
      type: "remove_tag",
      movieId,
      id,
    });
  };

  const search = (search: string) => {
    dispatch({
      type: "search",
      search,
      localStorageMovies,
    });
  };

  return (
    <MoviesContext.Provider value={{ movies, addTag, removeTag, search }}>
      {children}
    </MoviesContext.Provider>
  );
};

const uuid = () => {
  var seed = Date.now();
  if (window.performance && typeof window.performance.now === "function") {
    seed += performance.now();
  }
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = (seed + Math.random() * 16) % 16 | 0;
      seed = Math.floor(seed / 16);
      return (c === "x" ? r : r & (0x3 | 0x8)).toString(16);
    }
  );
  return uuid;
};
