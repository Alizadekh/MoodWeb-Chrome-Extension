import React, { useState, useEffect } from "react";
import Logo from "./assets/logo.png";
import style from "./style/Popup.module.css";
import axios from "axios";

const API_URL = "https://moodweb-extension-backend.vercel.app/api/analyze-mood";

const Popup = () => {
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState({
    mood: "",
    quote: "",
    language: "",
    mediaRecommendation: "",
    activityRecommendation: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleSend = async () => {
    if (!userInput.trim()) {
      setError("Please enter some text!");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult({
      mood: "",
      quote: "",
      language: "",
      mediaRecommendation: "",
      activityRecommendation: "",
    });
    setStep(0);

    try {
      const response = await axios.post(
        API_URL,
        {
          userInput: userInput,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      console.log("API Response:", data);

      if (!data.mood || !data.quote || !data.language) {
        throw new Error("Invalid response format");
      }

      setResult({
        mood: data.mood,
        quote: data.quote,
        language: data.language,
        mediaRecommendation: data.mediaRecommendation,
        activityRecommendation: data.activityRecommendation,
      });
      setUserInput("");
      setShowResults(true);
    } catch (error) {
      console.error("API Error:", error);

      if (error.response) {
        setError(error.response.data.error || "Mood analysis failed");
      } else if (error.request) {
        setError(
          "Could not connect to the server. Please check your internet connection."
        );
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      handleSend();
    }
  };

  const handleReset = () => {
    setShowResults(false);
    setResult({
      mood: "",
      quote: "",
      language: "",
      mediaRecommendation: "",
      activityRecommendation: "",
    });
    setStep(0);
    setError("");
  };

  useEffect(() => {
    if (result.activityRecommendation) {
      const timer1 = setTimeout(() => setStep(1), 500);
      const timer2 = setTimeout(() => setStep(2), 800);
      const timer3 = setTimeout(() => setStep(3), 1100);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [result.activityRecommendation]);

  return (
    <div className={style.popupContainer}>
      <div className={style.popup}>
        <div className={style.popupContent}>
          <header className={style.logo}>
            <h1>MoodWeb</h1>
            <img src={Logo} alt="MoodWeb Logo" />
          </header>

          <main>
            {!showResults ? (
              <>
                <h2>Hello, how are you feeling right now?</h2>
                <div className={style.inputGroup}>
                  <input
                    type="text"
                    placeholder="Enter your response..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    className={error ? style.inputError : ""}
                  />
                  <button
                    onClick={handleSend}
                    disabled={isLoading}
                    className={`${style.sendButton} ${
                      isLoading ? style.loading : ""
                    }`}
                  >
                    {isLoading ? "Analyzing..." : "Send"}
                  </button>
                </div>
                {error && <p className={style.error}>{error}</p>}
              </>
            ) : (
              <div className={style.resultContainer}>
                <div className={style.result}>
                  {step >= 1 && (
                    <p className={style.recommendation}>
                      {result.activityRecommendation}
                    </p>
                  )}
                  {step >= 2 && (
                    <p className={style.mediaRecommendation}>
                      {result.mediaRecommendation}
                    </p>
                  )}
                  {step >= 3 && (
                    <blockquote className={style.quote}>
                      {result.quote}
                    </blockquote>
                  )}
                </div>
                {step >= 3 && (
                  <button
                    onClick={handleReset}
                    className={style.reloadButton}
                    title="Try again"
                  >
                    ↻
                  </button>
                )}
              </div>
            )}
            <p className={style.versionInfo}>v1.0.0</p>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Popup;
