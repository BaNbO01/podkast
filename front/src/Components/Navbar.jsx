// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Stilizacija menija

const Navbar = ({ userRole }) => {
  const [menuOpen, setMenuOpen] = useState(false); // Kontrola za burger meni

  // Funkcija koja zatvara meni kada je opcija izabrana
  const handleLinkClick = () => {
    setMenuOpen(false); // Zatvori meni kada se klikne na link
  };

  // Kreiranje menija zavisno od uloge
  const renderMenu = () => {
    if (userRole === 'administrator') {
      return (
        <>
          <li><Link to="/podkasti" onClick={handleLinkClick}>Podkasti</Link></li>
          <li><Link to="/korisnici" onClick={handleLinkClick}>Korisnici</Link></li>
          <li><Link to="/kategorije" onClick={handleLinkClick}>Kategorije</Link></li>
        </>
      );
    }
    if (userRole === 'kreator') {
      return (
        <>
          <li><Link to="/podkasti" onClick={handleLinkClick}>Podkasti</Link></li>
          <li><Link to="/kreiraj-podkast" onClick={handleLinkClick}>Kreiraj Podkast</Link></li>
          <li><Link to="/moji-podkasti" onClick={handleLinkClick}>Moji Podkasti</Link></li>
          <li><Link to="/youtube" onClick={handleLinkClick}>Youtube</Link></li>
        </>
      );
    }
    if (userRole === 'gledalac') {
      return (
        <>
          <li><Link to="/podkasti" onClick={handleLinkClick}>Podkasti</Link></li>
          <li><Link to="/omiljeni-podkasti" onClick={handleLinkClick}>Omiljeni Podkasti</Link></li>
          <li><Link to="/youtube" onClick={handleLinkClick}>Youtube</Link></li>
        </>
      );
    }
  };

  return (
    <header className="navbar">
      {/* Burger meni koji je uvek prisutan bez obzira na veličinu ekrana */}
      <div className="burger-menu" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      {/* Naslov "PODKAST" */}
      <div className="logo">
        <h1>PODKAST</h1>
      </div>

      {/* Logout dugme */}
      <div className="logout">
        <button>IZLOGUJ SE</button>
      </div>

      {/* Sidebar koji izlazi na klik burger menija */}
      <div className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <ul>
          {renderMenu()}
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
