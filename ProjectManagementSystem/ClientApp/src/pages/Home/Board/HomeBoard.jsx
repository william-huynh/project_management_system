import React from "react";
import { useNavigate } from "react-router-dom";

import BoardAssignment from "./BoardAssignment";
import BoardProblem from "./BoardProblem";

const HomeBoard = (props) => {
  const user = props.user;
  const role = props.user.role[0];
  const navigate = useNavigate();

  return (
    <div className="board-table">
      <p
        className={`${
          role === "ScrumMaster"
            ? "header-assignment-list"
            : "header-assignment-list-developer"
        }`}
      >
        Assignment and Problem Board
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
            onClick={() => navigate("/")}
          >
            Change to table view
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
          <BoardAssignment user={user} />
        </div>
        <div
          class="tab-pane fade"
          id="problem"
          role="tabpanel"
          aria-labelledby="problem-tab"
        >
          <BoardProblem user={user} />
        </div>
      </div>
    </div>
  );
};

export default HomeBoard;
