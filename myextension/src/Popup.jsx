import React, { useState, useEffect } from "react";
import Logo from "./assets/logo.png";
import style from "../src/style/Popup.module.css";

const Popup = () => {
  return (
    <div className="popup">
      <div className={style.popup}>
        <div className={style.popupContent}>
          <div className={style.logo}>
            <h1>MoodWeb</h1>
            <img src={Logo} alt="logo" />
          </div>
          <h2>Hello, how are you feeling right now?</h2>
          <input type="text" placeholder="Enter your answer..." />
          <button>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
