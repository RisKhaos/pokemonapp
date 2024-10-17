import React, { useState } from "react"; // Import React and useState hook from React
import "./App.css"; // Import the CSS file for styling

// Define a TypeScript interface for the structure of Pokémon data
interface PokemonData {
  id: number; // Pokémon ID
  name: string; // Pokémon name
  weight: number; // Pokémon weight
  height: number; // Pokémon height
  sprites: {
    // Object for Pokémon sprites
    front_default: string; // URL for the default front sprite
  };
  types: {
    // Array of types associated with the Pokémon
    type: {
      name: string; // Type name (e.g., "fire", "water")
    };
  }[]; // Types are an array of objects
  stats: {
    // Array of base stats for the Pokémon
    base_stat: number; // Base value of the stat
  }[]; // Stats are also an array of objects
}

function App() {
  // State for storing Pokémon data, search input, and error messages
  const [pokemonData, setPokemonData] = useState<PokemonData | null>(null); // State to hold fetched Pokémon data
  const [searchInput, setSearchInput] = useState(""); // State for search input
  const [error, setError] = useState<string | null>(null); // State for error messages (string or null)

  // Function to fetch Pokémon data from the API
  const getPokemon = async () => {
    try {
      setError(null); // Clear any previous errors before fetching new data
      // Fetch Pokémon data from the API, converting the search input to lowercase
      const response = await fetch(
        `https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/${searchInput.toLowerCase()}`
      );

      // Check if the response is OK (status code 200)
      if (!response.ok) {
        throw new Error("Pokémon not found"); // Throw an error if the Pokémon is not found
      }

      // Parse the JSON response and update the state with the fetched Pokémon data
      const data: PokemonData = await response.json();
      setPokemonData(data); // Store the fetched data in state
    } catch (err: any) {
      resetDisplay(); // Call resetDisplay function to clear previous Pokémon data
      setError(err.message); // Set the error message to be displayed
    }
  };

  // Handle form submission to fetch Pokémon data
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (searchInput) {
      // Check if there is a search input
      getPokemon(); // Call the function to fetch Pokémon data
    }
  };

  // Reset the Pokémon data in state
  const resetDisplay = () => {
    setPokemonData(null); // Clear the Pokémon data
  };

  return (
    <div className="App">
      {" "}
      {/* Main container for the app */}
      <main>
        <h1>Pokémon Search App</h1> {/* Main title of the app */}
        <form role="search" id="search-form" onSubmit={handleSubmit}>
          <label htmlFor="search-input">Search for Pokémon Name or ID:</label>
          {/* Input field for user to enter Pokémon name or ID */}
          <input
            type="text"
            name="pokemon"
            id="search-input"
            value={searchInput} // Controlled input with value bound to state
            onChange={(e) => setSearchInput(e.target.value)} // Update search input on change
            required // Input is required
          />
          <button id="search-button">Search</button> {/* Search button */}
        </form>
        <div className="output">
          {" "}
          {/* Container for displaying Pokémon data */}
          {/* Conditionally render the top-container based on pokemonData */}
          <div className={`top-container ${!pokemonData ? "hidden" : ""}`}>
            {/* Pokémon Name and ID */}
            <div className="name-and-id">
              <span id="pokemon-name">{pokemonData?.name?.toUpperCase()}</span>{" "}
              {/* Display Pokémon name */}
              <span id="pokemon-id">#{pokemonData?.id}</span>{" "}
              {/* Display Pokémon ID */}
            </div>

            {/* Pokémon Image */}
            <div className="sprite-container">
              <img
                id="sprite"
                src={pokemonData?.sprites?.front_default || ""} // Display Pokémon sprite image
                alt={`${pokemonData?.name || ""} sprite`} // Alt text for accessibility
              />
            </div>

            {/* Pokémon Types */}
            <div id="types">
              {pokemonData?.types?.map(
                (
                  typeObj // Map through types to display each type
                ) => (
                  <span
                    key={typeObj.type.name} // Unique key for each type
                    className={`type ${typeObj.type.name}`} // Assign class based on type name
                  >
                    {typeObj.type.name} {/* Display type name */}
                  </span>
                )
              )}
            </div>

            {/* Pokémon Weight and Height */}
            <div className="size">
              <span id="weight">Weight: {pokemonData?.weight}</span>{" "}
              {/* Display Pokémon weight */}
              <span id="height">Height: {pokemonData?.height}</span>{" "}
              {/* Display Pokémon height */}
            </div>
          </div>
          <div className="bottom-container">
            {" "}
            {/* Container for Pokémon stats */}
            <table>
              {" "}
              {/* Table for displaying base stats */}
              <thead>
                <tr>
                  <th>Base</th> {/* Header for stat type */}
                  <th>Stats</th> {/* Header for stat value */}
                </tr>
              </thead>
              <tbody>
                {/* Display each stat in a table row */}
                <tr>
                  <td>HP:</td>
                  <td id="hp">{pokemonData?.stats[0].base_stat || ""}</td>{" "}
                  {/* Display HP */}
                </tr>
                <tr>
                  <td>Attack:</td>
                  <td id="attack">
                    {pokemonData?.stats[1].base_stat || ""}
                  </td>{" "}
                  {/* Display Attack */}
                </tr>
                <tr>
                  <td>Defense:</td>
                  <td id="defense">
                    {pokemonData?.stats[2].base_stat || ""}
                  </td>{" "}
                  {/* Display Defense */}
                </tr>
                <tr>
                  <td>Sp. Attack:</td>
                  <td id="special-attack">
                    {pokemonData?.stats[3].base_stat || ""}{" "}
                    {/* Display Special Attack */}
                  </td>
                </tr>
                <tr>
                  <td>Sp. Defense:</td>
                  <td id="special-defense">
                    {pokemonData?.stats[4].base_stat || ""}{" "}
                    {/* Display Special Defense */}
                  </td>
                </tr>
                <tr>
                  <td>Speed:</td>
                  <td id="speed" className="speed">
                    {pokemonData?.stats[5].base_stat || ""}{" "}
                    {/* Display Speed */}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {error && <p className="error-message">{error}</p>}{" "}
        {/* Display error message if exists */}
      </main>
    </div>
  );
}

export default App; // Export the App component for use in other parts of the application
