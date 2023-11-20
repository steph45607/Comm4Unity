// import React from "react";
// import Navbar from "./navbar";
import events from "../assets/events.js"
import { useParams } from "react-router-dom";

function Event(){
    const { id } = useParams();

    const selectedEvent = events.find((event) => event.id === id);

    if (!selectedEvent) {
      return <div>Event not found</div>;
    }
    return(
        <div>
            <h2>{selectedEvent.title}</h2>
            <p>Organization: {selectedEvent.org}</p>
            <p>Reward: {selectedEvent.reward}</p>
        </div>
    )
}

export default Event