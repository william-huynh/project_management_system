import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axios";
import projectService from "../../services/projectService";
import moment from "moment";

import Chart from "react-apexcharts";
import CardProject from "../../components/Card/Project/CardProject";

import "antd/dist/antd.css";

const HomeProject = (props) => {
  const { id } = props.user;
  const navigate = useNavigate();
  const [data, setData] = useState();
  const [projects, setProjects] = useState(null);
  const [summary, setSummary] = useState({
    total: 0,
    active: 0,
    complete: 0,
    owned: 0,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 2,
    status: "All",
    advisorId: id,
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

  const onChange = (newPage) => {
    setPagination((pagination.current = newPage));
    fetchData({
      pagination,
    });
  };

  const getSummary = () => {
    projectService.summary(id).then((response) => {
      let updateSummary = {
        total: response.data.total,
        active: response.data.active,
        complete: response.data.complete,
        owned: response.data.owned,
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
      <p className="header-project-list">Project Dashboard</p>

      <div className="summary-section">
        <div
          className="summary-card-chart"
          style={{ backgroundColor: "violet" }}
        >
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
            width="240"
          />
        </div>
        <div
          className="summary-card-chart"
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
            width="250"
          />
        </div>
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

export default HomeProject;
