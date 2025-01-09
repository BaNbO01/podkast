import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import styles from './EpizodeList.module.css';
import Navbar from '../Components/Navbar';
import BackButton from '../Components/BackButton';

const EpizodeList = () => {
  const { id } = useParams();
  const [epizode, setEpizode] = useState([]);
  const [userRole, setUserRole] = useState('gledalac');
  const [currentUserId, setCurrentUserId] = useState(sessionStorage.getItem('user_id') || null);
  const [podcastCreatorId, setPodcastCreatorId] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [buttonText, setButtonText] = useState('Dodaj Podkast u omiljene');  // Dodajemo stanje za tekst na dugmetu
  const { state } = useLocation();
  const navigate = useNavigate();

  console.log(state?.baner, state?.naziv, state?.opis);

  useEffect(() => {
    const role = sessionStorage.getItem('role') || 'gledalac'; // Postavljamo ulogu (administrator, kreator, gledalac)
    setUserRole(role);

    // Funkcija koja učitava epizode i proverava omiljenost
    const fetchData = async () => {
      try {
        // Učitaj epizode podkasta
        const response = await axios.get(`http://localhost:8000/api/podkasti/${id}`, {
          headers: {
            'Authorization': "Bearer " + window.sessionStorage.getItem('auth_token'),
          },
        });
        setEpizode(response.data.data.epizode.sort((a, b) => new Date(b.datum) - new Date(a.datum)));
        setPodcastCreatorId(response.data.data.kreator.id); // Setujemo ID kreatora podkasta

        // Proveri da li je podkast omiljen
        const favoritesResponse = await axios.get('http://localhost:8000/api/users/favorites', {
          headers: {
            'Authorization': "Bearer " + window.sessionStorage.getItem('auth_token'),
          },
        });
        const favoritePodcasts = favoritesResponse.data.data;
        const isPodkastFavorite = favoritePodcasts.some((favorite) => favorite.id === parseInt(id) && favorite.omiljeni === true);
       
        setIsFavorite(isPodkastFavorite);

        if (isPodkastFavorite) {
          setButtonText('Ukloni iz omiljenih');
        } else {
          setButtonText('Dodaj Podkast u omiljene');
        }
    
        
      } catch (error) {
        console.error('Greška pri učitavanju podkasta:', error);
      }
    };

    fetchData();

  }, [id]);  // Ponovo pokreće efekat samo kada se ID menja

  const handleFavoriteClick = async () => {
    try {
      if (isFavorite) {
        // Ako je podkast omiljen, ukloni ga iz omiljenih
        await axios.delete(`http://localhost:8000/api/users/favorites/remove/${id}`, {
          headers: {
            'Authorization': "Bearer " + window.sessionStorage.getItem('auth_token'),
          },
        });
        setIsFavorite(false);
        setButtonText('Dodaj Podkast u omiljene');  // Promeni naziv dugmeta
      } else {
        // Ako nije omiljen, dodaj ga u omiljene
        await axios.post(`http://localhost:8000/api/users/favorites/${id}`, {}, {
          headers: {
            'Authorization': "Bearer " + window.sessionStorage.getItem('auth_token'),
          },
        });
        setIsFavorite(true);
        setButtonText('Ukloni iz omiljenih');  // Promeni naziv dugmeta
      }
    } catch (error) {
      console.error('Greška pri dodavanju/uklanjanju iz omiljenih:', error);
    }
  };

  const handleCreateEpisode = () => {
    navigate('/kreirajEpizodu', { state: { podkastId: id } });
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Da li ste sigurni da želite da obrisete podkast?');
    if(confirmed){
      try {
    
        await axios.delete(`http://localhost:8000/api/podkasti/${id}`, {
          headers: {
            'Authorization': "Bearer " + window.sessionStorage.getItem('auth_token'),
          },
        });
  
       
        navigate(-1);  
      } catch (error) {
        console.error('Greška pri brisanju podkasta:', error);
      }
    }
    else{
      console.log('Brisanje podkasta je otkazano.');
    }
    
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
        <BackButton />
        
        {userRole === 'gledalac' && (
          <button onClick={handleFavoriteClick} className={styles.favoriteButton}>
            {buttonText}
          </button>
        )}
        {(userRole === 'administrator' || currentUserId == podcastCreatorId) && (
         <>
         <button onClick={handleDelete} className={styles.deleteButton}>
           Obriši Podkast
         </button>
         <button onClick={handleCreateEpisode} className={styles.createEpisodeButton}>
           Kreiraj Novu Epizodu
         </button>
       </>
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
