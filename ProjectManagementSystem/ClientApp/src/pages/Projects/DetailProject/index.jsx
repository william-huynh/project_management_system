import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import projectService from "../../../services/projectService";
import moment from "moment";

import Chart from "react-apexcharts";
import { ProgressBar, Step } from "react-step-progress-bar";
import ProjectDetailAssignment from "../../../components/Table/Assignment";
import ProjectDetailProblem from "../../../components/Table/Problem";
import ProjectDetailDeveloper from "../../../components/Table/Developer";
import loading from "../../../assets/loading.gif";

import "react-step-progress-bar/styles.css";
import "./index.css";

const DetailProject = (props) => {
  const [workDays, setWorkDays] = useState({
    labels: [],
    data: [],
  });
  const [assignments, setAssignments] = useState({
    labels: [],
    data: [],
  });
  const [problems, setProblems] = useState({
    labels: [],
    data: [],
  });
  const [projectAssignments, setProjectAssignments] = useState({
    labels: [],
    data: [],
  });
  const [projectProblems, setProjectProblems] = useState({
    labels: [],
    data: [],
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [sprints, setSprints] = useState([]);
  const [progress, setProgress] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [projectDisable, setProjectDisable] = useState(false);

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

  const getSprintsData = (day, assignment, problem, sprints) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let names = [],
      workDaysData = [],
      assignmentsData = [],
      problemsData = [];
    let count = 1;

    if (sprints.length === 0) {
      setProgress(0);
    } else {
      sprints.forEach((sprint) => {
        names.push(sprint.name);
        // Set work days
        workDaysData.push(getWorkDay(sprint.startedDate, sprint.endedDate));
        day -= getWorkDay(sprint.startedDate, sprint.endedDate);

        // Set assignments
        assignmentsData.push(sprint.assignmentsNumber);
        assignment -= sprint.assignmentsNumber;

        // Set problems
        problemsData.push(sprint.problemsNumber);
        problem -= sprint.problemsNumber;

        // Set progress
        if (
          getDuration(sprint.startedDate, today) > 0 &&
          getDuration(today, sprint.endedDate) > 0
        ) {
          setProgress(Math.floor(count * (100 / (sprints.length + 1))));
        }
        count++;
      });
    }

    // Set remaining
    names.push("Remaining");
    workDaysData.push(day);
    assignmentsData.push(assignment);
    problemsData.push(problem);

    // Set data
    setWorkDays({
      ...workDays,
      labels: names,
      data: workDaysData,
    });

    setAssignments({
      ...assignments,
      labels: names,
      data: assignmentsData,
    });

    setProblems({
      ...problems,
      labels: names,
      data: problemsData,
    });
  };

  const getDuration = (startDate, endDate) => {
    let start = new Date(startDate);
    let end = new Date(endDate);
    let year = end.getFullYear() - start.getFullYear();
    let month = end.getMonth() - start.getMonth();
    let date = end.getDate() - start.getDate();
    if (year > 0) date += 365 * year;
    if (month > 0) date += 30 * month;
    return date;
  };

  const projectOverdue = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (end < today) return true;
    return false;
  };

  // Fetch data
  const fetchData = () => {
    projectService.detail(id).then((result) => {
      result.data.status = projectOverdue(result.data.endedDate)
        ? "Overdue"
        : result.data.status;
      setData(result.data);
      setSprints(result.data.sprints);
      setProjectDisable(result.data.disable);
      let assignment = result.data.assignment;
      let problem = result.data.problem;
      let assignmentTotal =
        assignment.productBacklog +
        assignment.backlog +
        assignment.pending +
        assignment.todo +
        assignment.inProgress +
        assignment.inReview +
        assignment.complete;
      let problemTotal =
        problem.productBacklog +
        problem.backlog +
        problem.pending +
        problem.todo +
        problem.inProgress +
        problem.inReview +
        problem.complete;
      setOverallProgress(
        assignmentTotal + problemTotal === 0
          ? 0
          : Math.floor(
              (assignment.complete + problem.complete) /
                (assignmentTotal + problemTotal)
            )
      );
      getSprintsData(
        getWorkDay(result.data.startedDate, result.data.endedDate),
        assignmentTotal,
        problemTotal,
        result.data.sprints
      );
      setProjectAssignments({
        ...projectAssignments,
        labels: [
          "Product Backlog",
          "Backlog",
          "Pending",
          "To do",
          "In Progress",
          "In Review",
          "Complete",
        ],
        data: [
          assignment.productBacklog,
          assignment.backlog,
          assignment.pending,
          assignment.todo,
          assignment.inProgress,
          assignment.inReview,
          assignment.complete,
        ],
      });
      setProjectProblems({
        ...projectProblems,
        labels: [
          "Product Backlog",
          "Backlog",
          "Pending",
          "To do",
          "In Progress",
          "In Review",
          "Complete",
        ],
        data: [
          problem.productBacklog,
          problem.backlog,
          problem.pending,
          problem.todo,
          problem.inProgress,
          problem.inReview,
          problem.complete,
        ],
      });
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return data !== null ? (
    <div className="dashboard">
      <div className="dashboard-upper">
        {/* Project detail */}
        <div className="p-3">
          <div className="d-flex justify-content-between">
            <div className="d-flex">
              <p className="dashboard-project-title">{data.name}</p>
              <p
                className={`dashboard-project-status ${
                  data.status === "Overdue"
                    ? "status-overdue"
                    : data.status === "Active"
                    ? "status-active"
                    : "status-complete"
                }`}
              >
                <i
                  className="fa-solid fa-circle ml-3 mr-1"
                  style={{ fontSize: "10px" }}
                ></i>
                {data.status}
              </p>
            </div>
            {props.user.role[0] === "ProductOwner" ? (
              <div className="dropdown">
                <p
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fa-solid fa-bars fa-lg"></i>
                </p>
                <ul
                  className="dropdown-menu"
                  style={{ transform: "translate3d(-20px, 30.4px, 0px)" }}
                >
                  {data.status === "Complete" ? (
                    <li>
                      <p className="dropdown-item">
                        Evaluate students{" "}
                        <i class="fa-solid fa-user-pen ml-1 status-complete"></i>
                      </p>
                    </li>
                  ) : (
                    <li></li>
                  )}
                  <li onClick={() => navigate(`/projects/update/${id}`)}>
                    <p className="dropdown-item">
                      Edit project{" "}
                      <i className="fa-solid fa-pen-to-square ml-1 edit-button"></i>
                    </p>
                  </li>
                  {data.status === "Active" ? (
                    <li data-toggle="modal" data-target="#disableProjectModal">
                      <p className="dropdown-item">
                        Delete project{" "}
                        <i className="fa-solid fa-trash ml-1 delete-button"></i>
                      </p>
                    </li>
                  ) : (
                    <li></li>
                  )}
                </ul>
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <div className="row">
            <div className="col-6">
              <div className="mt-3 d-flex">
                <p className="font-weight-bold">
                  Project code:
                  <span className="ml-2 font-weight-normal">
                    {data.projectCode}
                  </span>
                </p>
                <p className="font-weight-bold ml-4">
                  Start date:
                  <span className="dashboard-start-date ml-2">
                    {moment(data.startedDate).format("DD/MM/YYYY")}
                  </span>
                </p>
                <p className="font-weight-bold ml-4">
                  End date:
                  <span className="dashboard-end-date ml-2">
                    {moment(data.endedDate).format("DD/MM/YYYY")}
                  </span>
                </p>
              </div>
              <div className="mt-3">
                <p className="font-weight-bold">
                  Progress overview:
                  <span
                    className="ml-2 font-weight-normal"
                    style={{ color: "limegreen" }}
                  >
                    {overallProgress}% completion
                  </span>
                </p>
                <p className="font-italic dashboard-project-secondary">
                  S.: Sprint
                </p>
              </div>
            </div>
            <div className="col-6">
              <div className="mt-3 d-flex">
                <p className="font-weight-bold">
                  Advisor name:
                  <span className="ml-2 font-weight-normal">
                    {data.advisor.fullName}
                  </span>
                </p>
                <p className="font-weight-bold ml-4">
                  Email:
                  <span className="font-weight-normal ml-2">
                    {data.advisor.email}
                  </span>
                </p>
              </div>
              <div className="d-flex mt-3">
                <p className="font-weight-bold">
                  Phone number:
                  <span className="font-weight-normal ml-2">
                    {data.advisor.phoneNumber}
                  </span>
                </p>
                <p className="font-weight-bold ml-4">
                  Address:
                  <span className="font-weight-normal ml-2">
                    {data.advisor.address}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="dashboard-progress-bar mt-3">
            <ProgressBar percent={progress}>
              <Step>
                {({ accomplished }) => (
                  <div
                    className={`indexedStep ${
                      accomplished ? "accomplished" : null
                    }`}
                  >
                    Start
                  </div>
                )}
              </Step>
              {sprints.map(() => (
                <Step>
                  {({ accomplished, index }) => (
                    <div
                      className={`indexedStep ${
                        accomplished ? "accomplished" : null
                      }`}
                    >
                      S. 0{index}
                    </div>
                  )}
                </Step>
              ))}
              <Step>
                {({ accomplished }) => (
                  <div
                    className={`indexedStep ${
                      accomplished ? "accomplished" : null
                    }`}
                  >
                    End
                  </div>
                )}
              </Step>
            </ProgressBar>
          </div>
        </div>
        <div className="row m-0 py-2">
          <div className="col-4 d-flex">
            <p
              style={{
                textAlign: "right",
                alignSelf: "center",
                fontWeight: "500",
              }}
            >
              Sprint's work days distribution
            </p>
            <Chart
              options={{
                labels: workDays.labels,
              }}
              series={workDays.data}
              type="pie"
              width="270"
            />
          </div>
          <div className="d-flex col-4">
            <p
              style={{
                textAlign: "right",
                alignSelf: "center",
                fontWeight: "500",
              }}
            >
              Sprint's assignments distribution
            </p>
            <Chart
              options={{
                labels: assignments.labels,
              }}
              series={assignments.data}
              type="pie"
              width="270"
            />
          </div>
          <div className="d-flex col-4">
            <p
              style={{
                textAlign: "right",
                alignSelf: "center",
                fontWeight: "500",
              }}
            >
              Sprint's problems distribution
            </p>
            <Chart
              options={{
                labels: problems.labels,
              }}
              series={problems.data}
              type="pie"
              width="270"
            />
          </div>
        </div>
      </div>
      <div
        className="row dashboard-lower"
        style={{ border: "1px solid #ced4da", borderRadius: "5px" }}
      >
        <div className="col-8 p-2">
          <p
            style={{
              textAlign: "center",
              fontWeight: "500",
              fontSize: "16px",
              marginBottom: "0.5rem",
            }}
          >
            Assignments and problems table list
          </p>

          {/* Tab navigation */}
          <ul className="nav nav-tabs mb-2" id="myTab" role="tablist">
            <li className="nav-item">
              <a
                className="nav-link active"
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
            <li className="nav-item">
              <a
                className="nav-link"
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
            <li className="nav-item">
              <a
                className="nav-link"
                id="developer-tab"
                data-toggle="tab"
                href="#developer"
                role="tab"
                aria-controls="developer"
                aria-selected="false"
              >
                Developer
              </a>
            </li>
          </ul>

          <div className="tab-content home-tab" id="myTabContent">
            <div
              className="tab-pane fade show active"
              id="assignment"
              role="tabpanel"
              aria-labelledby="assignment-tab"
            >
              <ProjectDetailAssignment projectId={id} />
            </div>
            <div
              className="tab-pane fade"
              id="problem"
              role="tabpanel"
              aria-labelledby="problem-tab"
            >
              <ProjectDetailProblem projectId={id} />
            </div>
            <div
              className="tab-pane fade"
              id="developer"
              role="tabpanel"
              aria-labelledby="developer-tab"
            >
              <ProjectDetailDeveloper projectId={id} />
            </div>
          </div>
        </div>
        <div className="col-4 p-2">
          <p
            style={{
              textAlign: "center",
              fontWeight: "500",
              fontSize: "16px",
              marginBottom: "0.5rem",
            }}
          >
            Assignments and problems overview
          </p>
          <div className="d-flex flex-column align-items-center justify-content-center">
            <Chart
              options={{
                labels: projectAssignments.labels,
              }}
              series={projectAssignments.data}
              type="donut"
              width="370"
              className="mb-4"
            />
            <Chart
              options={{
                labels: projectProblems.labels,
              }}
              series={projectProblems.data}
              type="donut"
              width="370"
            />
          </div>
        </div>
      </div>

      {/* Disable project modal */}
      <div
        className="modal fade"
        id="disableProjectModal"
        tabIndex="-1"
        role="dialog"
      >
        <div
          className="modal-dialog modal-dialog-centered"
          role="document"
          id="disable-project-modal"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">
                Disable Project
              </h5>
              <button type="button" className="close" data-dismiss="modal">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {projectDisable
                ? "Are you sure you want to disable this project?"
                : "This project is currently assigned to students"}
            </div>
            {projectDisable ? (
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-confirm-advisor"
                  data-dismiss="modal"
                  onClick={() => {
                    projectService.disable(id).then(() => {
                      navigate("/projects");
                    });
                  }}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className="btn btn-cancel"
                  data-dismiss="modal"
                >
                  No
                </button>
              </div>
            ) : (
              <div className="modal-footer"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <>
      <div className="loading">
        <img src={loading} alt="Loading..." />
      </div>
    </>
  );
};

export default DetailProject;
