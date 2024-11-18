import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './PodkastiList.module.css';
import Navbar from '../Components/Navbar';

const PodkastiList = () => {
  const [podkasti, setPodkasti] = useState([]);
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [userRole, setUserRole] = useState('gledalac');
  const itemsPerPage = 9;

  useEffect(() => {
    const role = localStorage.getItem('user_role') || 'gledalac';
    setUserRole(role);

    const fetchPodkasti = async () => {
      const response = await axios.get('http://localhost:8000/api/podkasti', {
        params: {
          page: currentPage,
          per_page: itemsPerPage,
          naziv: filter,
        },
      });
      setPodkasti(response.data.data);
    };
    fetchPodkasti();
  }, [currentPage, filter]);

  return (
    <div>
      <Navbar userRole={userRole} />

      <div className={styles.podkastiContainer}>
        <input
          type="text"
          placeholder="Pretraži podkaste..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="search-input"
        />
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
              }} // Prosleđivanje podataka putem state-a
            >
              <img src={podkast.baner} alt={podkast.naziv} className={styles.podkastBanner} onLoad={() => console.log("Putanja do slike: ", podkast.baner)}/>
              <h3>{podkast.naziv}</h3>
              <p>{podkast.opis}</p>
              <i className="category">Kategorija</i>
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
            disabled={podkasti.length < itemsPerPage}
          >
            Sledeća
          </button>
        </div>
      </div>
    </div>
  );
};

export default PodkastiList;
