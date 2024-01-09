import { React, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, logout } from "../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import axios from "axios";
import { backend_url } from "./CONST";

function OrgProfile() {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const [events, setEvents] = useState("");

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
    // if(!user) return Navigate("/");
    fetchUserName();
  });

  return (
    <div>
      <h1>{name}</h1>
      <h3>Your Events:</h3>
      <div className="events-row"></div>
    </div>
  );
}

export default OrgProfile;