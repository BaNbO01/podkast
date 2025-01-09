import React, { useState, useEffect } from "react";
import axios from "axios"; // Axios za API pozive
import "./CreatePodcast.module.css";
import Navigation from "./Navbar";
import Navbar from "./Navbar";

const Courses = () => {
  const [categories, setCategories] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Učitavanje kategorija sa API-ja
    axios
      .get("http://localhost:8000/api/kategorije")
      .then((response) => {
        setCategories(response.data.data); // Postavljanje kategorija u stanje
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });

    // Mock podaci za nastavnike i kurseve
    const mockTeachers = ["Prof. John Doe", "Prof. Jane Smith"];
    const mockCourses = [
      {
        id: 1,
        title: "React Basics",
        description: "Learn the fundamentals of React.",
        image: "https://via.placeholder.com/300",
        created_at: "2024-01-01",
        updated_at: "2024-01-10",
      },
    ];

    setTeachers(mockTeachers);
    setCourses(mockCourses);
  }, []);

  return (
    <div className="home-page">
      <Navigation />
      <div className="main-content">
        {/* Sidebar */}
        <div className="sidebar">
          <h3>Filteri</h3>
          <h4>Kategorije</h4>
          <ul>
            {categories.map((category) => (
              <li key={category.id}>{category.naziv}</li> // Kategorije prikazane kao lista
            ))}
          </ul>
          <h4>Nastavnici</h4>
          <ul>
            {teachers.map((teacher, index) => (
              <li key={index}>{teacher}</li>
            ))}
          </ul>
          <button className="reset-button">Resetuj filtere</button>
        </div>

        {/* Courses */}
        <div className="courses-section">
          <h2>Svi kursevi</h2>
          <div className="courses-grid">
            {courses.map((course) => (
              <div key={course.id} className="course-card">
                <img
                  src={course.image}
                  alt={course.title}
                  className="course-image"
                />
                <div className="course-info">
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <p className="course-dates">
                    Kreirano: {course.created_at} | Ažurirano: {course.updated_at}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
