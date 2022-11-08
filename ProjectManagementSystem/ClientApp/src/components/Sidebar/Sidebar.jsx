import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import userService from "../../services/userService";

import "./Sidebar.css";

const Sidebar = (props) => {
  const user = props.user;
  const [projectId, setProjectId] = useState(null);

  useEffect(() => {
    userService
      .getProjectId(user.id)
      .then((response) => setProjectId(response.data));
  }, []);

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
            <NavLink to="/assignments">
              <li>Manage Assignments</li>
            </NavLink>
            <NavLink to="/problems">
              <li>Manage Problems</li>
            </NavLink>
            {projectId === null ? (
              <div></div>
            ) : (
              <NavLink to={`/projects/${projectId}`}>
                <li>Project Detail</li>
              </NavLink>
            )}
          </ul>
        </div>
      ) : (
        <div className="navigation">
          <ul>
            <NavLink to="/">
              <li>Home</li>
            </NavLink>
            {projectId === null ? (
              <div></div>
            ) : (
              <NavLink to={`/projects/${projectId}`}>
                <li>Project Detail</li>
              </NavLink>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
