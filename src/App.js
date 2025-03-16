import React, { useState } from "react";
import StarWars from "./StarWars";
import "./App.css";

const App = () => {
  const defaultCharacters = ["Luke Skywalker", "Darth Vader", "Leia Organa"];

  const [searchQuery, setSearchQuery] = useState("Luke Skywalker");
  const [characterList, setCharacterList] = useState(defaultCharacters);

  // Function to capitalize the first letter of each word in the name
  const capitalizeName = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newCharacter = searchQuery.trim();
    if (newCharacter && !characterList.includes(newCharacter)) {
      setCharacterList([...characterList, capitalizeName(newCharacter)]); // Add to the list with proper capitalization
    }
  };

  const handleCharacterChange = (name) => {
    setSearchQuery(name); // Update the selected character
  };

  return (
    <div className="app">
      <h1>Star Wars Characters</h1>
      <div className="character-buttons">
        {characterList.map((character, index) => (
          <button key={index} onClick={() => handleCharacterChange(character)}>
            {capitalizeName(character)}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for a character..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <button type="submit">+</button>
        </div>
      </form>

      <StarWars name={searchQuery} />
    </div>
  );
};

export default App;
