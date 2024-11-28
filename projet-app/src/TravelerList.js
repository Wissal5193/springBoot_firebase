import React, { useEffect, useState } from 'react';
import { getTravelers, addTraveler, updateTraveler, deleteTraveler } from './TravelersService'; // N'oubliez pas d'importer la fonction de suppression
import './TravelerList.css';


const TravelerList = () => {
  const [travelers, setTravelers] = useState([]); // État pour la liste des voyageurs
  const [newTraveler, setNewTraveler] = useState({
    id_user: '',
    nom: '',
    prenom: '',
    voyage: '',
    prix: '',
  });
  const [editTraveler, setEditTraveler] = useState(null); // État pour la modification

  // Charger les données au montage du composant
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTravelers(); // Récupération des données
        setTravelers(data); // Mise à jour de l'état
      } catch (error) {
        console.error('Erreur lors du chargement des voyageurs:', error);
      }
    };
    fetchData();
  }, []);

  // Gestion des changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTraveler((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Ajouter un voyageur
  const handleAddTraveler = async (e) => {
    e.preventDefault();
    if (!newTraveler.nom || !newTraveler.prenom || !newTraveler.voyage || !newTraveler.prix) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    try {
      const addedTraveler = await addTraveler(newTraveler); // Ajouter via API
      setTravelers((prev) => [...prev, addedTraveler]); // Ajouter localement
      setNewTraveler({ id_user: '', nom: '', prenom: '', voyage: '', prix: '' }); // Réinitialiser le formulaire

      // Recharger la liste des voyageurs après ajout
      const updatedTravelers = await getTravelers(); // Récupérer la liste mise à jour
      setTravelers(updatedTravelers); // Mettre à jour l'état avec la liste complète
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      alert('Erreur lors de l\'ajout du voyageur');
    }
  };

  // Sauvegarder les modifications
  const saveChanges = async (id) => {
    try {
      await updateTraveler(id, editTraveler); // Mise à jour via API
      setTravelers((prev) =>
        prev.map((traveler) =>
          traveler.id_user === id ? { ...traveler, ...editTraveler } : traveler
        )
      ); // Mise à jour de l'état local avec les données mises à jour
      setEditTraveler(null); // Réinitialiser le mode d'édition
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  // Supprimer un voyageur
  const handleDeleteTraveler = async (id_user) => {
    try {
      const isDeleted = await deleteTraveler(id_user);
      if (isDeleted) {
        setTravelers((prev) => prev.filter((traveler) => traveler.id_user !== id_user));
      } else {
        alert('Erreur lors de la suppression du voyageur');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  return (
    <div>
      <h1>Liste des Voyageurs</h1>
      <form onSubmit={handleAddTraveler}>
        <input
          type="number"
          name="id_user"
          value={newTraveler.id_user}
          onChange={handleChange}
          placeholder="ID Utilisateur"
        />
        <input
          type="text"
          name="nom"
          value={newTraveler.nom}
          onChange={handleChange}
          placeholder="Nom"
        />
        <input
          type="text"
          name="prenom"
          value={newTraveler.prenom}
          onChange={handleChange}
          placeholder="Prénom"
        />
        <input
          type="text"
          name="voyage"
          value={newTraveler.voyage}
          onChange={handleChange}
          placeholder="Voyage"
        />
        <input
          type="number"
          name="prix"
          value={newTraveler.prix}
          onChange={handleChange}
          placeholder="Prix"
        />
        <button type="submit">Ajouter</button>
      </form>

      {travelers.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Voyage</th>
              <th>Prix</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {travelers.map((traveler) => {
              if (!traveler) return null; // Ignorer les voyageurs invalides
              return (
                <tr key={traveler.id_user}>
                  <td>{traveler.id_user}</td>
                  <td>
                    {editTraveler && editTraveler.id_user === traveler.id_user ? (
                      <input
                        value={editTraveler.nom}
                        onChange={(e) =>
                          setEditTraveler((prev) => ({ ...prev, nom: e.target.value }))
                        }
                      />
                    ) : (
                      traveler.nom
                    )}
                  </td>
                  <td>
                    {editTraveler && editTraveler.id_user === traveler.id_user ? (
                      <input
                        value={editTraveler.prenom}
                        onChange={(e) =>
                          setEditTraveler((prev) => ({ ...prev, prenom: e.target.value }))
                        }
                      />
                    ) : (
                      traveler.prenom
                    )}
                  </td>
                  <td>{traveler.voyage}</td>
                  <td>{traveler.prix}</td>
                  <td>
                    {editTraveler && editTraveler.id_user === traveler.id_user ? (
                      <button onClick={() => saveChanges(traveler.id_user)}>
                        Sauvegarder
                      </button>
                    ) : (
                      <button onClick={() => setEditTraveler(traveler)}>
                        Modifier
                      </button>
                    )}
                    <button onClick={() => handleDeleteTraveler(traveler.id_user)}>
                      Supprimer
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>Aucun voyageur trouvé.</p>
      )}
    </div>
  );
};

export default TravelerList;
