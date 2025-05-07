import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./TestSolvingPage.css";
import data from "../../data/data-tests.json";

const TestSolvingPage = () => {
  const { themeId, testId } = useParams();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 минут в секундах
  const [isTestCompleted, setIsTestCompleted] = useState(false);

  const theme = data.themes[themeId];
  const test = theme?.tests[testId];
  const questions = test?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (!theme || !test) {
      navigate("/not-found");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTestCompletion();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [theme, test, navigate]);

  const handleOptionSelect = (questionId, optionIndex) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleTestCompletion = () => {
    setIsTestCompleted(true);
    calculateResults();
  };

  const calculateResults = () => {
    try {
      if (!questions || questions.length === 0) {
        throw new Error("Тест не содержит вопросов");
      }

      const result = {
        totalScore: 0,
        maxPossibleScore: 0,
        selectedOptions: {},
      };

      questions.forEach((question) => {
        result.maxPossibleScore += Math.max(
          ...question.options.map((o) => o.score)
        );
        if (selectedOptions[question.id] !== undefined) {
          result.totalScore +=
            question.options[selectedOptions[question.id]].score;
        }
        result.selectedOptions = { ...selectedOptions };
      });

      navigate(`/themes/${themeId}/tests/${testId}/results`, {
        state: result,
      });
    } catch (error) {
      console.error("Ошибка при расчете результатов:", error);
      navigate("/test-error", {
        state: { errorMessage: error.message },
      });
    }
  };

  if (!theme || !test) return null;
  if (isTestCompleted) return null;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="test-solving-page">
      <header className="test-header">
        <div className="test-info">
          <h1 className="test-title">{test.title}</h1>
          <div className="progress-indicator">
            Вопрос {currentQuestionIndex + 1} из {questions.length}
          </div>
        </div>
        <div className="timer">
          <svg className="timer-icon" viewBox="0 0 24 24">
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z" />
          </svg>
          <span>{formatTime(timeLeft)}</span>
        </div>
      </header>

      <div className="question-container">
        <h2 className="question-text">{currentQuestion.text}</h2>

        <div className="options-list">
          {currentQuestion.options.map((option, index) => (
            <div
              key={index}
              className={`option-card ${
                selectedOptions[currentQuestion.id] === index ? "selected" : ""
              }`}
              onClick={() => handleOptionSelect(currentQuestion.id, index)}
            >
              <div className="option-selector">
                {selectedOptions[currentQuestion.id] === index ? (
                  <div className="option-dot selected"></div>
                ) : (
                  <div className="option-dot"></div>
                )}
              </div>
              <div className="option-content">
                <span className="option-text">{option.text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="navigation-controls">
        <button
          className="nav-button prev-button"
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Назад
        </button>

        {currentQuestionIndex < questions.length - 1 ? (
          <button
            className="nav-button next-button"
            onClick={handleNextQuestion}
            disabled={selectedOptions[currentQuestion.id] === undefined}
          >
            Следующий вопрос
          </button>
        ) : (
          <button
            className="nav-button finish-button"
            onClick={handleTestCompletion}
            disabled={selectedOptions[currentQuestion.id] === undefined}
          >
            Завершить тест
          </button>
        )}
      </div>

      <div className="progress-bar-container">
        <div
          className="progress-bar"
          style={{
            width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default TestSolvingPage;
