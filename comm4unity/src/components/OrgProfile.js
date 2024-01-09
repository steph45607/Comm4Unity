import { React, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, logout } from "../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import axios from "axios";
import { organization_url } from "./CONST";

function OrgProfile() {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const [events, setEvents] = useState([]);

  const fetchUserEvents = async () => {
    try {
      const userUid = user?.uid;
      console.log(user?.uid);

      if (!userUid) {
        return;
      }

      const userEventsResponse = await axios.get(
        `${organization_url}/events/get_events/${userUid}`
      );
      console.log(userEventsResponse);
      setEvents(userEventsResponse.data);
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

      setName(userData.name);
      // setRole(userData.role);
    } catch (err) {
      console.error(err);
      alert("An error occurred while fetching user data");
    }
  };

  useEffect(() => {
    if (loading) return;
    fetchUserName();
    fetchUserEvents();
  });

  return (
    <div>
      <h1>{name}</h1>
      <h3>Your Events:</h3>
      <div className="events-row"></div>
      <p>{events.map(event =>(
        <div>{event.title}</div>
      ))}</p>
    </div>
  );
}

export default OrgProfile;
