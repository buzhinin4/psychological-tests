import React from "react";
import { useNavigate } from "react-router-dom";
import "./TestErrorPage.css";

const TestErrorPage = () => {
  const navigate = useNavigate();

  const handleBackToTests = () => {
    navigate("/");
  };

  return (
    <div className="error-page">
      <div className="error-container">
        <div className="error-icon">
          <svg viewBox="0 0 24 24">
            <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
          </svg>
        </div>
        <h1 className="error-title">Error 404</h1>
        <p className="error-message">
          Указанный путь не существует или вы пытаетесь получить доступ к
          результатам теста без его прохождения.
        </p>
        <button className="back-button" onClick={handleBackToTests}>
          Вернуться к списку тестов
        </button>
      </div>
    </div>
  );
};

export default TestErrorPage;
