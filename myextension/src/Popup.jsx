import React, { useState } from "react";
import Logo from "./assets/logo.png";
import style from "./style/Popup.module.css";
import axios from "axios";

const API_URL = "https://moodweb-extension-backend.vercel.app/api/analyze-mood";

const Popup = () => {
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState({ mood: "", quote: "", language: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!userInput.trim()) {
      setError("Please enter some text!");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult({ mood: "", quote: "", language: "" });

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
      });
      setUserInput("");
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

  return (
    <div className={style.popupContainer}>
      <div className={style.popup}>
        <div className={style.popupContent}>
          <header className={style.logo}>
            <h1>MoodWeb</h1>
            <img src={Logo} alt="MoodWeb Logo" />
          </header>

          <main>
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

            {error && <p className={style.errorMessage}>{error}</p>}

            {result.mood && (
              <div className={style.result}>
                <h3>Your Mood:</h3>
                <p className={style.moodText}>{result.mood}</p>

                <h3>We Have a Suggestion for You:</h3>
                <blockquote className={style.quote}>
                  "{result.quote}"
                </blockquote>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Popup;
