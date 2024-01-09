import React, { useState , useEffect, useRef} from 'react'
import "../styles/navbar.css";
import picture from "../assets/picture.jpg";
import { Link } from "react-router-dom";
import Navdropdown from "./NavbarDropdown";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
// import {faCircleUser} from '@fortawesome/free-solid-svg-icons'
import { useOnHoverOutside } from "./../hooks/Hover";

function Navbar() {
  const dropdownRef = useRef(null); // Create a reference for dropdown container
  const [isMenuDropDownOpen, setMenuDropDownOpen] = useState(false);
  const closeHoverMenu = () => {
      setMenuDropDownOpen(false);
  };

  useOnHoverOutside(dropdownRef, closeHoverMenu); // Call the hook

  const handleRefresh = () => {
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };
  return (
    <div className="main">
      <div className="navbar">
        <div className="homedirect">
          <Link to={"/index"} style={{textDecoration:'none', color:'white'}} onClick={handleRefresh}>
              <h2 className="navbar-top">Comm4Unity</h2>
          </Link>
        </div>
        <div className="top">
          <ul className='ultext'>
            <li
                className='nav-item'
            >
                <div className='profile_bar' ref={dropdownRef} class="">
                    <p className='profile' onMouseOver={() => setMenuDropDownOpen(true)}>
                        coba
                    </p>
                    {isMenuDropDownOpen && <Navdropdown />}
                </div>
            </li>
          </ul>
        </div>
      </div>
      <img src={picture} alt=""></img>
      <h3 className="navbar-top">Welcome to Comm4Unity</h3>
    </div>
  );
}

export default Navbar;
