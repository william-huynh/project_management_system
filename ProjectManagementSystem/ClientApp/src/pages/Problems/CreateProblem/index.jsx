import React, { useRef, useState, useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import problemService from "../../../services/problemService";
import * as yup from "yup";
import moment from "moment";

import ModalDeveloper from "./Developer/ModalDeveloper";
import ModalAssignment from "./Assignment/ModalAssignment";
import "./index.css";

const CreateProblem = (props) => {
  const role = props.user.role[0];
  const userId = props.user.id;
  const navigate = useNavigate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [categoryValue, setCategoryValue] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const [categoryError, setCategoryError] = useState(false);
  const [categories, setCategories] = useState([]);
  const [sprintValue, setSprintValue] = useState("");
  const [sprintId, setSprintId] = useState(null);
  const [sprintError, setSprintError] = useState(false);
  const [sprints, setSprints] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [isModalDeveloperVisible, setIsModalDeveloperVisible] = useState(false);
  const [selectedDeveloper, setSelectedDeveloper] = useState("");
  const [developerId, setDeveloperId] = useState(null);
  const [isModalAssignmentVisible, setIsModalAssignmentVisible] =
    useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [assignmentId, setAssignmentId] = useState(null);
  const [assignmentError, setAssignmentError] = useState(false);

  // Set developer name and id when selected
  const handleSelectedDeveloper = (infoDeveloper) => {
    const { fullName } = infoDeveloper;
    const { id } = infoDeveloper;
    setSelectedDeveloper(fullName);
    setDeveloperId(id);
  };

  // Set assignment name and id when selected
  const handleSelectedAssignment = (infoAssignment) => {
    const { name } = infoAssignment;
    const { id } = infoAssignment;
    setSelectedAssignment(name);
    setAssignmentId(id);
  };

  // Handle cancel modal
  const handleCancel = () => {
    setIsModalDeveloperVisible(false);
    setIsModalAssignmentVisible(false);
  };

  // Fetch data
  const fetchData = () => {
    problemService.getCategories(userId).then((result) => {
      setCategories(result.data);
    });
    problemService.getSprints(userId).then((result) => {
      setSprints(result.data);
    });
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      point: "",
      categoryId: "",
      sprintId: "",
      assignmentId: "",
      startedDate: "",
      endedDate: "",
      developerId: "",
    },
    validationSchema: yup.object({
      // Name validation
      name: yup
        .string()
        .required("Problem name is required")
        .matches(
          /^[a-zA-Z0-9 ]*$/,
          "Problem name should not contain special characters"
        )
        .min(10, "Problem name should be more than 10 characters")
        .max(200, "Problem name should be less than 200 characters"),

      // Description validation
      description: yup
        .string()
        .required("Problem description is required")
        .max(500, "Problem description should be less than 500 characters"),

      // Point validation
      point: yup.string().required("User point is required"),

      // Start date validation
      startedDate: yup.date().required("Start date is required"),

      // End date validation
      endedDate: yup.date().required("End date is required"),
    }),
    onSubmit: (data) => {
      if (assignmentId !== null && categoryId !== null && sprintId !== null) {
        data.assignmentId = assignmentId;
        data.developerId = developerId;
        data.categoryId = categoryId;
        data.sprintId = sprintId;
        problemService
          .create(data)
          .then((response) => {
            navigate("/problems");
            alert("Problem created successfully!");
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        if (assignmentId === null) setAssignmentError(true);
        if (categoryId === null) setCategoryError(true);
        if (sprintId === null) setSprintError(true);
      }
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="create-problem">
      <p
        className={`header-problem-create ${
          role === "Advisor"
            ? "text-advisor"
            : role === "ScrumMaster"
            ? "text-scrum-master"
            : "text-developer"
        }`}
      >
        Create new problem
      </p>
      <form onSubmit={formik.handleSubmit}>
        <div className="row">
          <div className="col-7">
            <div className="upper-form">
              <p
                className={`form-title ${
                  role === "Advisor"
                    ? "text-advisor"
                    : role === "ScrumMaster"
                    ? "text-scrum-master"
                    : "text-developer"
                }`}
              >
                Problem information
              </p>
              <div className="mt-3">
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
                    onChange={formik.handleChange}
                    type="text"
                    className={`form-control ${
                      formik.errors.name && formik.touched.name === true
                        ? "is-invalid"
                        : ""
                    }`}
                    aria-label="name"
                    aria-describedby="addon-wrapping"
                  />
                </div>
                {formik.errors.name && formik.touched.name && (
                  <p
                    className="text-danger mb-0 font-weight-normal"
                    style={{ marginLeft: "4.4rem" }}
                  >
                    {formik.errors.name}
                  </p>
                )}
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
                    onChange={formik.handleChange}
                    className={`form-control ${
                      formik.errors.description &&
                      formik.touched.description === true
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                </div>
                {formik.errors.description && formik.touched.description && (
                  <p
                    className="text-danger mb-0 font-weight-normal"
                    style={{ marginLeft: "6.8rem" }}
                  >
                    {formik.errors.description}
                  </p>
                )}
              </div>
              <div className="row mt-3">
                <div className="col-5">
                  <div className="input-group flex-nowrap">
                    <div className="input-group-prepend">
                      <span className="input-group-text" id="addon-wrapping">
                        User point
                      </span>
                    </div>
                    <select
                      id="point"
                      name="point"
                      value={formik.values.point}
                      onChange={formik.handleChange}
                      type="number"
                      className={`form-control ${
                        formik.errors.point && formik.touched.point === true
                          ? "is-invalid"
                          : ""
                      }`}
                      aria-label="name"
                      aria-describedby="addon-wrapping"
                    >
                      <option defaultValue></option>
                      <option value="3">3</option>
                      <option value="5">5</option>
                      <option value="8">8</option>
                    </select>
                  </div>
                  {formik.errors.point && formik.touched.point && (
                    <p
                      className="text-danger mb-0 font-weight-normal"
                      style={{ marginLeft: "6.4rem" }}
                    >
                      {formik.errors.point}
                    </p>
                  )}
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
                        className="h-100 create-category-dropdown form-control"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <p>
                          {categoryValue !== ""
                            ? categoryValue
                            : "Select category"}
                        </p>
                        <div className="d-flex align-items-center">
                          <i className="fa-solid fa-sort-down"></i>
                        </div>
                      </div>
                      <ul className="dropdown-menu">
                        {categories.map((category) => (
                          <li>
                            <div
                              className="dropdown-item"
                              onClick={() => {
                                setCategoryValue(category.name);
                                setCategoryId(category.id);
                              }}
                            >
                              {category.name}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {categoryError ? (
                    <p
                      className="text-danger mb-0"
                      style={{
                        fontWeight: "normal",
                        marginLeft: "6rem",
                      }}
                    >
                      Category is required
                    </p>
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>
            </div>
            <div
              className={`lower-form ${
                role === "Advisor"
                  ? "text-advisor"
                  : role === "ScrumMaster"
                  ? "text-scrum-master"
                  : "text-developer"
              }`}
            >
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
                      className="h-100 create-category-dropdown form-control"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <p>
                        {sprintValue !== "" ? sprintValue : "Select sprint"}
                      </p>
                      <div className="d-flex align-items-center">
                        <i className="fa-solid fa-sort-down"></i>
                      </div>
                    </div>
                    <ul className="dropdown-menu" style={{ width: "94%" }}>
                      {sprints.map((sprint) => (
                        <li>
                          <div
                            className="dropdown-item"
                            onClick={() => {
                              setSprintValue(sprint.name);
                              setSprintId(sprint.id);
                              setStartDate(sprint.startedDate);
                              setEndDate(sprint.endedDate);
                            }}
                          >
                            {sprint.name}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {sprintError ? (
                  <p className="text-danger mb-0">Sprint is required</p>
                ) : (
                  <div></div>
                )}
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
                      onChange={formik.handleChange}
                      type="date"
                      min={moment(startDate).format("YYYY-MM-DD")}
                      max={moment(endDate).format("YYYY-MM-DD")}
                      className={`form-control ${
                        formik.errors.startedDate &&
                        formik.touched.startedDate === true
                          ? "is-invalid"
                          : ""
                      }`}
                      aria-label="StartedDate"
                      aria-describedby="addon-wrapping"
                    />
                  </div>
                  {formik.errors.startedDate && formik.touched.startedDate && (
                    <p
                      className="text-danger mb-0 font-weight-normal"
                      style={{ marginLeft: "6rem" }}
                    >
                      {formik.errors.startedDate}
                    </p>
                  )}
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
                      onChange={formik.handleChange}
                      type="date"
                      min={moment(startDate).format("YYYY-MM-DD")}
                      max={moment(endDate).format("YYYY-MM-DD")}
                      className={`form-control ${
                        formik.errors.endedDate &&
                        formik.touched.endedDate === true
                          ? "is-invalid"
                          : ""
                      }`}
                      aria-label="EndedDate"
                      aria-describedby="addon-wrapping"
                    />
                  </div>
                  {formik.errors.endedDate && formik.touched.endedDate && (
                    <p
                      className="text-danger mb-0 font-weight-normal"
                      style={{ marginLeft: "5.8rem" }}
                    >
                      {formik.errors.endedDate}
                    </p>
                  )}
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
        <div
          className={`lower-form ${
            role === "Advisor"
              ? "text-advisor"
              : role === "ScrumMaster"
              ? "text-scrum-master"
              : "text-developer"
          }`}
        >
          {role === "Developer" ? (
            <p className="form-title">Assign Assignment</p>
          ) : (
            <p className="form-title">Assign User & Assignment</p>
          )}

          {/* Developer selection */}
          {role === "Developer" ? (
            <div></div>
          ) : (
            <div>
              <div className="input-group flex-nowrap mt-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="addon-wrapping">
                    Developer
                  </span>
                </div>
                <input
                  type="text"
                  className="form-control"
                  style={{ borderRight: "none" }}
                  aria-label="Developer select"
                  aria-describedby="scrumMasterSelect"
                  value={selectedDeveloper}
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-md px-3 py-2 z-depth-0 btn-search-scrum-master"
                    type="button"
                    onClick={() => setIsModalDeveloperVisible(true)}
                  >
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </button>
                </div>
              </div>
              {/* {developerError ? (
                <p
                  className="text-danger mb-0"
                  style={{
                    fontWeight: "normal",
                    marginLeft: "6.4rem",
                  }}
                >
                  Assigned developer is required
                </p>
              ) : (
                <div></div>
              )} */}
            </div>
          )}

          {/* Assignment selection */}
          <div>
            <div className="input-group flex-nowrap mt-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="addon-wrapping">
                  Assignment
                </span>
              </div>
              <input
                type="text"
                className="form-control"
                style={{ borderRight: "none" }}
                aria-label="Assignment select"
                aria-describedby="assignmentSelect"
                value={selectedAssignment}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-md px-3 py-2 z-depth-0 btn-search-scrum-master"
                  type="button"
                  onClick={() => setIsModalAssignmentVisible(true)}
                >
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              </div>
            </div>
            {assignmentError ? (
              <p
                className="text-danger mb-0"
                style={{
                  fontWeight: "normal",
                  marginLeft: "6.4rem",
                }}
              >
                Assigned assignment is required
              </p>
            ) : (
              <div></div>
            )}
          </div>
        </div>

        <div className="create-project-button-group">
          <button
            type="submit"
            className={`btn ${
              role === "ScrumMaster"
                ? "btn-confirm-scrum-master"
                : "btn-confirm-developer"
            }`}
          >
            Submit
          </button>
          <button
            type="submit"
            className="btn btn-cancel"
            onClick={() => {
              navigate("/problems");
            }}
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Developer selection modal */}
      <ModalDeveloper
        visible={isModalDeveloperVisible}
        selectedDeveloper={handleSelectedDeveloper}
        handleCancel={handleCancel}
      />

      {/* Assignment selection modal */}
      <ModalAssignment
        visible={isModalAssignmentVisible}
        selectedAssignment={handleSelectedAssignment}
        handleCancel={handleCancel}
      />
    </div>
  );
};

export default CreateProblem;
