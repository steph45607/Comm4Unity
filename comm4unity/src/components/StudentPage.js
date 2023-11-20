import React from "react";
import Navbar from "./navbar";
import EventBtn from "./event-btn";
// import events from "../assets/events.json";
import "../styles/student.css";
import events from "../assets/events.js"
import { Link } from "react-router-dom";

function Student() {
  return (
    <div>
      <Navbar />
      <div className="event-row">
        {events.map((event) => {
          return (
            <Link to={"/event"}>
            <EventBtn
              title={event.title}
              org={event.org}
              reward={event.reward}
              poster= {event.poster}
            />
            </Link>
            
          );
        })}
      </div>
      {/* <EventBtn title={"Leadership event"} org={"AWS"} reward={"SAT"} /> */}
    </div>
  );
}

export default Student;
