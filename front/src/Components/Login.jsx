import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Rukovanje unosom
  const handleInput = (e) => {
    const newUserData = { ...userData };
    newUserData[e.target.name] = e.target.value;
    setUserData(newUserData);
  };

  // Rukovanje prijavom
  const handleLogin = (e) => {
    e.preventDefault();
    console.log(userData.email + userData.password);
    axios
      .post('http://127.0.0.1:8000/api/login', userData)
      .then((response) => {
        if (response.data.success === true) {
          // Čuvanje tokena i uloge u sessionStorage
          window.sessionStorage.setItem('auth_token', response.data.access_token);
          window.sessionStorage.setItem('role', response.data.role);

          // Navigacija nakon uspešne prijave
          navigate('/podkasti', { state: { role: response.data.role } });
        } else {
          setErrorMessage('Pogrešno korisničko ime ili lozinka.');
        }
      })
      .catch((error) => {
        console.error('Greška pri prijavi:', error);
        setErrorMessage('Došlo je do greške. Molimo pokušajte ponovo.');
      });
  };

  // Navigacija ka registraciji
  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Dobrodošli nazad</h2>
        <p className="login-subtitle">Prijavite se na svoj nalog</p>
        {errorMessage && <p className="login-error">{errorMessage}</p>} {/* Prikazivanje greške */}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            name="email"
            placeholder="Korisničko ime"
            className="login-input"
            value={userData.email}
            onChange={handleInput}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Lozinka"
            className="login-input"
            value={userData.password}
            onChange={handleInput}
            required
          />
          <button type="submit" className="login-button">
            Prijavi se
          </button>
        </form>
        <p className="login-footer">
          Nemate nalog?{' '}
          <button className="register-link" onClick={handleRegisterRedirect}>
            Registrujte se
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
