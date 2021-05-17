import React from "react";
import { MoviesProvider } from "./context";
import Movies from "./movies";
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <MoviesProvider>
        <Movies />
      </MoviesProvider>
    </div>
  );
};

export default App;
