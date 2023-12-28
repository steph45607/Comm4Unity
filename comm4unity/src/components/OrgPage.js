import React, { useEffect } from "react";
import Navbar from "./navbar";
import "../styles/org.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

class App extends React.Component {
  componentDidMount() {
    var script = document.createElement("script");
    script.id = "ff-script";
    script.src =
      "https://formfacade.com/include/115935186144550186263/form/1FAIpQLSd2ptioKCyRu19d7XW6JdnT9ilq5iHL6_HZ3g7NkmAoGFJ_iA/classic.js?div=ff-compose";
    script.defer = true;
    script.async = true;
    document.getElementById("ff-compose").appendChild(script);
  }

  render() {
    return (
      <div>
        {/* <BrowserRouter>
                    <Navbar />
                </BrowserRouter> */}
        <h1 className="head">
          <span> Organization Form </span>
        </h1>
        <div id="ff-compose"></div>
      </div>
    );
  }
}

function Organization() {
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<App />);
}

export default Organization;
