import axios from 'axios';

// URL de base pour votre backend
export const API_URL = 'http://localhost:8080/api/travelers';

// Fonction pour récupérer tous les voyageurs depuis le backend
export const getTravelers = async () => {
  try {
    const response = await axios.get(API_URL); // GET request à l'URL
    return response.data; // Retourner les données
  } catch (error) {
    console.error('Erreur lors de la récupération des voyageurs:', error);
    throw error; // Relancer l'erreur pour gestion
  }
};

// Fonction pour ajouter un nouveau voyageur
export const addTraveler = async (traveler) => {
  try {
    const response = await axios.post(API_URL, traveler); // POST request
    return response.data; // Retourner la réponse du serveur
  } catch (error) {
    
    console.error('Erreur lors de l\'ajout du voyageur:', error);
    throw error; // Relancer l'erreur pour gestion
  }
};

// Fonction pour mettre à jour un voyageur
export const updateTraveler = async (id, traveler) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, traveler); // PUT request
    return response.data; // Retourner la réponse du serveur
  } catch (error) {
    console.error('Erreur lors de la mise à jour du voyageur:', error);
    throw error; // Relancer l'erreur pour gestion
  }
};

// Fonction pour supprimer un voyageur
export const deleteTraveler = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du voyageur');
      }
  
      return true; // Suppression réussie
    } catch (error) {
      console.error('Erreur lors de la suppression d\'un voyageur:', error);
      return false; // Erreur de suppression
    }
  };
  

  