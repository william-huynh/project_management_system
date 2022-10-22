import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import userService from "../../../services/userService";
import * as yup from "yup";

import "./index.css";

const DetailUser = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const [userDetail, setUserDetail] = useState(null);
  const [advisedProject, setAdvisedProject] = useState([]);
  const [participatedProject, setParticipatedProject] = useState([]);

  // Format date
  const formatDate = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  // Get user detail
  const getUserDetail = (id) => {
    userService.detail(id).then((response) => {
      switch (response.data.role) {
        case "ProductOwner":
          response.data.role = "Product Owner";
          break;
        case "ScrumMaster":
          response.data.role = "Scrum Master";
          break;
        case "Developer":
          response.data.role = "Developer";
          break;
        default:
          break;
      }
      setUserDetail(response.data);
      setAdvisedProject(response.data.advisedProjects);
      setParticipatedProject(response.data.participatedProjects);
      console.log(response.data);
      switch (response.data.gender) {
        case "Male":
          response.data.gender = "1";
          break;
        case "Female":
          response.data.gender = "2";
          break;
        default:
          break;
      }
      formik.setFieldValue("firstName", response.data.firstName);
      formik.setFieldValue("lastName", response.data.lastName);
      formik.setFieldValue("email", response.data.email);
      formik.setFieldValue(
        "dateOfBirth",
        formatDate(response.data.dateOfBirth)
      );
      formik.setFieldValue("gender", response.data.gender);
      formik.setFieldValue("address", response.data.address);
      formik.setFieldValue("phoneNumber", response.data.phoneNumber);
    });
  };

  useEffect(() => {
    getUserDetail(id);
  }, [id]);

  const formik = useFormik({
    initialValues: {
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      dateOfBirth: "",
      gender: "",
      address: "",
      phoneNumber: "",
    },
  });

  return (
    <div className="detail-user">
      <div className="row">
        <div className="col-6">
          <p className="header-user-list">User detail</p>
        </div>
        <div className="col-6 text-right">
          <button
            className="detail-user-header-button"
            onClick={() => navigate("/users")}
          >
            Return to index
          </button>
        </div>
      </div>
      <div className="row" style={{ marginRight: 0 }}>
        <div className="col-3" style={{ marginTop: "1rem" }}>
          <img
            src="https://leaveitwithme.com.au/wp-content/uploads/2013/11/dummy-image-square.jpg"
            alt="dummy"
            className="user-detail-picture"
          />
        </div>
        <div className="col-9 upper-form">
          <p className="form-title">User information</p>
          <div className="row mt-3">
            <div className="col-6">
              <div className="input-group flex-nowrap">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="addon-wrapping">
                    First name
                  </span>
                </div>
                <input
                  id="firstName"
                  name="firstName"
                  value={formik.values.firstName}
                  type="text"
                  className="form-control detail-user-input"
                  readOnly
                />
              </div>
            </div>
            <div className="col-6">
              <div className="input-group flex-nowrap">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="addon-wrapping">
                    Last name
                  </span>
                </div>
                <input
                  id="lastName"
                  name="lastName"
                  value={formik.values.lastName}
                  type="text"
                  className="form-control detail-user-input"
                  readOnly
                />
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-7">
              <div className="input-group flex-nowrap">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="addon-wrapping">
                    Date of Birth
                  </span>
                </div>
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formik.values.dateOfBirth}
                  type="date"
                  className="form-control detail-user-input"
                  readOnly
                />
              </div>
            </div>
            <div className="col-4">
              <div className="input-group flex-nowrap">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="addon-wrapping">
                    Gender
                  </span>
                </div>
                <div className="d-flex flex-row align-items-center">
                  <div className="custom-control custom-radio ml-4">
                    <input
                      type="radio"
                      className="custom-control-input"
                      id="male"
                      name="gender"
                      value="1"
                      checked={formik.values.gender === "1" ? true : false}
                      readOnly
                    />
                    <label
                      className="custom-control-label font-weight-normal"
                      htmlFor="male"
                    >
                      Male
                    </label>
                  </div>
                  <div className="custom-control custom-radio ml-4">
                    <input
                      type="radio"
                      className="custom-control-input"
                      id="female"
                      name="gender"
                      value="2"
                      checked={formik.values.gender === "2" ? true : false}
                      readOnly
                    />
                    <label
                      className="custom-control-label font-weight-normal"
                      htmlFor="female"
                    >
                      Female
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <div className="input-group flex-nowrap">
              <div className="input-group-prepend">
                <span className="input-group-text" id="addon-wrapping">
                  Address
                </span>
              </div>
              <input
                id="address"
                name="address"
                value={formik.values.address}
                type="text"
                className="form-control detail-user-input"
                readOnly
              />
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-6">
              <div className="input-group flex-nowrap">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="addon-wrapping">
                    Email
                  </span>
                </div>
                <input
                  id="email"
                  name="email"
                  value={formik.values.email}
                  type="text"
                  className="form-control detail-user-input"
                  readOnly
                />
              </div>
            </div>
            <div className="col-6">
              <div className="input-group flex-nowrap">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="addon-wrapping">
                    Phone number
                  </span>
                </div>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formik.values.phoneNumber}
                  type="text"
                  className="form-control detail-user-input"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lower-form">
        <p className="form-title">Project information</p>
        <div className="row mt-3">
          <div className="col-6">
            <div className="input-group">
              <div style={{ display: "flex" }}>
                <p className="project-info-title">Username:</p>
                {userDetail !== null ? (
                  <p className="project-info-value">{userDetail.userName}</p>
                ) : (
                  <p></p>
                )}
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="input-group">
              <div style={{ display: "flex" }}>
                <p className="project-info-title">Role:</p>
                {userDetail !== null ? (
                  <p className="project-info-value">{userDetail.role}</p>
                ) : (
                  <p></p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3">
          {userDetail !== null && userDetail.role === "Product Owner" ? (
            // Table for Product Owner
            <table className="table table-striped mt-3">
              <thead className="detail-project-table-heading white-text">
                <tr>
                  <th scope="col">Project code</th>
                  <th scope="col">Project name</th>
                  <th scope="col">Start date</th>
                  <th scope="col">End date</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {advisedProject.map((project) => (
                  <tr>
                    <td>{project.projectCode}</td>
                    <td>{project.name}</td>
                    <td>{project.startedDate}</td>
                    <td>{project.endedDate}</td>
                    <td
                      className={`${
                        project.status === "Active"
                          ? "detail-user-table-status-active"
                          : "detail-user-table-status-complete"
                      }`}
                    >
                      {project.status}
                    </td>
                    <td className="text-center">
                      <i
                        className="fa-solid fa-circle-exclamation fa-lg user-detail-button"
                        onClick={() => navigate(`/projects/${project.id}`)}
                      ></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : userDetail !== null && userDetail.role !== "Product Owner" ? (
            // Table for Scrum Master and Developer
            <table className="table table-striped mt-3">
              <thead className="detail-project-table-heading white-text">
                <tr>
                  <th scope="col">Project code</th>
                  <th scope="col">Project name</th>
                  <th scope="col">Advisor</th>
                  <th scope="col">Start date</th>
                  <th scope="col">End date</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {participatedProject.map((project) => (
                  <tr>
                    <td>{project.projectCode}</td>
                    <td>{project.name}</td>
                    <td>{project.advisorName}</td>
                    <td>{project.startedDate}</td>
                    <td>{project.endedDate}</td>
                    <td
                      className={`${
                        project.status === "Active"
                          ? "detail-user-table-status-active"
                          : "detail-user-table-status-complete"
                      }`}
                    >
                      {project.status}
                    </td>
                    <td className="text-center">
                      <i
                        className="fa-solid fa-circle-exclamation fa-lg user-detail-button"
                        onClick={() => navigate(`/users/${project.id}`)}
                      ></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailUser;
