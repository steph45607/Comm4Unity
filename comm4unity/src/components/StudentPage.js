import {React} from "react";
import Navbar from "./navbar";
import EventBtn from "./event-btn";
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
            <Link to={`/event/${(event.id)}`} style={{ textDecoration: "none" }}>
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
    </div>
  );
}

export default Student;
