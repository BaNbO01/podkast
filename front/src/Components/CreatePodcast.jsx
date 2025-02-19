import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './CreatePodcast.module.css';
import Navbar from './Navbar';

const CreatePodcast = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [podcastName, setPodcastName] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const [banner, setBanner] = useState(null);
    const [errors, setErrors] = useState({});
    const [userRole, setUserRole] = useState('kreator');

    useEffect(() => {
        if (searchTerm) {
            axios.get(`http://localhost:8000/api/users/search?username=${searchTerm}`)
                .then(response => {
                    setUsers(response.data.data);
                })
                .catch(error => {
                    console.error('Error fetching users:', error);
                });
        } else {
            setUsers([]);
        }
    }, [searchTerm]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/kategorije')
            .then(response => {
                setCategories(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    const addCreator = (user) => {
        if (!selectedUsers.some(u => u.id === user.id)) {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    const removeCreator = (userId) => {
        setSelectedUsers(selectedUsers.filter(user => user.id !== userId));
    };

    const handleBannerChange = (e) => {
        setBanner(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('naziv', podcastName);
        formData.append('opis', description);
        formData.append('kategorija_id', categoryId);
        formData.append('baner', banner);
        const creatorIds = selectedUsers.map(user => user.id);
        formData.append('kreatori', JSON.stringify(creatorIds));

        try {
            const response = await axios.post('http://localhost:8000/api/podkasti', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Podcast created:', response.data);
            alert("Podcast successfully created!");
            setErrors({});
        } catch (error) {
            console.error('Error saving podcast:', error);
            setErrors(error.response.data.errors);
        }
    };

  return (
    <div className="home-page">
      <Navigation />
      <div className="main-content">
        {/* Sidebar */}
        <div className="sidebar">
          <h3>Filteri</h3>
          <h4>Kategorije</h4>
          <ul>
            {categories.map((category) => (
              <li key={category.id}>{category.naziv}</li> // Kategorije prikazane kao lista
            ))}
          </ul>
          <h4>Nastavnici</h4>
          <ul>
            {teachers.map((teacher, index) => (
              <li key={index}>{teacher}</li>
            ))}
          </ul>
          <button className="reset-button">Resetuj filtere</button>
        </div>

        {/* Courses */}
        <div className="courses-section">
          <h2>Svi kursevi</h2>
          <div className="courses-grid">
            {courses.map((course) => (
              <div key={course.id} className="course-card">
                <img
                  src={course.image}
                  alt={course.title}
                  className="course-image"
                />
                <div className="course-info">
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <p className="course-dates">
                    Kreirano: {course.created_at} | Ažurirano: {course.updated_at}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
