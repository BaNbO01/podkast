import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import styles from './EpizodeList.module.css';


const EpizodeList = () => {
  const { id } = useParams();
  const [epizode, setEpizode] = useState([]);


  

  useEffect(() => {
    const fetchEpizode = async () => {
      const response = await axios.get(`http://localhost:8000/api/podkasti/${id}`);
      setEpizode(response.data.data.epizode.sort((a, b) => new Date(b.datum) - new Date(a.datum)));
    };
    fetchEpizode();
  }, [id]);

  return (
    
    <div className={styles.epizodeContainer}>
      <div className={styles.epizodeList}>
        {epizode.map(epizoda => (
          <Link to={`/epizode/${epizoda.id}`} key={epizoda.id} className={styles.epizodaCard}>
            <h3>{epizoda.naziv}</h3>
            <>{console.log(epizoda.datum)}</>
            <p className={styles.epizodaDate}>{new Date(epizoda.datum).toLocaleDateString()}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default EpizodeList;
