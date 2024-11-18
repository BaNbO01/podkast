import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useLocation } from 'react-router-dom';
import styles from './EpizodeList.module.css';
import Navbar from '../Components/Navbar';

const EpizodeList = () => {
  const { id } = useParams();
  const [epizode, setEpizode] = useState([]);
  const [userRole, setUserRole] = useState('gledalac');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [podcastCreatorId, setPodcastCreatorId] = useState(null);
  const { state } = useLocation();

  console.log(state?.baner, state?.naziv, state?.opis);

  useEffect(() => {
    const role = localStorage.getItem('user_role') || 'administrator'; // Postavljamo ulogu (administrator, kreator, gledalac)
    setUserRole(role);

    const userId = localStorage.getItem('user_id');
    setCurrentUserId(userId);

    const fetchEpizode = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/podkasti/${id}`);
        setEpizode(response.data.data.epizode.sort((a, b) => new Date(b.datum) - new Date(a.datum)));
        setPodcastCreatorId(response.data.data.creator_id); // Setujemo ID kreatora podkasta
      } catch (error) {
        console.error('Greška pri učitavanju podkasta:', error);
      }
    };

    fetchEpizode();
  }, [id]);

  // Prazna funkcija koja se poziva kada se klikne dugme "Obriši Podkast"
  const handleDeletePodcast = () => {
    console.log('Dugme "Obriši Podkast" je kliknuto!');
  };

  return (
    <div>
      <Navbar userRole={userRole} />

      {/* Baner sekcija */}
      <div className={styles.banner}>
        {state?.baner && <img src={state.baner} alt={state.naziv} className={styles.bannerImage} />}
        
        <div className={styles.bannerContent}>
          <h1 className={styles.podcastTitle}>{state?.naziv || 'Naslov Podkasta'}</h1>
          <p className={styles.podcastDescription}>
            {state?.opis || 'Ovo je kratki opis podkasta. Može sadržavati osnovne informacije o podkastu i njegovoj svrsi.'}
          </p>
        </div>
        
        <button className={styles.favoriteButton}>Dodaj Podkast u omiljene</button>
        {(userRole === 'administrator' || currentUserId === podcastCreatorId) && (
        <button onClick={handleDeletePodcast} className={styles.deleteButton}>Obriši Podkast</button>
        )}
      </div>

      
      

      {/* Lista epizoda */}
      <div className={styles.epizodeContainer}>
        <h2 className={styles.sectionTitle}>Sve Epizode</h2>
        <div className={styles.epizodeList}>
          {epizode.map((epizoda) => (
            <div key={epizoda.id} className={styles.epizodaCard}>
              <h3 className={styles.epizodaTitle}>{epizoda.naziv}</h3>
              <p className={styles.epizodaDate}>
                {new Date(epizoda.datum).toLocaleDateString()}
              </p>
              <Link to={`/epizode/${epizoda.id}`} className={styles.playButton}>
                Preslušaj
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EpizodeList;
