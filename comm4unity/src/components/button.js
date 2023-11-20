import React from "react";
import "../styles/button.css";

function Button({text}) {
  return (
    <div className="btn">
        <div className="btn-text">
            <p>{text}</p>
        </div>
    </div>
  );
}

export default Button;
