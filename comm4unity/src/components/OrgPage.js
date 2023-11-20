import React from "react";
import Navbar from "./navbar";
import "../styles/org.css";

function Organization(){
    return(
        <div>
            <Navbar/>
            <h1 class="head"><span> Organization Form </span></h1>
            <div class="container2">
                <iframe class="responsive-iframe" src="https://forms.gle/S3pAUoAyfN57p6pH8"></iframe>
            </div>
        </div>
    )
}

export default Organization