import React, { useState, useEffect } from "react";
import projectService from "../../../services/projectService";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import moment from "moment";

import "./index.css";

const DetailProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projectDetail, setProjectDetail] = useState(null);
  const [developers, setDevelopers] = useState([]);

  // Fetch data
  const fetchData = (id) => {
    projectService.detail(id).then((response) => {
      console.log(response.data);
      setProjectDetail(response.data);
      setDevelopers(response.data.developers);
      formik.setFieldValue("name", response.data.name);
      formik.setFieldValue("description", response.data.description);
      formik.setFieldValue("projectCode", response.data.projectCode);
      formik.setFieldValue("status", response.data.status);
      formik.setFieldValue(
        "startedDate",
        moment(response.data.startedDate).format("YYYY-MM-DD")
      );
      formik.setFieldValue(
        "endedDate",
        moment(response.data.endedDate).format("YYYY-MM-DD")
      );
    });
  };

  const formik = useFormik({
    initialValues: {
      projectCode: "",
      name: "",
      description: "",
      status: "",
      startedDate: "",
      endedDate: "",
    },
  });

  useEffect(() => {
    fetchData(id);
  }, [id]);

  return (
    <div className="create-project">
      <p className="header-project-list">Project detail</p>
      <div className="row" style={{ marginTop: "0.5rem" }}>
        <div className="col-6">
          <button
            className="detail-project-button"
            onClick={() => navigate(`/projects/update/${id}`)}
          >
            Edit project
          </button>
        </div>
        <div className="col-6 text-right">
          <button
            className="detail-project-button"
            onClick={() => navigate("/projects")}
          >
            Return to index
          </button>
        </div>
      </div>
      <div className="upper-form">
        <p className="form-title">Project information</p>
        <div className="row mt-3">
          <div className="col-6">
            <div className="input-group flex-nowrap">
              <div className="input-group-prepend">
                <span className="input-group-text" id="addon-wrapping">
                  Project name
                </span>
              </div>
              <input
                id="name"
                name="name"
                value={formik.values.name}
                type="text"
                className="form-control detail-project-input"
                readOnly
              />
            </div>
          </div>
          <div className="col-3">
            <div className="input-group flex-nowrap">
              <div className="input-group-prepend">
                <span className="input-group-text" id="addon-wrapping">
                  Project code
                </span>
              </div>
              <input
                id="projectCode"
                name="projectCode"
                value={formik.values.projectCode}
                type="text"
                className="form-control detail-project-input"
                readOnly
              />
            </div>
          </div>
          <div className="col-3">
            <div className="input-group flex-nowrap">
              <div className="input-group-prepend">
                <span className="input-group-text" id="addon-wrapping">
                  Project status
                </span>
              </div>
              <input
                id="projectStatus"
                name="projectStatus"
                value={formik.values.status}
                type="text"
                className={`form-control detail-project-input ${
                  formik.values.status === "Active"
                    ? "detail-project-status-active"
                    : "detail-project-status-completed"
                }`}
                readOnly
              />
            </div>
          </div>
        </div>
        <div className="mt-3">
          <div className="input-group flex-nowrap">
            <div className="input-group-prepend">
              <span className="input-group-text" id="addon-wrapping">
                Project description
              </span>
            </div>
            <textarea
              rows="2"
              id="description"
              name="description"
              value={formik.values.description}
              className="form-control detail-project-input"
              readOnly
            />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-6">
            <div className="input-group flex-nowrap">
              <div className="input-group-prepend">
                <span className="input-group-text" id="addon-wrapping">
                  Start date
                </span>
              </div>
              <input
                id="startedDate"
                name="startedDate"
                value={moment(formik.values.startedDate).format("YYYY-MM-DD")}
                type="date"
                className="form-control detail-project-input"
                readOnly
              />
            </div>
          </div>
          <div className="col-6">
            <div className="input-group flex-nowrap">
              <div className="input-group-prepend">
                <span className="input-group-text" id="addon-wrapping">
                  End date
                </span>
              </div>
              <input
                id="endedDate"
                name="endedDate"
                value={moment(formik.values.endedDate).format("YYYY-MM-DD")}
                type="date"
                className="form-control detail-project-input"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
      <div className="lower-form">
        <p className="form-title" onClick={() => console.log(developers)}>
          Assign User
        </p>
        <table className="table table-striped mt-3">
          <thead className="detail-project-table-heading white-text">
            <tr>
              <th scope="col">User Code</th>
              <th scope="col">Full name</th>
              <th scope="col">Username</th>
              <th scope="col">Role</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          {projectDetail === null ? (
            <tbody></tbody>
          ) : (
            <tbody>
              <tr>
                <td>{projectDetail.advisor.userCode}</td>
                <td>{projectDetail.advisor.fullName}</td>
                <td>{projectDetail.advisor.userName}</td>
                <td>{projectDetail.advisor.role}</td>
                <td className="text-center">
                  <i
                    className="fa-solid fa-circle-exclamation fa-lg user-detail-button"
                    onClick={() =>
                      navigate(`/users/${projectDetail.advisor.id}`)
                    }
                  ></i>
                </td>
              </tr>
              <tr>
                <td>{projectDetail.scrumMaster.userCode}</td>
                <td>{projectDetail.scrumMaster.fullName}</td>
                <td>{projectDetail.scrumMaster.userName}</td>
                <td>{projectDetail.scrumMaster.role}</td>
                <td className="text-center">
                  <i
                    className="fa-solid fa-circle-exclamation fa-lg user-detail-button"
                    onClick={() =>
                      navigate(`/users/${projectDetail.scrumMaster.id}`)
                    }
                  ></i>
                </td>
              </tr>
              {developers.map((developer) => (
                <tr>
                  <td>{developer.userCode}</td>
                  <td>{developer.fullName}</td>
                  <td>{developer.userName}</td>
                  <td>{developer.role}</td>
                  <td className="text-center">
                    <i
                      className="fa-solid fa-circle-exclamation fa-lg user-detail-button"
                      onClick={() => navigate(`/users/${developer.id}`)}
                    ></i>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default DetailProject;
