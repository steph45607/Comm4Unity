import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import Navbar from "./navbar";
import Student from "./StudentPage";
import OrgHolder from "./OrgHolder";
import axios from "axios";

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

  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [showEventDetails, setShowEventDetails] = useState(false);
  const navigate = useNavigate();
  const [userEvents, setUserEvents] = useState([]);

  const fetchUserEvents = async () => {
    try {
      const userUid = user?.uid;

      if (!userUid) {
        return;
      }

      const userEventsResponse = await axios.get(`http://localhost:8000/events/get_events/${userUid}`);
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
      const response = await fetch(`http://localhost:8000/event/create_event/${event.o_id}`, {
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

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
    fetchUserEvents();
  }, [user, loading]);

  return (
    <div>
      <Navbar />
      <p>Uid: {user?.uid}</p>
      <p>Name: {name}</p>
      <p>Email: {user?.email}</p>
      <p>Role: {role}</p>
      <button onClick={logout}>Logout</button>

      {role === "organization" ? <OrgHolder /> : <Student />}

      {/* Conditionally render Create Event form based on role */}
      {role === "organization" && (
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
      )}

      {/* Conditionally render Your Events based on role */}
      {role === "organization" && (
        <div>
          <h2>Your Events</h2>
          <ul>
            {userEvents.map((userEvent) => (
              <li key={userEvent.e_id}>{userEvent.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CreateEventForm;
