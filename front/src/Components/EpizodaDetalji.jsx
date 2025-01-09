import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams,useNavigate  } from 'react-router-dom';
import styles from './EpizodaDetail.module.css';
import Navbar from '../Components/Navbar';
import BackButton from './BackButton';
const EpizodaDetalji = () => {
  const { id } = useParams();
  const [epizoda, setEpizoda] = useState(null);
  const [userRole, setUserRole] = useState('kreator');
  const navigate = useNavigate();
  const [podcastCreatorId, setPodcastCreatorId] = useState(sessionStorage.getItem('user_id') || null); 
  const[audio,setAudio]=useState(null);
  const[tip,setTip]=useState(null);
  useEffect(() => {
    
    const role = sessionStorage.getItem('role') || 'gledalac'; 
    setUserRole(role);

    const fetchEpizoda = async () => {
      try {
        var response = await axios.get(`http://localhost:8000/api/epizode/${id}`,{
          headers: {
            'Authorization': "Bearer " + window.sessionStorage.getItem('auth_token'),
        },
        });
        const episodeData = response.data.data;
        response = await axios.get(episodeData.fajl.streaming_url, {
          headers: {
            Authorization: `Bearer ${window.sessionStorage.getItem("auth_token")}`,
          },
          responseType: "blob",
        });

        const audio = URL.createObjectURL(response.data);
        setAudio(audio);
        setTip(episodeData.fajl.tip);
        setEpizoda(episodeData);
        
      } catch (error) {
        console.error('Greška pri učitavanju podataka:', error);
      }
    };
    fetchEpizoda();
  }, [id]);

 

  const handleDeleteEpizoda = async (id) => {
    const confirmed = window.confirm('Da li ste sigurni da želite da obrisete epizodu?');
    if(confirmed){
      try {
    
        await axios.delete(`http://localhost:8000/api/epizode/${id}`, {
          headers: {
            'Authorization': "Bearer " + window.sessionStorage.getItem('auth_token'),
          },
        });
        alert('Epizoda je uspešno obrisana!');
        navigate(-1); // Vrati se na prethodnu stranicu
      } catch (error) {
        console.error('Greška pri brisanju epizode:', error);
        alert('Došlo je do greške pri brisanju epizode.');
      }
    }
    else{
      console.log('Brisanje epizode je otkazano.');
    }
    
  };


  if (!epizoda) return <div className={styles.loadingMessage}>Učitavanje...</div>;

  return (
    <div>
      <BackButton/>
      <Navbar userRole={userRole} />
      <div className={styles.epizodaContainer}>
        <h1 className={styles.epizodaTitle}>{epizoda.naziv}</h1>
 
        
          <div className={styles.audioContainer}>
            <audio controls className={styles.audioPlayer}>
              <source src={audio} type={tip} />
              Tvoj pretrazivac ne podrzava audio player.
            </audio>
          </div>
        
           
      
       

        {/* Dugme "Obriši Epizodu", koje je vidljivo samo adminu i kreatoru podkasta */}
        {(userRole === 'administrator' || podcastCreatorId == epizoda.kreator_epizode.id) && (
          <button onClick={() => handleDeleteEpizoda(id)} className={styles.deleteButton}>
            Obriši Epizodu
          </button>
        )}
      </div>
    </div>
  );
};



export default EpizodaDetalji;
