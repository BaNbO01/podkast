import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './YouTubeChannelVideos.module.css'; // Importovanje CSS modula
import Navbar from './Navbar';

const YouTubeChannelVideos = () => {
  const [selectedChannelId, setSelectedChannelId] = useState(null);
  const [videos, setVideos] = useState([]);
  const [userRole, setUserRole] = useState(sessionStorage.getItem('role') || null);
  const [channels, setChannels] = useState([
    { id: process.env.REACT_APP_YOUTUBE_TAMPON_ZONA, name: 'tampon_zona' }, // ID za kanal 6.75range
    { id: process.env.REACT_APP_YOUTUBE_ZDRAVA_PRICA, name: 'zdrava_prica' }, // ID za kanal JaoMilepodcast
    { id: process.env.REACT_APP_YOUTUBE_ODABRANA_PRICA, name: 'odabrana_prica' }, // ID za kanal XOsCHAT
  ]);
  const [loading, setLoading] = useState(false);
  const [nextPageToken, setNextPageToken] = useState('');
  const [prevPageToken, setPrevPageToken] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY; // Tvoj YouTube API ključ
  const VIDEOS_PER_PAGE = 5; // Broj video klipova po stranici

  const fetchVideos = async (channelId, pageToken = '') => {
    setLoading(true);
    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          channelId,
          maxResults: VIDEOS_PER_PAGE,
          order: 'date',
          type: 'video',
          pageToken: pageToken,
          key: API_KEY,
        },
      });
      setVideos(response.data.items);
      setNextPageToken(response.data.nextPageToken || '');
      setPrevPageToken(response.data.prevPageToken || '');
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
    setLoading(false);
  };

  const handleChannelClick = (channelId) => {
    setSelectedChannelId(channelId);
    setCurrentPage(1); // Resetovanje na prvu stranicu
    fetchVideos(channelId);
  };

  const handleNextPage = () => {
    if (nextPageToken) {
      fetchVideos(selectedChannelId, nextPageToken);
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (prevPageToken) {
      fetchVideos(selectedChannelId, prevPageToken);
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
  <Navbar userRole={userRole} />
    <div className={styles.youtubeChannelVideos}>
      <h1>YouTube Kanali</h1>

      {/* Kartice sa kanalima */}
      <div className={styles.channelList}>
        {channels.map((channel) => (
          <div
            key={channel.id}
            className={styles.channelCard}
            onClick={() => handleChannelClick(channel.id)}
          >
            <h3>{channel.name}</h3>
          </div>
        ))}
      </div>

      {/* Prikaz videa za odabrani kanal */}
      <div className={styles.videoList}>
        {loading ? (
          <p>Ucitavanje...</p>
        ) : (
          videos.map((video) => (
            <div key={video.id.videoId} className={styles.videoItem}>
              <h4>{video.snippet.title}</h4>
              <iframe
                title={video.snippet.title}
                src={`https://www.youtube.com/embed/${video.id.videoId}`}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ))
        )}
      </div>

      {/* Paginacija */}
      <div className={styles.pagination}>
        <button
          onClick={handlePrevPage}
          disabled={!prevPageToken}
          className={styles.paginationButton}
        >
          Previous
        </button>
        <span className={styles.pageNumber}>Page {currentPage}</span>
        <button
          onClick={handleNextPage}
          disabled={!nextPageToken}
          className={styles.paginationButton}
        >
          Next
        </button>
      </div>
    </div>
    </>
    
  );
};

export default YouTubeChannelVideos;
