import React, { useState } from 'react';
import axios from 'axios';

const NovaEpizodaForm = ({ podkastId }) => {
    const [naziv, setNaziv] = useState('');
    const [datum, setDatum] = useState('');
    const [file, setFile] = useState(null);
    const [poruka, setPoruka] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(file);
        const formData = new FormData();
        formData.append('naziv', naziv);
        formData.append('datum_i_vreme_odrzavanja', datum);
        formData.append('file', file);
        formData.append('podkast_id', podkastId);

        try {
            const response = await axios.post('http://localhost:8000/api/epizode', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setPoruka('Epizoda uspešno kreirana!');
            setNaziv('');
            setDatum('');
            setFile(null);
        } catch (error) {
            setPoruka('Greška pri kreiranju epizode.');
            console.error(error);
            
        }
    };

    return (
        <div>
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
                    <label>Datum i Vreme Održavanja:</label>
                    <input
                        type="datetime-local"
                        value={datum}
                        onChange={(e) => setDatum(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Fajl (audio/video):</label>
                    <input
                        type="file"
                        accept=".mp4,.mp3"
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
