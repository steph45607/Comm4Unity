import React, { useState , useEffect} from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import "../styles/Dropdown.css"
import {Link, useNavigate} from "react-router-dom";
import { auth, db, logout } from "../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import axios from 'axios';
import { BACKEND_LINK } from "./CONST";

function Navdropdown() {
    const [click, setClick] = useState(false);
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
    const [lloading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [user, loading] = useAuthState(auth);
    const [name, setName] = useState("");
    const [role, setRole] = useState("");

    const handleClick = () => setClick(!click);

    const handleLogout = () => {
        window.localStorage.removeItem("access_token");
        navigate("/")
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
    
          setEvent({
            ...event,
            o_id: userData.uid,
          });
    
          setName(userData.name);
          setRole(userData.role);
          setLoading(false);
        } catch (err) {
          console.error(err);
          alert("An error occurred while fetching user data");
        }
      };
    
    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/");
        fetchUserName();
    }, [user, loading]);

    return (
        <>
            <ul
                onClick={handleClick}
                className={click ? 'dropdown-menu clicked' : 'dropdown-menu'}
            >
                <div className='dropdown-container'>
                    <div className="dropdownname">
                        { role === "organization" ? 
                                <Link to={"/organization/profile"} style={{textDecoration:'none', color:'black'}}>
                                    <p className='dropdowntext'>Logged in as:</p>
                                    <p className='displayname'>{name}</p>
                                </Link>
                             : 
                                <Link to={"/student/profile"} style={{textDecoration:'none', color:'black'}}>
                                    <p className='dropdowntext'>Logged in as:</p>
                                    <p className='displayname'>{name}</p>
                                </Link>
                        }
                    </div>
                    <li className='logout' onClick={logout}>
                        <button onClick={logout} className='logoutbtn'>Logout</button>
                    </li>
                </div>
            </ul>
        </>
    );
}

export default Navdropdown;