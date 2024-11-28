import React, { useState } from 'react';
import axios from 'axios';

function AddUserForm() {
  const [user, setUser] = useState({ firstName: '', lastName: '' });
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Appelez votre API backend pour ajouter un utilisateur
      const response = await axios.post('http://localhost:8080/api/users', user);
      setMessage(response.data); // Affichez le message de succès
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
      setMessage('Erreur lors de l\'ajout de l\'utilisateur.');
    }
  };

  return (
    <div>
      <h2>Ajouter un utilisateur</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom :</label>
          <input
            type="text"
            name="lastName"
            value={user.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Prénom :</label>
          <input
            type="text"
            name="firstName"
            value={user.firstName}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Ajouter</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AddUserForm;
