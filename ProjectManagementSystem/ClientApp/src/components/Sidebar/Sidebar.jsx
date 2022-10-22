import { NavLink } from "react-router-dom";

import "./Sidebar.css";

const Sidebar = (props) => {
  const user = props.user;

  return (
    <div
      className={
        user.role[0] === "ProductOwner"
          ? "sidebar red-sidebar"
          : user.role[0] === "ScrumMaster"
          ? "sidebar blue-sidebar"
          : "sidebar green-sidebar"
      }
    >
      {/* <img src={logo} alt="NasTech logo" className="logo" /> */}
      <p>Project Management System</p>
      {user.role[0] === "ProductOwner" ? (
        <div className="navigation">
          <ul>
            <NavLink to="/">
              <li>Home</li>
            </NavLink>
            <NavLink to="/users">
              <li>Manage User</li>
            </NavLink>
            <NavLink to="/projects">
              <li>Manage Project</li>
            </NavLink>
          </ul>
        </div>
      ) : user.role[0] === "ScrumMaster" ? (
        <div className="navigation">
          <ul>
            <NavLink to="/">
              <li>Home</li>
            </NavLink>
            <NavLink to="/sprints">
              <li>Manage Sprints</li>
            </NavLink>
          </ul>
        </div>
      ) : (
        <div className="navigation">
          <ul>
            <NavLink to="/">
              <li>Home</li>
            </NavLink>
            <NavLink to="/users">
              <li>Manage User</li>
            </NavLink>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
