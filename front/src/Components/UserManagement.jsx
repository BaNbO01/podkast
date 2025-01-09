import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './UserManagement.module.css';
import Navbar from './Navbar';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [userRole, setUserRole] = useState('administrator');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Dodajemo ukupan broj stranica
  const itemsPerPage = 5;


  


  // Učitavanje korisnika sa paginacijom
  useEffect(() => {

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/users', {
          params: {
            page: currentPage,
            per_page: itemsPerPage, // Paginacija sa 10 korisnika po stranici
          },
          headers: {
            'Authorization': "Bearer " + window.sessionStorage.getItem('auth_token'),
          },
        });
  
        setUsers(response.data.data);
        setTotalPages(response.data.meta.last_page); // Postavljanje ukupnog broja stranica
      } catch (error) {
        console.error('Greška pri učitavanju korisnika:', error);
      }
    };
    fetchUsers();
  }, [currentPage]);

  
  const handleDeleteUser = async (userId) => {
   
    const confirmed = window.confirm('Da li ste sigurni da želite da obrišete ovog korisnika?');
  
  
    if (confirmed) {
      try {
        const response = await axios.delete(`http://localhost:8000/api/users/${userId}`, {
          headers: {
            'Authorization': 'Bearer ' + window.sessionStorage.getItem('auth_token'),
          },
        });
  
        console.log(response.data); 
        alert('Korisnik je uspešno obrisan!');
        setUsers((prevUsers) => {
          const updatedUsers = prevUsers.filter(user => user.id !== userId);
          
          if (updatedUsers.length === 0 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
          return updatedUsers;
        });
       
      } catch (error) {
        console.error('Greška prilikom brisanja korisnika:', error);
        alert('Došlo je do greške prilikom brisanja korisnika.');
      }
    } else {
     
      console.log('Brisanje korisnika je otkazano.');
    }
  };

  
  const handleRoleChange = async (userId) => {
    const confirmed = window.confirm('Da li ste sigurni da želite da promenite rolu korisnika u kreator?');
    if(confirmed){
      try {

        const response = await axios.put(`http://localhost:8000/api/users/${userId}`, {}, {
          headers: {
            'Authorization': 'Bearer ' + window.sessionStorage.getItem('auth_token'),
          },
        });
      
        console.log(response.data);
        alert('Uloga korisnika je uspešno promenjena!');
        
    
        setUsers(users.map(user =>
          user.id === userId ? { ...user, uloga: 'kreator' } : user
        ));
      } catch (error) {
        console.error('Greška pri promeni uloge korisnika:', error);
        alert('Došlo je do greške pri promeni uloge korisnika.');
      }
    }
    else {
     
      console.log('Brisanje korisnika je otkazano.');
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
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className={styles.deleteButton}>
                    Obriši
                  </button>
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

        {/* Paginacija */}
        <div className={styles.pagination}>
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prethodna
          </button>
          <span>Stranica {currentPage} od {totalPages}</span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Sledeća
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
