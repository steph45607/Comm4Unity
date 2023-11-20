import React from "react";
import Navbar from "./navbar";
import EventBtn from "./event-btn";
// import events from "../assets/events.json";
import "../styles/student.css";
import events from "../assets/events.js"

function Student() {
  return (
    <div>
      <Navbar />
      <div className="event-row">
        {events.map((event) => {
          return (
            <EventBtn
              title={event.title}
              org={event.org}
              reward={event.reward}
              poster= {event.poster}
            />
          );
        })}
      </div>
      {/* <EventBtn title={"Leadership event"} org={"AWS"} reward={"SAT"} /> */}
    </div>
  );
}

export default Student;
