import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./TestsPage.css";
import data from "../../data/data-tests.json";
import { getCookie } from "../../utils/cookies";

const TestsPage = () => {
  const navigate = useNavigate();
  const { themeId } = useParams();
  const theme = data.themes[themeId];

  const handleTestClick = (testIndex) => {
    const result = getTestResult(testIndex);
    if (result) {
      navigate(`/themes/${themeId}/tests/${testIndex}/results`);
    } else {
      navigate(`/themes/${themeId}/tests/${testIndex}`);
    }
  };

  const getTestResult = (testIndex) => {
    const resultKey = `test_result_${themeId}_${testIndex}`;
    const result = getCookie(resultKey);
    return result ? JSON.parse(result) : null;
  };

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("ru-RU", options);
  };

  if (!theme) {
    return (
      <div className="tests-page">
        <div className="error-message">Тема не найдена</div>
      </div>
    );
  }

  return (
    <div className="tests-page">
      <header className="page-header">
        <h1 className="page-title">{theme.title}</h1>
        <p className="page-subtitle">Доступные тесты по выбранной теме</p>
        <div className="breadcrumbs">
          <span onClick={() => navigate("/")}>Главная</span>
          <span> / </span>
          <span>{theme.title}</span>
        </div>
      </header>

      <div className="tests-list">
        {theme.tests.map((test, index) => {
          const result = getTestResult(index);
          const percentage = result
            ? Math.round((result.score / result.maxScore) * 100)
            : null;

          return (
            <div
              key={index}
              className="test-card"
              onClick={() => handleTestClick(index)}
            >
              <div className="test-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#84b6f4"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M4 2h14l4 4v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                  <line x1="8" y1="16" x2="16" y2="16" />
                </svg>
              </div>
              <div className="test-content">
                <h2 className="test-title">{test.title}</h2>
                <div className="test-meta">
                  <span className="questions-count">
                    {test.questions.length}{" "}
                    {test.questions.length === 1 ? "вопрос" : "вопросов"}
                  </span>
                  {result && (
                    <div className="test-result-info">
                      <div className="result-percentage">
                        <div
                          className="percentage-bar"
                          style={{
                            backgroundColor:
                              percentage < 50
                                ? "#e74c3c"
                                : percentage < 75
                                ? "#f39c12"
                                : "#2ecc71",
                            width: `${percentage}%`,
                          }}
                        ></div>
                        <span>{percentage}%</span>
                      </div>
                      <span className="result-date">
                        {formatDate(result.date)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="test-arrow">
                <svg viewBox="0 0 24 24">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TestsPage;
