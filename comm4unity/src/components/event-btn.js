import React from "react";
import "../styles/eventBtn.css";

function EventBtn({ title, reward, date, poster }) {
  return (
  <div class="card">
    <img class="poster" src={poster}></img>
    <div class="textBox" style={{ textDecoration: "none", color: "" }}>
        <p class="text head">{title}</p>
        <p class="text org">{date}</p>
        <br></br>
        <p class="text reward">{reward}</p>
    </div>
  </div>
  );
}

export default EventBtn;
