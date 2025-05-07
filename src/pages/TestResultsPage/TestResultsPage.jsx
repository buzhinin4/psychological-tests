import React from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./TestResultsPage.css";
import data from "../../data/data-tests.json";
import { setCookie, getCookie } from "../../utils/cookies";

const TestResultsPage = () => {
  const { themeId, testId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const theme = data.themes[themeId];
  const test = theme?.tests[testId];

  if (!theme || !test) {
    navigate("/not-found");
    return null;
  }

  let totalScore, maxPossibleScore;
  if (location.state) {
    totalScore = location.state.totalScore;
    maxPossibleScore = location.state.maxPossibleScore;

    const resultKey = `test_result_${themeId}_${testId}`;
    const resultData = {
      score: totalScore,
      maxScore: maxPossibleScore,
      date: new Date().toISOString(),
    };
    setCookie(resultKey, JSON.stringify(resultData));
  } else {
    const resultKey = `test_result_${themeId}_${testId}`;
    const cookieData = getCookie(resultKey);
    if (cookieData) {
      try {
        const parsed = JSON.parse(cookieData);
        totalScore = parsed.score;
        maxPossibleScore = parsed.maxScore;
      } catch (e) {
        navigate("/test-error");
        return null;
      }
    } else {
      navigate("/test-error");
      return null;
    }
  }

  const scoring = test.scoring || [];
  const percentage = Math.round((totalScore / maxPossibleScore) * 100);

  const getRecommendation = () => {
    const result = scoring.find(
      (range) => totalScore >= range.min && totalScore <= range.max
    );
    return result?.recommendation || "Рекомендация не найдена";
  };

  const getResultColor = () => {
    if (percentage < 50) return "#e74c3c";
    if (percentage < 75) return "#f39c12";
    return "#2ecc71";
  };

  const handleRetryTest = () => {
    navigate(`/themes/${themeId}/tests/${testId}`);
  };

  const handleBackToTests = () => {
    navigate(`/themes/${themeId}/tests`);
  };

  return (
    <div className="results-page">
      <div className="results-container">
        <h1 className="results-title">Результаты теста</h1>
        <h2 className="test-name">{test.title}</h2>

        <div className="score-display">
          <div
            className="circular-progress"
            style={{ "--progress-color": getResultColor() }}
          >
            <svg className="progress-ring" viewBox="0 0 100 100">
              <circle
                className="progress-ring-circle-bg"
                cx="50"
                cy="50"
                r="45"
              />
              <circle
                className="progress-ring-circle"
                cx="50"
                cy="50"
                r="45"
                style={{
                  strokeDasharray: `${(percentage / 100) * 283}, 283`,
                }}
              />
            </svg>
            <div className="progress-text">
              <span className="percentage">{percentage}%</span>
              <span className="score">
                {totalScore}/{maxPossibleScore}
              </span>
            </div>
          </div>
        </div>

        <div className="recommendation-box">
          <h3>Рекомендация:</h3>
          <p>{getRecommendation()}</p>
        </div>

        <div className="action-buttons">
          <button className="retry-button" onClick={handleRetryTest}>
            Пройти тест снова
          </button>
          <button className="back-button" onClick={handleBackToTests}>
            К списку тестов
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestResultsPage;
