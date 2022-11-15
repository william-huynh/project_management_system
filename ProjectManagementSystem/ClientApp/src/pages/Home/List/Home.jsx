import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../../../services/userService";

import ListAssignment from "./ListAssignment";
import ListProblem from "./ListProblem";

const Home = (props) => {
  const role = props.user.role[0];
  const user = props.user;
  const navigate = useNavigate();
  const [isUserAssign, setIsUserAssign] = useState(false);

  // Fetch data
  const fetchData = (id) => {
    userService.checkUserAssigned(id).then((response) => {
      setIsUserAssign(response.data);
    });
  };

  useEffect(() => {
    fetchData(user.id);
  }, []);

  return isUserAssign === true ? (
    <div className="assignment-table">
      <p
        className={`${
          role === "ScrumMaster"
            ? "header-assignment-list"
            : "header-assignment-list-developer"
        }`}
      >
        Assignment and Problem List
      </p>

      {/* Tab navigation */}
      <ul class="nav nav-tabs mt-3 d-flex" id="myTab" role="tablist">
        <li class="nav-item">
          <a
            class="nav-link active"
            id="assignment-tab"
            data-toggle="tab"
            href="#assignment"
            role="tab"
            aria-controls="assignment"
            aria-selected="true"
          >
            Assignment
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            id="problem-tab"
            data-toggle="tab"
            href="#problem"
            role="tab"
            aria-controls="problem"
            aria-selected="false"
          >
            Problem
          </a>
        </li>
        <li className="flex-1">
          <button
            className={`change-board-button ${
              role === "ScrumMaster"
                ? "change-board-scrum-master"
                : "change-board-developer"
            }`}
            type="primary"
            onClick={() => navigate("/board")}
          >
            Change to board view
          </button>
        </li>
      </ul>

      <div class="tab-content home-tab" id="myTabContent">
        <div
          class="tab-pane fade show active"
          id="assignment"
          role="tabpanel"
          aria-labelledby="assignment-tab"
        >
          <ListAssignment user={user} />
        </div>
        <div
          class="tab-pane fade"
          id="problem"
          role="tabpanel"
          aria-labelledby="problem-tab"
        >
          <ListProblem user={user} />
        </div>
      </div>
    </div>
  ) : (
    <div className="no-assign-error">
      <div>
        <i className="fa-solid fa-users-slash fa-xl"></i>
      </div>
      <p>User is not assigned to a project!</p>
    </div>
  );
};

export default Home;
