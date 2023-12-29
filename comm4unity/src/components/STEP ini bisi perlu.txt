import Navbar from "./navbar";
import Button from "./button";
import "../styles/main.css";
import student from "../assets/students.png";
import organization from "../assets/organization.png";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import Student from "./StudentPage";
import OrgHolder from "./OrgHolder";
// import {getAuth} from "firebase/auth"

function Main() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const fetchUserName = async () => {
    try {
      // console.log("here")
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      // console.log(getDocs(q))
      const doc = await getDocs(q);
      // console.log(doc)
      // console.log("here")
      const data = doc.docs[0].data();
      // console.log(data)
      setName(data.name);
      setRole(data.role);
      // console.log(data)
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    // console.log("there")
    fetchUserName();
  }, [user, loading]);
  return (
    <div>
      <Navbar />
      <p>Name: {name}</p>
      <p>Email: {user?.email}</p>
      <p>Role: {role}</p>
      <button onClick={logout}>Logout</button>
      {role == "organization" ? <OrgHolder/>:<Student/>}
      {/* <div className="btn-container">
        <Link
          to={"/student"}
          style={{ textDecoration: "none", color: "white" }}
        >
          <Button logo={student} text={"Student looking for SAT or ComServ"} />
        </Link>
        <Link to={"/organization"} style={{ textDecoration: "none" }}>
          <Button
            logo={organization}
            text={"Organization wants to promote their website"}
          />
        </Link>
      </div> */}
    </div>
  );
}
export default Main;
