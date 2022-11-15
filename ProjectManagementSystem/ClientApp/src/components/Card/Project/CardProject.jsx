import React from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";
import "./CardProject.css";

const CardProject = (props) => {
  const navigate = useNavigate();
  const project = props.project;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getWorkDay = (startedDate, endedDate) => {
    let count = 0;
    const endDate = new Date(endedDate);
    const curDate = new Date(startedDate);
    while (curDate <= endDate) {
      const dayOfWeek = curDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
      curDate.setDate(curDate.getDate() + 1);
    }
    return count;
  };

  const workDaysPercentage = Math.floor(
    (getWorkDay(project.startedDate, today) /
      getWorkDay(project.startedDate, project.endedDate)) *
      100
  );
  const progressionPercentage = Math.floor(
    (project.totalCompleteNumber /
      (project.totalAssignmentsNumber + project.totalProblemsNumber)) *
      100
  );

  return (
    <div
      className="project-card-container"
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      <div className="dashboard-upper">
        {/* Project detail */}
        <div className="p-3">
          <div className="row">
            <div className="col-6">
              <div className="d-flex">
                <p className="dashboard-project-title">{project.name}</p>
                <p
                  className={`dashboard-project-status ${
                    project.status === "Active"
                      ? "status-active"
                      : "status-complete"
                  }`}
                >
                  <i
                    class="fa-solid fa-circle ml-3 mr-1"
                    style={{ fontSize: "10px" }}
                  ></i>
                  {project.status}
                </p>
              </div>
              <div className="mt-3 d-flex">
                <p className="font-weight-bold">
                  Project code:
                  <span className="ml-2 font-weight-normal">
                    {project.projectCode}
                  </span>
                </p>
                <p className="font-weight-bold ml-4">
                  Start date:
                  <span className="dashboard-start-date ml-2">
                    {project.startedDate}
                  </span>
                </p>
                <p className="font-weight-bold ml-4">
                  End date:
                  <span className="dashboard-end-date ml-2">
                    {project.endedDate}
                  </span>
                </p>
              </div>
              <div className="mt-3 d-flex">
                <p className="font-weight-bold">
                  Advisor name:
                  <span className="ml-2 font-weight-normal">
                    {project.advisorName}
                  </span>
                </p>
                <p className="font-weight-bold ml-4">
                  Email:
                  <span className="font-weight-normal ml-2">
                    {project.advisor.email}
                  </span>
                </p>
              </div>
            </div>
            <div className="col-6 d-flex">
              <div className="d-flex flex-1">
                <p className="text-right align-self-center font-weight-bold">
                  Progression
                </p>
                <div className="pl-4 align-self-center">
                  <CircularProgressbar
                    value={
                      project.totalAssignmentsNumber +
                        project.totalProblemsNumber !==
                      0
                        ? progressionPercentage
                        : 0
                    }
                    text={`${
                      project.totalAssignmentsNumber +
                        project.totalProblemsNumber !==
                      0
                        ? progressionPercentage
                        : 0
                    }%`}
                    styles={buildStyles({
                      strokeLinecap: "butt",
                      pathColor: "limegreen",
                    })}
                  />
                </div>
              </div>
              <div className="d-flex flex-1">
                <p className="text-right align-self-center font-weight-bold">
                  Working days
                </p>
                <div className="pl-4 align-self-center">
                  <CircularProgressbar
                    value={workDaysPercentage}
                    text={`${workDaysPercentage}%`}
                    styles={buildStyles({
                      strokeLinecap: "butt",
                      pathColor: "orange",
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="row m-0 py-1"
          style={{ borderTop: "0.25px solid #cdcdcd" }}
        >
          <div className="col-3">
            {project.assignedDevelopers.map((x, index) => {
              return (
                <img
                  src="https://leaveitwithme.com.au/wp-content/uploads/2013/11/dummy-image-square.jpg"
                  alt="dummy"
                  className="project-card-profile-picture"
                  style={index === 0 ? {} : { marginLeft: "-1rem" }}
                />
              );
            })}
          </div>
          <div className="col-3 d-flex">
            <i
              class="fa-solid fa-folder fa-xl mr-2 align-self-center"
              style={{ color: "#cdcdcd" }}
            ></i>
            <div>
              <p style={{ fontWeight: "500" }}>Sprints</p>
              <p className="project-card-bottom-detail">
                {project.totalSprintsNumber}
              </p>
            </div>
          </div>
          <div className="col-3 d-flex">
            <i
              class="fa-solid fa-clipboard-list fa-xl mr-2 align-self-center"
              style={{ color: "#cdcdcd" }}
            ></i>
            <div>
              <p style={{ fontWeight: "500" }}>Assignments</p>
              <p className="project-card-bottom-detail">
                {project.totalAssignmentsNumber}
              </p>
            </div>
          </div>
          <div className="col-3 d-flex">
            <i
              class="fa-solid fa-bug fa-xl mr-2 align-self-center"
              style={{ color: "#cdcdcd" }}
            ></i>
            <div>
              <p style={{ fontWeight: "500" }}>Problems</p>
              <p className="project-card-bottom-detail">
                {project.totalProblemsNumber}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardProject;
