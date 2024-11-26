import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import BackButton from './BackButton';
import Navbar from './Navbar';
const NovaEpizodaForm = () => {
    const [naziv, setNaziv] = useState('');
    const [file, setFile] = useState(null);
    const [poruka, setPoruka] = useState('');
    const { state } = useLocation();
    const [userRole, setUserRole] = useState(sessionStorage.getItem('role') || 'gledalac');


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(file);
        const formData = new FormData();
        formData.append('naziv', naziv);
        formData.append('file', file);
        formData.append('podkast_id', state?.podkastId);

        try {
            const response = await axios.post('http://localhost:8000/api/epizode', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': "Bearer " + window.sessionStorage.getItem('auth_token'),
                },
            });
            setPoruka('Epizoda uspešno kreirana!');
            setNaziv('');
            setFile('');
        } catch (error) {
            setPoruka('Greška pri kreiranju epizode.');
            console.error(error);
            
        }
    };

    return (
        <div>
            <BackButton/>
            <Navbar userRole={userRole}/>
            <h2>Kreiraj Novu Epizodu</h2>
            {poruka && <p>{poruka}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Naziv Epizode:</label>
                    <input
                        type="text"
                        value={naziv}
                        onChange={(e) => setNaziv(e.target.value)}
                        required
                    />
                </div>
             
                <div>
                    <label>Fajl (audio):</label>
                    <input
                        type="file"
                        accept=".mp3"
                        onChange={(e) => setFile(e.target.files[0])}
                        required
                    />
                </div>
                <button type="submit">Sačuvaj Epizodu</button>
            </form>
        </div>
    );
};

export default NovaEpizodaForm;
