import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import styles from './CategoryManagement.module.css';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]); // Kategorije koje se prikazuju
    const [newCategory, setNewCategory] = useState(''); // Nova kategorija koju unosimo
    const [errors, setErrors] = useState({}); // Greške pri unosu
    const [userRole, setUserRole] = useState('administrator');

    // Učitaj postojeće kategorije
    useEffect(() => {
        axios.get('http://localhost:8000/api/kategorije')
            .then(response => {
                setCategories(response.data.data); // Postavi kategorije iz odgovora
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    // Funkcija za dodavanje nove kategorije
    const handleAddCategory = async (e) => {
        e.preventDefault();
        
        if (!newCategory.trim()) {
            setErrors({ category: 'Naziv kategorije je obavezan' });
            return;
        }

        const categoryData = { naziv: newCategory };

        try {
            const response = await axios.post('http://localhost:8000/api/kategorije', categoryData); // API za dodavanje nove kategorije
            setCategories([...categories, response.data.data]); // Dodaj novu kategoriju u listu
            setNewCategory(''); // Očisti unos
            setErrors({}); // Očisti greške
        } catch (error) {
            console.error('Error adding category:', error);
            setErrors({ category: 'Došlo je do greške pri dodavanju kategorije' });
        }
    };

    return (
        <div>
            <Navbar userRole={userRole} />
            <div>
                <h2>Upravljanje Kategorijama</h2>

                {/* Prikazivanje grešaka ako postoje */}
                {errors.category && <div style={{ color: 'red' }}>{errors.category}</div>}

                <form onSubmit={handleAddCategory}>
                    <div>
                        <label htmlFor="new-category">Nova Kategorija</label>
                        <input
                            id="new-category"
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="Unesite naziv nove kategorije"
                            required
                        />
                        <button type="submit">Dodaj Kategoriju</button>
                    </div>
                </form>

                <div>
                    <h3>Postojeće Kategorije</h3>
                    <ul className={styles.listName}>
                        {categories.length > 0 ? (
                            categories.map(category => (
                                <li key={category.id}>{category.naziv}</li>
                            ))
                        ) : (
                            <p>Nemate kategorija još uvek.</p>
                        )}
                    </ul>
                </div>
            </div>
        </div>
        
    );
};

export default CategoryManagement;
