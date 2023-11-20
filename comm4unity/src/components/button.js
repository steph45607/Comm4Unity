import React from "react";
import "../styles/button.css";

function Button({ text, logo }) {
  return (
    <div>
    <div className="btn" style={{ backgroundImage: `url(${logo})` }}>
      <div className="btn-text">
        <p>{text}</p>
      </div>
    </div>

    </div>
    
  );
}

export default Button;
