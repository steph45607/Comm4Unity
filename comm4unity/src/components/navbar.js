import React from "react";
import "../styles/navbar.css";
import picture from "../assets/picture.jpg";
import { Link } from "react-router-dom";

function Navbar() {
  const handleRefresh = () => {
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };
  return (
    <div className="navbar">
      <div className="homedirect">
        <Link to={"/index"} style={{textDecoration:'none', color:'white'}} onClick={handleRefresh}>
            <h2 className="navbar-top">Comm4Unity</h2>
        </Link>
      </div>
      <div className="profile">

      </div>
      <img src={picture} alt=""></img>
      <h3 className="navbar-top">Welcome to Comm4Unity</h3>
    </div>
  );
}

export default Navbar;
