import React from "react";
import "../styles/event.css";
import events from "../assets/events.js";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Button from "./button.js";

function Event() {
  const { id } = useParams();

  const selectedEvent = events.find((event) => event.id === id);

  if (!selectedEvent) {
    return <div>Event not found</div>;
  }
  return (
    <div>
      <div className="top">
        <Link to={"/student"} style={{textDecoration:"none", color:"white"}}>
          <FontAwesomeIcon icon={faArrowLeft} size="2xl" />
        </Link>
        <h2 className="event-title">{selectedEvent.title}</h2>
      </div>
      <div className="event-container">
        <div className="event-left">
          <img className="event-image" src={selectedEvent.poster} alt=""></img>
          <p>
            {selectedEvent.date} | {selectedEvent.time}
          </p>
          <p>Location: {selectedEvent.location}</p>
          <div className="event-btn">
            <a href={selectedEvent.link} target="_blank">
                <p>Apply</p>
            </a>
          </div>
        </div>
        <div className="event-right">
          <p>{selectedEvent.details}</p>
        </div>
      </div>
    </div>
  );
}

export default Event;
