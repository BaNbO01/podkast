import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './PodkastiList.module.css'; // Ponovo koristimo isti stil
import Navbar from '../Components/Navbar';

const Favorites = () => {
  const [podkasti, setPodkasti] = useState([]);
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [userRole, setUserRole] = useState('gledalac');
  const itemsPerPage = 9;
  const [noFavoritesMessage, setNoFavoritesMessage] = useState('');

  useEffect(() => {
    const role = sessionStorage.getItem('role') || 'gledalac';
    const authToken = sessionStorage.getItem('auth_token');
    setUserRole(role);

    // Funkcija za učitavanje omiljenih podkasta
    const fetchFavoritePodkasti = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/users/favorites', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          params: {
            page: currentPage,
            per_page: itemsPerPage,
            naziv: filter,
          },
        });
        if (response.data.message) {
          setNoFavoritesMessage(response.data.message);
        } else {
          setPodkasti(response.data.data);
        }
      } catch (error) {
        console.error('Greška pri dohvatanju omiljenih podkasta:', error);
      }
    };

    fetchFavoritePodkasti();
  }, [currentPage, filter]);

  return (
    <div>
      <Navbar userRole={userRole} />

      <div className={styles.podkastiContainer}>
        <h2>Moji Omiljeni Podkasti</h2>
        <input
          type="text"
          placeholder="Pretraži omiljene podkaste..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="search-input"
        />
        
        {/* Prikazivanje poruke ako nema omiljenih podkasta */}
        {noFavoritesMessage ? (
          <p>{noFavoritesMessage}</p>
        ) : (
          <div className={styles.podkastiList}>
            {podkasti.map(podkast => (
              <Link
                to={`/podkasti/${podkast.id}`}
                key={podkast.id}
                className={styles.podkastCard}
                state={{
                  baner: podkast.baner,
                  naziv: podkast.naziv,
                  opis: podkast.opis,
                }}
              >
                <img src={podkast.baner} alt={podkast.naziv} className={styles.podkastBanner} />
                <h3>{podkast.naziv}</h3>
                <p>{podkast.opis}</p>
                <i className="category">{podkast.kategorija.naziv}</i>
              </Link>
            ))}
          </div>
        )}

        <div className={styles.pagination}>
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
            Prethodna
          </button>
          <span>Stranica {currentPage}</span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={podkasti.length < itemsPerPage}
          >
            Sledeća
          </button>
        </div>
      </div>
    </div>
  );
};

export default Favorites;
