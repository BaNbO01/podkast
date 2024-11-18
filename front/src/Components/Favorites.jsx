import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './PodkastiList.module.css'; // Možeš ponovo koristiti stilove
import Navbar from '../Components/Navbar';

const OmiljeniPodkasti = () => {
  const [podkasti, setPodkasti] = useState([]);
  const [userRole, setUserRole] = useState('gledalac');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/podkasti/favorites'); // Endpoint za omiljene
        setPodkasti(response.data.data);
      } catch (error) {
        console.error('Greška pri učitavanju omiljenih podkasta:', error);
      }
    };
    fetchFavorites();
  }, []);

 

  return (
    <div>
        <Navbar userRole={userRole} />
        <div className={styles.podkastiList}>
        {podkasti.map((podkast) => (
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
            <i className="category">Kategorija</i>
            </Link>
        ))}
        </div>
    </div>
  );
};

export default OmiljeniPodkasti;
