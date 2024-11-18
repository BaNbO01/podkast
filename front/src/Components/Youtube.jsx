import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import styles from './Youtube.module.css'; // CSS stilovi za ovu stranicu

const YouTube = () => {
  const [videos, setVideos] = useState([]);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const role = sessionStorage.getItem('role') || 'gledalac';
    setUserRole(role);

    const fetchVideos = async () => {
      try {
        const response = await fetch(
          'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=podcasts&maxResults=6&key=YOUR_API_KEY'
        );
        const data = await response.json();
        setVideos(data.items || []);
      } catch (error) {
        console.error('Greška pri dohvatanju YouTube videa:', error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div>
      <Navbar userRole={userRole} />
      <div className={styles.youtubeContainer}>
        <h2>Preporučeni YouTube Podkasti</h2>
        <div className={styles.videoGrid}>
          {videos.map((video) => (
            <div key={video.id.videoId} className={styles.videoCard}>
              <a
                href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={video.snippet.thumbnails.medium.url}
                  alt={video.snippet.title}
                  className={styles.thumbnail}
                />
              </a>
              <h3>{video.snippet.title}</h3>
              <p>{video.snippet.channelTitle}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default YouTube;
