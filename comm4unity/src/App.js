import "./App.css";
import {BrowserRouter as Router, Route, Routes } from "react-router-dom";


import Main from "./components/Main";
import Student from "./components/StudentPage";
import Organization from "./components/OrgPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Main/>}/>
        <Route exact path="/organization" element={<Organization/>}/>
        <Route exact path="/student" element={<Student/>}/>
      </Routes>
    </Router>);
}

export default App;
