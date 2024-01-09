import { React, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, logout } from "../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import axios from "axios";
import "../styles/orgHolder.css";
// import Navbar from "./navbar";
// import EventBtn from "./event-btn";
// import events from "../assets/events.js"
// import { Link } from "react-router-dom";
import { backend_url } from "./CONST";

function OrgHolder() {
  // const backend_url = "http://127.0.0.1:8000";
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
  const [rlink, setRlink] = useState("");
  const [ilink, setIlink] = useState("");

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
      rlink: rlink,
      ilink: ilink,
      org_id: user?.uid,
    };
    // console.log("here");
    axios
      .post(`${backend_url}/event/create_event/${event.org_id}`, event, {
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
      <form onSubmit={handleSubmit} className="orgform">
        <div className="orgform-content">
          <h2 className="formtitle">Organization Form</h2>
          <div class="group">
            <input
              className="inputform"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <span class="highlight"></span>
            <span class="bar"></span>
            <label className="labelform">Title</label>
          </div>

          <div class="group">
            <input
              className="inputform"
              required
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <span class="highlight"></span>
            <span class="bar"></span>
            <label className="labelformstatic">Date</label>
          </div>

          <div class="group">
            <input
              className="inputform"
              required
              type="time"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
            <span class="highlight"></span>
            <span class="bar"></span>
            <label className="labelformstatic">Start Time</label>
          </div>

          <div class="group">
            <input
              className="inputform"
              required
              type="time"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
            <span class="highlight"></span>
            <span class="bar"></span>
            <label className="labelformstatic">End Time</label>
          </div>

          <div class="group">
            <input
              className="inputform"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <span class="highlight"></span>
            <span class="bar"></span>
            <label className="labelform">Location</label>
          </div>

          <div class="group">
            <input
              className="inputform"
              required
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
            <span class="highlight"></span>
            <span class="bar"></span>
            <label className="labelform">SAT / Comserv</label>
          </div>

          <div class="group">
            <textarea
              className="inputform"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <span class="highlight"></span>
            <span class="bar"></span>
            <label className="labelform">Description</label>
          </div>

          <div class="group">
            <input
              className="inputform"
              required
              value={rlink}
              onChange={(e) => setRlink(e.target.value)}
            />
            <span class="highlight"></span>
            <span class="bar"></span>
            <label className="labelform">Registration Link</label>
          </div>

          <div class="group">
            <input
              className="inputform"
              required
              value={ilink}
              onChange={(e) => setIlink(e.target.value)}
            />
            <span class="highlight"></span>
            <span class="bar"></span>
            <label className="labelform">Image Link</label>
          </div>

          <button
            type="submit"
            className="formbtn"
          >
            <p className="btntext">Submit</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>

          {/* <button type="submit">Submit</button> */}
        </div>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default OrgHolder;
