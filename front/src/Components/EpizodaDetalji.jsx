import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styles from './EpizodaDetail.module.css';
import Navbar from '../Components/Navbar';

const EpizodaDetalji = () => {
  const { id } = useParams();
  const [epizoda, setEpizoda] = useState(null);
  const [userRole, setUserRole] = useState('gledalac');

  useEffect(() => {
    const fetchEpizoda = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/epizode/${id}`);
        setEpizoda(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error('Greška pri učitavanju podataka:', error);
      }
    };
    fetchEpizoda();
  }, [id]);

  if (!epizoda) return <div className={styles.loadingMessage}>Učitavanje...</div>;

  return (
    <div>
      <Navbar userRole={userRole} />
      <div className={styles.epizodaContainer}>
        <h1 className={styles.epizodaTitle}>{epizoda.naziv}</h1>

        {/* Prikazivanje audio player-a ako je fajl audio */}
        {epizoda.fajl && epizoda.fajl.tip.startsWith('audio') && (
          <div className={styles.audioContainer}>
            <audio controls className={styles.audioPlayer}>
              <source src={epizoda.fajl.streaming_url} type={epizoda.fajl.tip} />
              Tvoj pretrazivac ne podrzava audio player.
            </audio>
          </div>
        )}

        {/* Prikazivanje video player-a ako je fajl video */}
        {epizoda.fajl && epizoda.fajl.tip.startsWith('video') && (
          <div className={styles.videoContainer}>
            <video controls className={styles.videoPlayer}>
              <source src={epizoda.fajl.streaming_url} type={epizoda.fajl.tip} />
              Tvoj pretrazivac ne podrzava video player.
            </video>
          </div>
        )}

        {/* Link za preuzimanje fajla */}
        <a href={epizoda.fajl.download_url} download className={styles.downloadButton}>
          Preuzmi
        </a>
      </div>
    </div>
  );
};

export default EpizodaDetalji;
