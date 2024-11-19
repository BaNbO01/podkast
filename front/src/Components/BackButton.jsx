import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./BackButton.module.css"; 

const BackButton = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Vraća korisnika na prethodnu stranicu
  };

  return (
    <button className={styles.backButton} onClick={handleGoBack}>
      Nazad
    </button>
  );
};

export default BackButton;