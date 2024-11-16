import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreatePodcast = () => {
    const [users, setUsers] = useState([]); // Lista korisnika za pretragu
    const [searchTerm, setSearchTerm] = useState(''); // Filter za username
    const [selectedUsers, setSelectedUsers] = useState([]); // Lista selektovanih korisnika kao kreatora
    const [podcastName, setPodcastName] = useState('');
    const [description, setDescription] = useState('');
    const[categoryId,setCategoryId]=useState('');
    const [categories, setCategories] = useState([]);
    const [banner, setBanner] = useState(null);// Slika banera
    const [errors, setErrors] = useState({}); 

    // Fetch korisnici kada se promeni searchTerm
    useEffect(() => {
        if (searchTerm) {
            axios.get(`http://localhost:8000/api/users/search?username=${searchTerm}`)
                .then(response => {
                    setUsers(response.data.data); // Postavljanje rezultata pretrage
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
                setCategories(response.data.data); // Postavi kategorije iz odgovora
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, []);
    

    // Funkcija za dodavanje kreatora
    const addCreator = (user) => {
        if (!selectedUsers.some(u => u.id === user.id)) {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    // Funkcija za uklanjanje kreatora
    const removeCreator = (userId) => {
        setSelectedUsers(selectedUsers.filter(user => user.id !== userId));
    };

    // Funkcija za upload banera
    const handleBannerChange = (e) => {
        setBanner(e.target.files[0]);
    };

    // Funkcija za slanje podkasta na server
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
            console.log('Podkast created:', response.data);
            alert("Podkast uspesno kreiran!");
            setErrors({});
            // Možemo preusmeriti ili obavestiti korisnika da je uspešno sačuvano
        } catch (error) {
            console.error('Error saving podcast:', error);
            setErrors(error.response.data.errors);
        }
    };

    return (
        <div className="create-podcast-form">
            <h2>Create Podcast</h2>

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
                <div>
                    <label htmlFor="podcast-name">Podcast Name</label>
                    <input
                        id="podcast-name"
                        type="text"
                        value={podcastName}
                        onChange={(e) => setPodcastName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.naziv} {/* Prikaz imena kategorije */}
                            </option>
                        ))}
                    </select>
            </div>


                <div>
                    <label htmlFor="banner">Upload Banner</label>
                    <input
                        id="banner"
                        type="file"
                        onChange={handleBannerChange}
                        accept="image/*"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="users">Search Users</label>
                    <input
                        id="users"
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by username"
                    />
                    <ul>
                        {users.map(user => (
                            <li key={user.id}>
                                {user.username}
                                <button type="button" onClick={() => addCreator(user)}>
                                    Add as Creator
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <label>Selected Creators</label>
                    <ul>
                        {selectedUsers.map(user => (
                            <li key={user.id}>
                                {user.username}
                                <button type="button" onClick={() => removeCreator(user.id)}>
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <button type="submit">Save Podcast</button>
            </form>


           
        </div>
    );
};

export default CreatePodcast;
