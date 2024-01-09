import React from "react";
import events from "../assets/events.js";
import { useParams } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { auth } from "../firebase";
import { Link } from "react-router-dom";
import Button from "./button.js";
import { event_url } from "./CONST.js";
import axios from "axios";
import { useState, useEffect } from "react";
import "../styles/event.css";

const Event = () => {
  const [user, loading] = useAuthState(auth);
  const { id } = useParams();
  const [event, setEvent] = useState("");
  const fetchEventData = async () => {
    try {
      // const userUid = user?.uid;
      console.log(id);

      const event_data = await axios.get(`${event_url}/event/${id}`);
      console.log(event_data);
      setEvent(event_data.data);
      //   setComserv(student.data)
    } catch (error) {
      console.error("Error fetching student details:", error.message);
    }
  };

  useEffect(()=>{
    if (loading) return;
    fetchEventData();
  }, [loading]);

  return (
    <div>
      {/* {event.id} */}
      <div className="top">
        <Link to={"/"} style={{textDecoration:"none", color:"white"}}>
          <FontAwesomeIcon icon={faArrowLeft} size="2xl" />
        </Link>
        <h2 className="event-title">{event.title}</h2>
      </div>
      <div className="event-container">
        <div className="event-left">
          <img className="event-image" src={event.image_link} alt=""></img>
          <p className="eventp">
            {event.date} | {event.start_time} - {event.end_time}
          </p>
          <p className="eventp">Location: {event.location}</p>
          <div className="event-btn">
            <a href={event.regist_link} target="_blank">
                <p className="eventp">Apply</p>
            </a>
          </div>
        </div>
        <div className="event-right">
          <p className="eventp">{event.description}</p>
        </div>
      </div>
    </div>
  );
};

export default Event;
