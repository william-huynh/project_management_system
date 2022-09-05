import { NavLink } from "react-router-dom";

import logo from "../../assets/logoNasTech.svg";
import "./Sidebar.css";

function Sidebar(props) {
  return (
    <div className="sidebar">
      <img src={logo} alt="NasTech logo" className="logo" />
      <p>Online Asset Mangement</p>
      {props.role === "Admin" ? (
        <div className="navigation">
          <ul>
            <NavLink to="/">
              <li>Home</li>
            </NavLink>
            <NavLink to="/users">
              <li>Manage User</li>
            </NavLink>
            <NavLink to="/assets">
              <li>Manage Asset</li>
            </NavLink>
            <NavLink to="/assignments">
              <li>Manage Assignment</li>
            </NavLink>
            <NavLink to="/requests">
              <li>Request for Returning</li>
            </NavLink>
            <NavLink to="/reports">
              <li>Report</li>
            </NavLink>
          </ul>
        </div>
      ) : (
        <div className="navigation">
          <ul>
            <NavLink to="/">
              <li>Home</li>
            </NavLink>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
