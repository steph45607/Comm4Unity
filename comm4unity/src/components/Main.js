import React from "react";
import Navbar from "./navbar";
import Button from "./button";
import "../styles/main.css";
import student from "../assets/students.png"
import organization from "../assets/organization.png"
import { Link } from "react-router-dom";

function Main() {
  return (
    <div>
      <Navbar />
      <div className="btn-container">
        <Link
          to={"/student"}
          style={{ textDecoration: "none", color: "white" }}
        >
          <Button logo={student} text={"Student looking for SAT or ComServ"} />
        </Link>
        <Link to={"/organization"} style={{ textDecoration: "none" }}>
          <Button logo={organization} text={"Organization wants to promote their website"} />
        </Link>
      </div>
    </div>
  );
}
export default Main;
