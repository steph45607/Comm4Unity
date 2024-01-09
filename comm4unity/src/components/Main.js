import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import Navbar from "./navbar";
import Student from "./StudentPage";
import OrgHolder from "./OrgHolder";
import axios from "axios";
import StudentProfile from "./StudentProfile";

const CreateEventForm = () => {
  const [event, setEvent] = useState({
    title: "",
    date: "",
    start_time: "",
    end_time: "",
    location: "",
    type: "",
    description: "",
    link: "",
    o_id: "",
  });

  const [reg, setReg] = useState({
    e_id: "",
    s_id: "",
  });

  const url = "http://127.0.0.1:8000";
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [showEventDetails, setShowEventDetails] = useState(false);
  const navigate = useNavigate();
  const [userEvents, setUserEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchAllEvents = async () => {
    try {
      const allEventsResponse = await axios.get(`${url}/event/get_all_events`);
      setUserEvents(allEventsResponse.data);
    } catch (error) {
      console.error("Error fetching all events:", error.message);
    }
  };

  const fetchEventId = async () => {
    try {
      if (!selectedEventId) {
        console.error("No selected event ID");
        return;
      }

      const oneEventResponse = await axios.get(
        `${url}/event/${selectedEventId}`
      );
      console.log(oneEventResponse);
      setSelectedEvent(oneEventResponse.data);
      setReg({
        ...reg,
        e_id: selectedEventId,
        s_id: user?.uid,
      });
    } catch (error) {
      console.error("Error fetching event details:", error.message);
    }
  };

  const fetchUserEvents = async () => {
    try {
      const userUid = user?.uid;

      if (!userUid) {
        return;
      }

      const userEventsResponse = await axios.get(
        `${url}/events/get_events/${userUid}`
      );
      setUserEvents(userEventsResponse.data);
    } catch (error) {
      console.error("Error fetching user events:", error.message);
    }
  };

  const fetchUserName = async () => {
    try {
      const userUid = user?.uid;

      if (!userUid) {
        return;
      }

      const q = query(collection(db, "users"), where("uid", "==", userUid));
      const doc = await getDocs(q);
      const userData = doc.docs[0].data();

      setEvent({
        ...event,
        o_id: userData.uid,
      });

      setName(userData.name);
      setRole(userData.role);
    } catch (err) {
      console.error(err);
      alert("An error occurred while fetching user data");
    }
  };



  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
    // if (role === "organization") {
    //   fetchUserEvents();
    // } else if (role === "student") {
    //   fetchAllEvents();
    // }
  }, [user, loading, role]);

  // useEffect(() => {
  //   if (selectedEventId) {
  //     fetchEventId();
  //     // fetchRegistrationCount();
  //   }
  // }, [selectedEventId]);

  return (
    <div>
      <Navbar />
      {/* <p className="details">Uid: {user?.uid}</p>
      <p className="details">Name: {name}</p>
      <p className="details">Email: {user?.email}</p>
      <p className="details">Role: {role}</p>
      <button onClick={logout}>Logout</button> */}

      {role === "organization" ? <OrgHolder /> : <StudentProfile />}

    
    </div>
  );
};

export default CreateEventForm;
