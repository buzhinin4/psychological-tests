import React from "react";
import { useNavigate } from "react-router-dom";
import "./ThemesPage.css";
import data from "../../data/data-tests.json";

const ThemesPage = () => {
  const navigate = useNavigate();

  const handleThemeClick = (themeIndex) => {
    navigate(`/themes/${themeIndex}/tests`);
  };

  return (
    <div className="themes-page">
      <header className="page-header">
        <h1 className="page-title">Выберите тему теста</h1>
        <p className="page-subtitle">Доступные направления для тестирования</p>
      </header>

      <div className="themes-list">
        {data.themes.map((theme, index) => (
          <div
            key={index}
            className="theme-card"
            onClick={() => handleThemeClick(index)}
          >
            <div className="card-content">
              <h2 className="theme-title">{theme.title}</h2>
              <div className="theme-meta">
                <span className="tests-count">
                  {theme.tests.length}{" "}
                  {theme.tests.length === 1 ? "тест" : "тестов"}
                </span>
              </div>
            </div>
            <div className="card-hover-effect"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemesPage;
