import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import problemService from "../../../services/problemService";
import moment from "moment";

import "./index.css";

const DetailProblem = (props) => {
  const role = props.user.role[0];
  const { id } = useParams();
  const navigate = useNavigate();
  const [problemDetail, setProblemDetail] = useState(null);
  const [categoryValue, setCategoryValue] = useState("");
  const [sprintValue, setSprintValue] = useState("");
  const [selectedDeveloper, setSelectedDeveloper] = useState("");

  // Fetch categories
  const fetchData = () => {
    problemService.detail(id).then((result) => {
      result.data.status =
        result.data.status === "Todo"
          ? "To do"
          : result.data.status === "InProgress"
          ? "In Progress"
          : result.data.status === "InReview"
          ? "In Review"
          : result.data.status;
      formik.setFieldValue("name", result.data.name);
      formik.setFieldValue("status", result.data.status);
      formik.setFieldValue("description", result.data.description);
      formik.setFieldValue("point", result.data.point);
      formik.setFieldValue(
        "startedDate",
        moment(result.data.startedDate).format("YYYY-MM-DD")
      );
      formik.setFieldValue(
        "endedDate",
        moment(result.data.endedDate).format("YYYY-MM-DD")
      );
      setCategoryValue(result.data.category);
      setSprintValue(result.data.sprintName);
      setProblemDetail(result.data);
    });
  };

  const formik = useFormik({
    initialValues: {
      id: id,
      name: "",
      status: "",
      description: "",
      point: "",
      categoryId: "",
      sprintId: "",
      startedDate: "",
      endedDate: "",
      developerId: "",
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="create-problem">
      <p className="header-problem-list">Update problem</p>
      <div className="row">
        <div className="col-7">
          <div className="upper-form">
            <p className="form-title">Problem information</p>
            <div className="row mt-3">
              <div className="col-7">
                <div className="input-group flex-nowrap">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="addon-wrapping">
                      Name
                    </span>
                  </div>
                  <input
                    id="name"
                    name="name"
                    value={formik.values.name}
                    type="text"
                    className="form-control detail-problem-input"
                    readOnly
                  />
                </div>
              </div>
              <div className="col-5">
                <div className="input-group flex-nowrap">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="addon-wrapping">
                      Status
                    </span>
                  </div>
                  <input
                    id="status"
                    name="status"
                    value={formik.values.status}
                    className={`form-control detail-problem-input ${
                      formik.values.status === "Pending"
                        ? "status-waiting"
                        : formik.values.status === "To do"
                        ? "status-todo"
                        : formik.values.status === "In Progress"
                        ? "status-progress"
                        : formik.values.status === "In Review"
                        ? "status-review"
                        : "status-complete"
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
                    Description
                  </span>
                </div>
                <textarea
                  rows="5"
                  id="description"
                  name="description"
                  value={formik.values.description}
                  className="form-control detail-problem-input"
                  readOnly
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-5">
                <div className="input-group flex-nowrap">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="addon-wrapping">
                      User point
                    </span>
                  </div>
                  <input
                    id="point"
                    name="point"
                    value={formik.values.point}
                    className="form-control detail-problem-input"
                    readOnly
                  />
                </div>
              </div>
              <div className="col-7">
                <div className="input-group flex-nowrap">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="addon-wrapping">
                      Category
                    </span>
                  </div>
                  <div style={{ width: "100%" }}>
                    <div
                      className="h-100 create-category-dropdown form-control detail-problem-input"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <p>{categoryValue}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lower-form">
            <p className="form-title">Sprint information</p>
            <div className="mt-3">
              <div className="input-group flex-nowrap">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="addon-wrapping">
                    Sprint
                  </span>
                </div>
                <div style={{ width: "100%" }}>
                  <div
                    className="h-100 create-category-dropdown form-control detail-problem-input"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <p>{sprintValue}</p>
                  </div>
                </div>
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
                    value={formik.values.startedDate}
                    type="date"
                    className="form-control detail-problem-input"
                    aria-label="StartedDate"
                    aria-describedby="addon-wrapping"
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
                    value={formik.values.endedDate}
                    type="date"
                    className="form-control detail-problem-input"
                    aria-label="EndedDate"
                    aria-describedby="addon-wrapping"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-5 mt-3">
          <img
            src="https://leaveitwithme.com.au/wp-content/uploads/2013/11/dummy-image-square.jpg"
            alt="dummy"
            className="problem-mock-up-picture"
          />
        </div>
      </div>
      <div className="lower-form">
        <p className="form-title">Assign User & Assignment</p>
        <table className="table table-striped mt-3">
          <thead
            className={`white-text ${
              role === "Advisor"
                ? "detail-problem-table-heading-advisor"
                : role === "ScrumMaster"
                ? "detail-problem-table-heading-scrum-master"
                : "detail-problem-table-heading-developer"
            }`}
          >
            <tr>
              <th scope="col">User Code</th>
              <th scope="col">Full name</th>
              <th scope="col">Username</th>
              <th scope="col">Role</th>
              <th scope="col" className="text-center">
                Action
              </th>
            </tr>
          </thead>
          {problemDetail === null ? (
            <tbody></tbody>
          ) : (
            <tbody>
              <tr>
                <td>{problemDetail.developer.userCode}</td>
                <td>{problemDetail.developer.fullName}</td>
                <td>{problemDetail.developer.userName}</td>
                <td>
                  {problemDetail.developer.role === "ScrumMaster"
                    ? "Scrum Master"
                    : problemDetail.developer.role}
                </td>
                <td className="text-center">
                  <i
                    className="fa-solid fa-circle-exclamation fa-lg detail-button"
                    onClick={() =>
                      navigate(`/users/${problemDetail.developer.id}`)
                    }
                  ></i>
                </td>
              </tr>
            </tbody>
          )}
        </table>
        <table className="table table-striped mt-3">
          <thead
            className={`white-text ${
              role === "Advisor"
                ? "detail-problem-table-heading-advisor"
                : role === "ScrumMaster"
                ? "detail-problem-table-heading-scrum-master"
                : "detail-problem-table-heading-developer"
            }`}
          >
            <tr>
              <th scope="col">Assignment Code</th>
              <th scope="col">Assignment Name</th>
              <th scope="col">Category</th>
              <th scope="col">Status</th>
              <th scope="col" className="text-center">
                Action
              </th>
            </tr>
          </thead>
          {problemDetail === null ? (
            <tbody></tbody>
          ) : (
            <tbody>
              <tr>
                <td>{problemDetail.assignment.assignmentCode}</td>
                <td>{problemDetail.assignment.name}</td>
                <td>{problemDetail.assignment.category}</td>
                <td
                  style={{ fontWeight: "bold" }}
                  className={`${
                    problemDetail.assignment.status === "Pending"
                      ? "status-waiting"
                      : problemDetail.assignment.status === "To do"
                      ? "status-todo"
                      : problemDetail.assignment.status === "In Progress"
                      ? "status-progress"
                      : problemDetail.assignment.status === "In Review"
                      ? "status-review"
                      : "status-complete"
                  }`}
                >
                  {problemDetail.assignment.status === "Todo"
                    ? "Todo"
                    : problemDetail.assignment.status === "InProgress"
                    ? "In Progress"
                    : problemDetail.assignment.status === "InReview"
                    ? "In Review"
                    : problemDetail.assignment.status}
                </td>
                <td className="text-center">
                  <i
                    className="fa-solid fa-circle-exclamation fa-lg detail-button"
                    onClick={() =>
                      navigate(`/assignments/${problemDetail.assignment.id}`)
                    }
                  ></i>
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default DetailProblem;
