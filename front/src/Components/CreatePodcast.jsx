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
        <div>
             <Navbar userRole={userRole} />
        
        <div className="create-podcast-form">
            <h2>Kreiraj Podkast</h2>

            {errors && Object.keys(errors).length > 0 && (
                <div className="error-dialog">
                    <h3>Validation Errors</h3>
                    <ul>
                        {Object.entries(errors).map(([field, messages]) =>
                            messages.map((message, index) => (
                                <li key={`${field}-${index}`}>{message}</li>
                            ))
                        )}
                    </ul>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="podcast-name">Naziv Podkasta</label>
                    <input
                        id="podcast-name"
                        type="text"
                        value={podcastName}
                        onChange={(e) => setPodcastName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Opis</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="category">Kategorija</label>
                    <select
                        id="category"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                    >
                        <option value="">Odaberi Kategoriju</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.naziv}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="banner">Postavi Baner</label>
                    <input
                        id="banner"
                        type="file"
                        onChange={handleBannerChange}
                        accept="image/*"
                        required
                    />
                </div>

                <button type="submit">Kreiraj Podkast</button>
            </form>
        </div>
        </div>
    );
};

export default CreatePodcast;
