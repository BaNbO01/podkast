import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './UserManagement.module.css';
import Navbar from './Navbar';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [userRole, setUserRole] = useState('administrator');
  
  // Učitavanje korisnika
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/korisnici'); // Prilagodite URL API-ja
        setUsers(response.data); // Pretpostavljamo da server vraća listu korisnika
      } catch (error) {
        console.error('Greška pri učitavanju korisnika:', error);
      }
    };
    fetchUsers();
  }, []);

  // Funkcija za brisanje korisnika
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:8000/api/korisnici/${userId}`); // API za brisanje korisnika
      setUsers(users.filter(user => user.id !== userId)); // Ažuriranje stanja
    } catch (error) {
      console.error('Greška pri brisanju korisnika:', error);
    }
  };

  // Funkcija za promenu uloge korisnika
  const handleRoleChange = async (userId) => {
    try {
      await axios.put(`http://localhost:8000/api/korisnici/${userId}/promeni-rolu`); // API za promenu uloge
      setUsers(users.map(user => 
        user.id === userId ? { ...user, uloga: 'kreator' } : user
      ));
    } catch (error) {
      console.error('Greška pri promeni uloge korisnika:', error);
    }
  };

  return (
    <div>
         <Navbar userRole={userRole} />
        <div className={styles.container}>
        <h1 className={styles.pageTitle}>Upravljanje Korisnicima</h1>
        <table className={styles.userTable}>
            <thead>
            <tr>
                <th>Korisničko ime</th>
                <th>Email</th>
                <th>Uloga</th>
                <th>Akcije</th>
            </tr>
            </thead>
            <tbody>
            {users.map(user => (
                <tr key={user.id}>
                <td>{user.korisnicko_ime}</td>
                <td>{user.email}</td>
                <td>{user.uloga}</td>
                <td>
                    {/* Dugme za brisanje korisnika */}
                    <button 
                    onClick={() => handleDeleteUser(user.id)} 
                    className={styles.deleteButton}>
                    Obriši
                    </button>
                    {/* Dugme za promenu uloge korisnika */}
                    {user.uloga === 'gledalac' && (
                    <button 
                        onClick={() => handleRoleChange(user.id)} 
                        className={styles.changeRoleButton}>
                        Promeni ulogu
                    </button>
                    )}
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    </div>
  );
};

export default UserManagement;
