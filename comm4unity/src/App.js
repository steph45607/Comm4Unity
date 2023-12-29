import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Main from "./components/Main";
import Student from "./components/StudentPage";
import Organization from "./components/OrgPage";
import Event from "./components/Event";
import Test from "./components/Test";
import Login from "./components/Login";
import Register from "./components/Register";
import Reset from "./components/Reset";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/reset" element={<Reset />} />
        {/* <Route exxact path="/test" element={<CreateEventForm />} /> */}
        {/* <Route exact path="/index" element={<Dashboard />} /> */}
        <Route exact path="/index" element={<Main />} />
        {/* <Route exact path="/test" element={<Test />} /> */}
        <Route exact path="/organization" element={<Organization />} />
        <Route exact path="/student" element={<Student />} />
        <Route exact path="/event/:id" element={<Event />} />
      </Routes>
    </Router>
  );
}

export default App;
