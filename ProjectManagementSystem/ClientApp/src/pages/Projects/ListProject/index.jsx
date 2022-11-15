import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../axios";
import projectService from "../../../services/projectService";
import moment from "moment";

import CardProject from "../../../components/Card/Project/CardProject";

import "antd/dist/antd.css";
import "./index.css";

const ProjectTable = (props) => {
  const { id } = props.user;
  const navigate = useNavigate();
  const [data, setData] = useState();
  const [projects, setProjects] = useState(null);
  const [summary, setSummary] = useState({
    total: 0,
    active: 0,
    complete: 0,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 2,
    status: "All",
    advisorId: "",
  });

  // Fetch data
  const fetchData = (params = {}) => {
    axiosInstance
      .get(
        `projects/getlist?&page=${params.pagination.current}&pageSize=${params.pagination.pageSize}&status=${params.pagination.status}&advisorId=${params.pagination.advisorId}`
      )
      .then((results) => {
        results.data.projects.forEach((element) => {
          element.startedDate = moment(element.startedDate).format(
            "DD/MM/YYYY"
          );
          element.endedDate = moment(element.endedDate).format("DD/MM/YYYY");
        });
        setData(results.data);
        setProjects(results.data.projects);
        setPagination({
          ...params.pagination,
          total: results.data.totalItem,
        });
      });
  };

  // Menu on click
  const handleMenuClick = (e) => {
    setPagination((pagination.status = e));
    console.log(e);
    fetchData({
      pagination,
    });
  };

  const onChange = (newPage) => {
    setPagination((pagination.current = newPage));
    fetchData({
      pagination,
    });
  };

  const getSummary = () => {
    projectService.summary(null).then((response) => {
      let updateSummary = {
        total: response.data.total,
        active: response.data.active,
        complete: response.data.complete,
      };
      setSummary(updateSummary);
    });
  };

  useEffect(() => {
    fetchData({
      pagination,
    });
    getSummary();
  }, []);

  return data != null ? (
    <div className="project-table">
      <div className="d-flex justify-content-between">
        <p className="header-project-list">Project List</p>
        <button
          className="create-project-button"
          type="primary"
          onClick={() => navigate("/projects/add")}
        >
          Add new project
        </button>
      </div>

      <div className="summary-section">
        <div
          className="summary-card filter-card"
          style={{ backgroundColor: "darkgray" }}
          onClick={() => handleMenuClick("All")}
        >
          <p className="summary-card-title">Total projects</p>
          <p className="summary-card-number">{summary.total}</p>
        </div>
        <div
          className="summary-card filter-card"
          style={{ backgroundColor: "limegreen" }}
          onClick={() => handleMenuClick("Active")}
        >
          <p className="summary-card-title">Active projects</p>
          <p className="summary-card-number">{summary.active}</p>
        </div>
        <div
          className="summary-card filter-card"
          style={{ backgroundColor: "cornflowerblue" }}
          onClick={() => handleMenuClick("Complete")}
        >
          <p className="summary-card-title">Complete projects</p>
          <p className="summary-card-number">{summary.complete}</p>
        </div>
        {/* <div className="summary-card" style={{ backgroundColor: "violet" }}>
          <div className="summary-card-title">
            <p>Active projects: {summary.active}</p>
            <p>Complete projects: {summary.complete}</p>
          </div>
          <Chart
            options={{
              labels: ["Active", "Complete"],
            }}
            series={[summary.active, summary.complete]}
            type="pie"
            width="300"
          />
        </div>
        <div
          className="summary-card"
          style={{ backgroundColor: "darkturquoise" }}
        >
          <div className="summary-card-title">
            <p>Total projects: {summary.total}</p>
            <p>My projects: {summary.owned}</p>
          </div>
          <Chart
            options={{
              labels: ["Total", "My projects"],
            }}
            series={[summary.active, summary.complete]}
            type="pie"
            width="300"
          />
        </div> */}
      </div>

      <div className="list-section">
        {projects !== null ? (
          projects.map((project) => {
            return <CardProject project={project} />;
          })
        ) : (
          <div></div>
        )}
      </div>

      <nav className="float-right">
        <ul className="pagination pg-blue">
          {[...Array(data.numberPage)].map((x, index) => {
            return (
              <li
                className={`page-item ${
                  data.currentPage === index + 1 ? "active" : ""
                }`}
                onClick={() => onChange(index + 1)}
              >
                <a className="page-link ">{index + 1}</a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Disable project modal */}
      {/* <div
        className="modal fade"
        id="disableProjectModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="disableProjectModal"
        aria-hidden="true"
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
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {projectCanDisable === true
                ? "Are you sure you want to disable this project?"
                : "This project is currently assigned to students"}
            </div>
            {projectCanDisable === true ? (
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-confirm-advisor"
                  data-dismiss="modal"
                  onClick={() => {
                    projectService.disable(projectId).then(() => {
                      fetchData({
                        pagination,
                      });
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
      </div> */}
    </div>
  ) : (
    <div></div>
  );
};

export default ProjectTable;
