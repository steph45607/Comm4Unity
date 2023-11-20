import React from "react";
import "../styles/eventBtn.css";

function EventBtn({ title, reward, org, poster }) {
  return (
  <div className="event-btn-container">
    <div className="event-container" style={{backgroundImage:`url(${poster})`}}></div>
    <div className="event-text">
        <p>{title}</p>
        <div className="org-reward">
            <p>{org}</p>
            <p className="reward">{reward}</p>
        </div>
    </div>
  </div>
  );
}

export default EventBtn;
