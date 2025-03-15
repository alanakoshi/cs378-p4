import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StarWars = ({ name }) => {
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [extraDetails, setExtraDetails] = useState({
    films: [],
    species: [],
    vehicles: [],
    starships: [],
  });

  useEffect(() => {
    async function fetchCharacters() {
      try {
        const response = await fetch("https://swapi.dev/api/people/");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setCharacters(data.results);
        setLoading(false);
      } catch (error) {
        setError("Error fetching characters");
        setLoading(false);
      }
    }

    fetchCharacters();
  }, []);

  useEffect(() => {
    if (characters.length > 0) {
      const character = characters.find((char) => char.name.toLowerCase() === name.toLowerCase());
      setSelectedCharacter(character || null);

      if (character) {
        fetchExtraDetails(character);
      }
    }
  }, [name, characters]);

  useEffect(() => {
    if (selectedCharacter) {
      setChartData({
        labels: ["Height (cm)", "Mass (kg)"],
        datasets: [
          {
            data: [selectedCharacter.height, selectedCharacter.mass],
            backgroundColor: "rgba(255, 215, 0, 0.6)",
            borderColor: "rgba(255, 215, 0, 1)",
            borderWidth: 1,
          },
        ],
      });
    }
  }, [selectedCharacter]);

  const fetchExtraDetails = async (character) => {
    try {
      const [films, species, vehicles, starships] = await Promise.all([
        Promise.all(character.films.map((url) => fetch(url).then((res) => res.json()))),
        Promise.all(character.species.map((url) => fetch(url).then((res) => res.json()))),
        Promise.all(character.vehicles.map((url) => fetch(url).then((res) => res.json()))),
        Promise.all(character.starships.map((url) => fetch(url).then((res) => res.json()))),
      ]);

      setExtraDetails({
        films: films.map((film) => film.title),
        species: species.length > 0 ? species.map((spec) => spec.name) : ["Human"],
        vehicles: vehicles.map((vehicle) => vehicle.name),
        starships: starships.map((starship) => starship.name),
      });
    } catch (error) {
      console.error("Error fetching extra details:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!selectedCharacter) return <p>Character not found.</p>;

  return (
    <div className="character-list">
      <div className="character-info">
        <h2>{selectedCharacter.name}</h2>
        <p><strong>Height:</strong> {selectedCharacter.height} cm</p>
        <p><strong>Mass:</strong> {selectedCharacter.mass} kg</p>
        <p><strong>Hair Color:</strong> {selectedCharacter.hair_color}</p>
        <p><strong>Skin Color:</strong> {selectedCharacter.skin_color}</p>
        <p><strong>Eye Color:</strong> {selectedCharacter.eye_color}</p>
        <p><strong>Gender:</strong> {selectedCharacter.gender}</p>
        <p><strong>Birth Year:</strong> {selectedCharacter.birth_year}</p>
        <p><strong>Species:</strong> {extraDetails.species.join(", ")}</p>
        <p><strong>Films:</strong> {extraDetails.films.length > 0 ? extraDetails.films.join(", ") : "None"}</p>
        <p><strong>Vehicles:</strong> {extraDetails.vehicles.length > 0 ? extraDetails.vehicles.join(", ") : "None"}</p>
        <p><strong>Starships:</strong> {extraDetails.starships.length > 0 ? extraDetails.starships.join(", ") : "None"}</p>
        <p><strong>Created:</strong> {new Date(selectedCharacter.created).toLocaleString()}</p>
        <p><strong>Edited:</strong> {new Date(selectedCharacter.edited).toLocaleString()}</p>
      </div>

      <div className="chart-container">
        <h2>{selectedCharacter.name}'s Physical Stats</h2>
        {chartData.labels.length > 0 && chartData.datasets.length > 0 && (
          <Bar data={chartData} options={{ plugins: { legend: { display: false } } }} />
        )}
      </div>
    </div>
  );
};

export default StarWars;
