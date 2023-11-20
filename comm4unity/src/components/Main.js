import React from "react";
import Navbar from "./navbar";
import Button from "./button";
import "../styles/main.css";
import { Link } from "react-router-dom";

function Main() {
  return (
    <div>
      <Navbar />
      <p>Which one are you?</p>
      <div className="btn-container" >
        <Link to={"/student"} style={{textDecoration:'none', color:'white'}}>
          <Button text={"Student looking for SAT or ComServ"} />
        </Link>
        <Link to={"/organization"} style={{textDecoration:'none', color:'white'}}>
          <Button text={"Organization wants to promote their website"} />
        </Link>
      </div>
    </div>
  );
}
export default Main;
