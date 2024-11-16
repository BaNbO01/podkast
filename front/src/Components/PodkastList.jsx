import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './PodkastiList.module.css';

const PodkastiList = () => {
  const [podkasti, setPodkasti] = useState([]);
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPodkasti = async () => {
      // Slanje parametara filtera i paginacije na backend
      const response = await axios.get('http://localhost:8000/api/podkasti', {
        params: {
          page: currentPage,
          per_page: itemsPerPage,
          naziv: filter,  // Filter za pretragu
        },
      });
      setPodkasti(response.data.data);
    };
    fetchPodkasti();
  }, [currentPage, filter]); // Ažuriraj kad god se filter ili stranica promeni

  return (
    <div className={styles.podkastiContainer}>
      <input
        type="text"
        placeholder="Pretraži podkaste..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}  // Promena filtera
        className="search-input"
      />
      <div className={styles.podkastiList}>
        {podkasti.map(podkast => (
          <Link to={`/podkasti/${podkast.id}`} key={podkast.id} className={styles.podkastCard}>
            <img src={podkast.baner} alt={podkast.naziv} className={styles.podkastBanner} />
            <h3>{podkast.naziv}</h3>
            <p>{podkast.opis}</p>
          </Link>
        ))}
      </div>
      <div className={styles.pagination}>
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          Prethodna
        </button>
        <span>Stranica {currentPage}</span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={podkasti.length < itemsPerPage} // disable next if less than itemsPerPage
        >
          Sledeća
        </button>
      </div>
    </div>
  );
};

export default PodkastiList;
