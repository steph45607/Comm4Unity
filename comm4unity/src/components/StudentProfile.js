import { React, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, logout } from "../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import axios from "axios";
import { event_url, student_url } from "./CONST";

function StudentProfile() {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const [events, setEvents] = useState([]);
  const [student, setStudent] = useState("")
  const [sat, setSat] = useState("")
  const [comserv, setComserv] = useState("")

  const fetchUserEvents = async () => {
    try {
      const userUid = user?.uid;
      console.log(user?.uid);

      if (!userUid) {
        return;
      }

      const allEvents = await axios.get(
        `${event_url}/event/get_all_events`
      );
      console.log(allEvents);
      setEvents(allEvents.data);
    } catch (error) {
      console.error("Error fetching events:", error.message);
    }
  };

  const fetchStudentData = async () => {
    try {
      const userUid = user?.uid;
      console.log(user?.uid);

      if (!userUid) {
        return;
      }

      const student_data = await axios.get(
        `${student_url}/student/${user?.uid}`
      );
      console.log(student_data);
      setStudent(student_data.data);
    //   setComserv(student.data)
    } catch (error) {
      console.error("Error fetching student details:", error.message);
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
    fetchStudentData();
  });

  return (
    <div>
      <h1>{name}</h1>
      {/* <h2>SAT: {student}</h2> */}
      <h3>SAT: {student.sat}</h3>
      <h3>ComServ: {student.comserv}</h3>
      <h3>Available Events:</h3>
      <div className="events-row"></div>
      <p>
        {events.map((event) => (
          <div>{event.title}</div>
        ))}
      </p>
    </div>
  );
}

export default StudentProfile;
