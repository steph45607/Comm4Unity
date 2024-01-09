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

  const handleEventClick = (eventId) => {
    setSelectedEventId(eventId);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEvent({ ...event, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${url}/event/create_event/${event.o_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(`Error: ${data.detail}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
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

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        `${url}/registrations/${user?.uid}/${selectedEventId}`,
        reg
      );
      console.log(response.data);
      setMessage(
        `Successfully registered for the event: ${selectedEvent["1"]}`
      );
    } catch (error) {
      if (error.response && error.response.data) {
        // setMessage(`Error registering for the event: ${JSON.stringify(error.response.data)}`);
        setMessage("Account already registered");
      } else {
        setMessage(`Error registering for the event: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
    if (role === "organization") {
      fetchUserEvents();
    } else if (role === "student") {
      fetchAllEvents();
    }
  }, [user, loading, role]);

  useEffect(() => {
    if (selectedEventId) {
      fetchEventId();
      // fetchRegistrationCount();
    }
  }, [selectedEventId]);

  return (
    <div>
      <Navbar />
      <p className="details">Uid: {user?.uid}</p>
      <p className="details">Name: {name}</p>
      <p className="details">Email: {user?.email}</p>
      <p className="details">Role: {role}</p>
      <button onClick={logout}>Logout</button>

      {role === "organization" ? <OrgHolder /> : <StudentProfile />}

      {/* {role === "organization" && (
        <div>
          <h2>Create Event</h2>
          <button onClick={() => setShowEventDetails(!showEventDetails)}>
            {showEventDetails ? "Hide Event Details" : "Show Event Details"}
          </button>
          {showEventDetails && (
            <form onSubmit={handleSubmit}>
              {Object.keys(event).map(
                (key) =>
                  key !== "o_id" && (
                    <div key={key}>
                      <label>
                        {key.charAt(0).toUpperCase() + key.slice(1)}:
                        <input
                          type="text"
                          name={key}
                          value={event[key]}
                          onChange={handleInputChange}
                        />
                      </label>
                      <br />
                    </div>
                  )
              )}
              <button type="submit">Create Event</button>
            </form>
          )}
          {message && <p>{message}</p>}
        </div>
      )} */}

      {/* {role === "organization" && (
        <div>
          <h2>Your Events</h2>
          <ul>
            {userEvents.map((userEvent) => (
              <li key={userEvent.e_id}>{userEvent.title}</li>
            ))}
          </ul>
        </div>
      )} */}
      {/* {role === "student" && (
        <div>
          <h2>Student Events</h2>
          <ul>
            {userEvents.map((userEvent) => (
              <li key={userEvent.e_id} onClick={() => handleEventClick(userEvent.e_id)}>
                {userEvent.title}
              </li>
            ))}
          </ul>

          {selectedEventId && selectedEvent && (
            <div>
              <p>Selected Event ID: {selectedEventId}</p>
              {console.log(selectedEvent.title)}
              {console.log(selectedEvent)}
              <p>Registration Count: {registrationCount}</p>
              <p>Title: {selectedEvent["1"]}</p>
              <p>Date: {selectedEvent["2"]}</p>
              Add the registration button
              <button onClick={handleRegister}>Register for Event</button>
              <p>{message}</p>
            </div>
          )}
        </div>
      )
      } */}
    </div>
  );
};

export default CreateEventForm;
