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
      {user.role[0] === "ProductOwner" ? (
        <div className="navigation">
          <ul>
            <NavLink to="/">
              <li>
                <i class="fa-solid fa-house mr-2"></i> Dashboard
              </li>
            </NavLink>
            <NavLink to="/users">
              <li>
                <i class="fa-solid fa-user mr-2"></i> User
              </li>
            </NavLink>
            <NavLink to="/projects">
              <li>
                <i class="fa-solid fa-briefcase mr-2"></i> Project
              </li>
            </NavLink>
          </ul>
        </div>
      ) : user.role[0] === "ScrumMaster" ? (
        <div className="navigation">
          <ul>
            <NavLink to={`/`}>
              <li>
                <i class="fa-solid fa-house mr-2"></i> Dashboard
              </li>
            </NavLink>
            <NavLink to="/my-assignment">
              <li>
                <i class="fa-solid fa-house mr-2"></i> My Assignment
              </li>
            </NavLink>
            <NavLink to="/sprints">
              <li>
                <i class="fa-solid fa-folder mr-2"></i> Sprints
              </li>
            </NavLink>
            <NavLink to="/assignments">
              <li>
                <i class="fa-solid fa-clipboard-list mr-2"></i> Assignments
              </li>
            </NavLink>
            <NavLink to="/problems">
              <li>
                <i class="fa-solid fa-bug mr-2"></i> Problems
              </li>
            </NavLink>
          </ul>
        </div>
      ) : (
        <div className="navigation">
          <ul>
            <NavLink to="/">
              <li>
                <i class="fa-solid fa-house mr-2"></i> Home
              </li>
            </NavLink>
            {projectId === null ? (
              <div></div>
            ) : (
              <NavLink to={`/projects/${projectId}`}>
                <li>
                  <i class="fa-solid fa-chart-pie mr-2"></i> Dashboard
                </li>
              </NavLink>
            )}
            <NavLink to="/problems/add">
              <li>
                <i class="fa-solid fa-bug mr-2"></i> Problems
              </li>
            </NavLink>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
