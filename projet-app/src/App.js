import React from 'react';
import './App.css';
import TravelerList from './TravelerList'; // Importer le composant TravelerList

function App() {
  return (
    <div className="App">
      <h1>Welcome to the Traveler App</h1>
      <TravelerList /> {/* Afficher la liste des voyageurs */}
    </div>
  );
}


export default App;
