import { React, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, logout } from "../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import axios from "axios";
// import Navbar from "./navbar";
// import EventBtn from "./event-btn";
// import "../styles/student.css";
// import events from "../assets/events.js"
// import { Link } from "react-router-dom";

function OrgHolder() {
  const backend_url = "http://127.0.0.1:8000";
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const event = {
      title: title,
      date: date,
      start_time: start,
      end_time: end,
      location: location,
      type: type,
      description: description,
      link: link,
      o_id: user?.uid,
    };
    console.log("here");
    axios
      .post(`${backend_url}/event/create_event/${event.o_id}`, event, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
        console.log(event);
      });

    // try {
    //   const response = await fetch(
    //     `${backend_url}/event/create_event/${event.o_id}`,
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify(data),
    //     }
    //   );

    //   const data = await response.json();

    //   if (response.ok) {
    //     setMessage(data.message);
    //   } else {
    //     setMessage(`Error: ${data.detail}`);
    //   }
    // } catch (error) {
    //   setMessage(`Error: ${error.message}`);
    // }
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
      setRole(userData.role);
    } catch (err) {
      console.error(err);
      alert("An error occurred while fetching user data");
    }
  };
  return (
    <div>
      <p>{user?.uid}</p>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        ></input>
        <input
          placeholder="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        ></input>
        <input
          placeholder="start time"
          type="time"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        ></input>
        <input
          placeholder="end time"
          type="time"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        ></input>
        <input
          placeholder="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        ></input>
        <input
          placeholder="SAT/Comserv"
          value={type}
          onChange={(e) => setType(e.target.value)}
        ></input>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <input
          placeholder="Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        ></input>
        <button type="submit">Submit</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default OrgHolder;
