import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import styles from './CategoryManagement.module.css';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]); // Kategorije koje se prikazuju
    const [newCategory, setNewCategory] = useState(''); // Nova kategorija koju unosimo
    const [errors, setErrors] = useState({}); // Greške pri unosu
    const [userRole, setUserRole] = useState('administrator');
    const [successMessage, setSuccessMessage] = useState('');


    // Učitaj postojeće kategorije
    useEffect(() => {
        const fetchCategories = async () => {
          try {
            const response = await axios.get('http://localhost:8000/api/kategorije', {
              headers: {
                'Authorization': 'Bearer ' + window.sessionStorage.getItem('auth_token'), // Slanje tokena
              },
            });
    
            setCategories(response.data.data); 
          } catch (error) {
            console.error('Error fetching categories:', error);
          }
        };
    
        fetchCategories();
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
            const response = await axios.post('http://localhost:8000/api/kategorije', categoryData, {
                headers: {
                    'Authorization': 'Bearer ' + window.sessionStorage.getItem('auth_token'), 
                }
            }); 
         
            setCategories(prevCategories => [...prevCategories, response.data.data]); // Dodaj novu kategoriju u listu
            setNewCategory(''); // Očisti unos
            setErrors({}); // Očisti greške
            setSuccessMessage('Kategorija uspešno dodata!'); // Postavi poruku o uspehu
           
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors({ category: 'Naziv kategorije mora biti jedinstven' });
            } else {
                setErrors({ category: 'Došlo je do greške pri dodavanju kategorije' });
            }
           
         
            setSuccessMessage(''); // Očisti prethodnu poruku o uspehu
        }
    };

    return (
        <div>
            <Navbar userRole={userRole} />
            <div>
                <h2>Upravljanje Kategorijama</h2>

                {/* Prikazivanje grešaka ako postoje */}
                {errors.category && <div style={{ color: 'red' }}>{errors.category}</div>}
            {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
          

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
