import React, { useRef, useState, useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import assignmentService from "../../../services/assignmentService";
import * as yup from "yup";
import moment from "moment";

import ModalDeveloper from "./Developer/ModalDeveloper";

import "./index.css";

const CreateAssignment = () => {
  const navigate = useNavigate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [formState, setFormState] = useState(true);
  const [newCategoryError, setNewCategoryError] = useState([]);
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
  const newCategoryNameRef = useRef();

  const [isModalDeveloperVisible, setIsModalDeveloperVisible] = useState(false);
  const [selectedDeveloper, setSelectedDeveloper] = useState("");
  const [developerId, setDeveloperId] = useState(null);
  const [developerError, setDeveloperError] = useState(false);

  // Get project duration months
  function getDuration(startDate, endDate) {
    let start = new Date(startDate);
    let end = new Date(endDate);
    let year = end.getFullYear() - start.getFullYear();
    let month = end.getMonth() - start.getMonth();
    if (year > 0) month += 12 * year;
    return month;
  }

  // Set scrum master name and id when selected
  const handleSelectedDeveloper = (infoDeveloper) => {
    const { fullName } = infoDeveloper;
    const { id } = infoDeveloper;
    setSelectedDeveloper(fullName);
    setDeveloperId(id);
  };

  // Handle cancel modal
  const handleCancel = () => {
    setIsModalDeveloperVisible(false);
  };

  // Fetch categories
  const fetchData = () => {
    assignmentService.getCategories().then((result) => {
      setCategories(result.data);
    });
    assignmentService.getSprints().then((result) => {
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
      startedDate: "",
      endedDate: "",
      developerId: "",
    },
    validationSchema: yup.object({
      // Name validation
      name: yup
        .string()
        .required("Assignment name is required")
        .matches(
          /^[a-zA-Z0-9 ]*$/,
          "Assignment name should not contain special characters"
        )
        .min(10, "Assignment name should be more than 10 characters")
        .max(200, "Assignment name should be less than 200 characters"),

      // Description validation
      description: yup
        .string()
        .required("Assignment description is required")
        .max(500, "Assignment description should be less than 500 characters"),

      // Point validation
      point: yup.string().required("User point is required"),

      // Start date validation
      startedDate: yup.date().required("Start date is required"),

      // End date validation
      endedDate: yup.date().required("End date is required"),
    }),
    onSubmit: (data) => {
      if (categoryId !== null && sprintId !== null && developerId !== null) {
        data.developerId = developerId;
        data.categoryId = categoryId;
        data.sprintId = sprintId;
        assignmentService
          .create(data)
          .then((response) => {
            navigate("/assignments");
            alert("Assignment created successfully!");
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        if (categoryId === null) setCategoryError(true);
        if (sprintId === null) setSprintError(true);
        if (developerId === null) setDeveloperError(true);
      }
    },
  });

  // Add new category click
  const onAddNewCategoryClick = () => {
    setFormState((current) => !current);
    setNewCategoryError([]);
  };

  // New category submit
  const onNewCategorySubmit = () => {
    let checkName = true;
    const data = { name: newCategoryNameRef.current.value };
    const uppercaseRegExp = /(?=.*[A-Z])/;
    const uppercaseName = uppercaseRegExp.test(data.name);
    setNewCategoryError([]);

    categories.map((category) => {
      if (data.name === category.categoryName) checkName = false;
    });
    if (checkName && uppercaseName) {
      setFormState((current) => !current);
      assignmentService.createCategory(data).then((result) => {
        fetchData();
      });
    } else {
      if (!checkName)
        setNewCategoryError((error) => [
          ...error,
          "Category is already existed",
        ]);
      if (!uppercaseName)
        setNewCategoryError((error) => [
          ...error,
          "Category name must have at least 1 uppercase",
        ]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="create-assignment">
      <p className="header-assignment-list">Create new assignment</p>
      <form onSubmit={formik.handleSubmit}>
        <div className="row">
          <div className="col-7">
            <div className="upper-form">
              <p className="form-title">Assignment information</p>
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
                        <li
                          className="dropdown-item-bottom"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <div
                            className="dropdown-item add-new-category"
                            hidden={!formState}
                            onClick={onAddNewCategoryClick}
                          >
                            Add new category
                          </div>
                          <div
                            className="add-new-category-form"
                            hidden={formState}
                          >
                            <input
                              name="new-category-name"
                              className="name"
                              type="text"
                              placeholder="New category name"
                              ref={newCategoryNameRef}
                            />
                            <div
                              className="submit-button"
                              onClick={onNewCategorySubmit}
                            >
                              <i className="fa-solid fa-check"></i>
                            </div>
                            <div
                              className="cancel-button"
                              onClick={onAddNewCategoryClick}
                            >
                              <i className="fa-solid fa-xmark"></i>
                            </div>
                          </div>
                          <div>
                            <ul
                              style={{ listStyle: "none", paddingLeft: "1rem" }}
                            >
                              {newCategoryError.map((errors) => (
                                <li className="add-new-category-error">
                                  {errors}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </li>
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
              className="assignment-mock-up-picture"
            />
          </div>
        </div>
        <div className="lower-form">
          <p className="form-title">Assign User</p>

          {/* Developer selection */}
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
            {developerError ? (
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
            )}
          </div>
        </div>
        <div className="create-project-button-group">
          <button type="submit" className="btn btn-confirm-scrum-master">
            Submit
          </button>
          <button
            type="submit"
            className="btn btn-cancel"
            onClick={() => {
              navigate("/assignments");
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
    </div>
  );
};

export default CreateAssignment;
