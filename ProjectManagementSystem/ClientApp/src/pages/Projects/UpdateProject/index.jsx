import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import projectService from "../../../services/projectService";
import * as yup from "yup";
import moment from "moment";

import ModalScrumMaster from "../CreateProject/ScrumMaster/ModalScrumMaster";
import ModalDeveloper1 from "../CreateProject/Developer1/ModalDeveloper1";
import ModalDeveloper2 from "../CreateProject/Developer2/ModalDeveloper2";
import ModalDeveloper3 from "../CreateProject/Developer3/ModalDeveloper3";
import ModalDeveloper4 from "../CreateProject/Developer4/ModalDeveloper4";

const UpdateProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const startDate = useRef(null);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [isModalScrumMasterVisible, setIsModalScrumMasterVisible] =
    useState(false);
  const [selectedScrumMaster, setSelectedScrumMaster] = useState("");
  const [scrumMasterId, setScrumMasterId] = useState("");
  const [isModalDeveloper1Visible, setIsModalDeveloper1Visible] =
    useState(false);
  const [selectedDeveloper1, setSelectedDeveloper1] = useState("");
  const [developer1Id, setDeveloper1Id] = useState("");
  const [isModalDeveloper2Visible, setIsModalDeveloper2Visible] =
    useState(false);
  const [selectedDeveloper2, setSelectedDeveloper2] = useState("");
  const [developer2Id, setDeveloper2Id] = useState("");
  const [isModalDeveloper3Visible, setIsModalDeveloper3Visible] =
    useState(false);
  const [selectedDeveloper3, setSelectedDeveloper3] = useState("");
  const [developer3Id, setDeveloper3Id] = useState("");
  const [isModalDeveloper4Visible, setIsModalDeveloper4Visible] =
    useState(false);
  const [selectedDeveloper4, setSelectedDeveloper4] = useState("");
  const [developer4Id, setDeveloper4Id] = useState("");

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
  const handleSelectedScrumMaster = (infoScrumMaster) => {
    const { fullName } = infoScrumMaster;
    const { id } = infoScrumMaster;
    setSelectedScrumMaster(fullName);
    setScrumMasterId(id);
  };

  // Set developer 1 name and id when selected
  const handleSelectedDeveloper1 = (infoDeveloper) => {
    const { fullName } = infoDeveloper;
    const { id } = infoDeveloper;
    setSelectedDeveloper1(fullName);
    setDeveloper1Id(id);
  };

  // Set developer 2 name and id when selected
  const handleSelectedDeveloper2 = (infoDeveloper) => {
    const { fullName } = infoDeveloper;
    const { id } = infoDeveloper;
    setSelectedDeveloper2(fullName);
    setDeveloper2Id(id);
  };

  // Set developer 3 name and id when selected
  const handleSelectedDeveloper3 = (infoDeveloper) => {
    const { fullName } = infoDeveloper;
    const { id } = infoDeveloper;
    setSelectedDeveloper3(fullName);
    setDeveloper3Id(id);
  };

  // Set developer 4 name and id when selected
  const handleSelectedDeveloper4 = (infoDeveloper) => {
    const { fullName } = infoDeveloper;
    const { id } = infoDeveloper;
    setSelectedDeveloper4(fullName);
    setDeveloper4Id(id);
  };

  // Handle cancel modal
  const handleCancel = () => {
    setIsModalScrumMasterVisible(false);
    setIsModalDeveloper1Visible(false);
    setIsModalDeveloper2Visible(false);
    setIsModalDeveloper3Visible(false);
    setIsModalDeveloper4Visible(false);
  };

  // Get project detail
  const getProject = (id) => {
    projectService
      .getUpdateDetail(id)
      .then((response) => {
        console.log(response);
        formik.setFieldValue("name", response.data.name);
        formik.setFieldValue("description", response.data.description);
        formik.setFieldValue(
          "startedDate",
          moment(response.data.startedDate).format("YYYY-MM-DD")
        );
        formik.setFieldValue(
          "endedDate",
          moment(response.data.endedDate).format("YYYY-MM-DD")
        );
        setSelectedScrumMaster(response.data.scrumMasterName);
        setScrumMasterId(response.data.scrumMasterId);
        if (response.data.developers[0] != null) {
          setSelectedDeveloper1(response.data.developers[0].fullName);
          setDeveloper1Id(response.data.developers[0].id);
        }
        if (response.data.developers[1] != null) {
          setSelectedDeveloper2(response.data.developers[1].fullName);
          setDeveloper2Id(response.data.developers[1].id);
        }
        if (response.data.developers[2] != null) {
          setSelectedDeveloper3(response.data.developers[2].fullName);
          setDeveloper3Id(response.data.developers[2].id);
        }
        if (response.data.developers[3] != null) {
          setSelectedDeveloper4(response.data.developers[3].fullName);
          setDeveloper4Id(response.data.developers[3].id);
        }
      })
      .catch((event) => console.log(event));
  };

  const formik = useFormik({
    initialValues: {
      id: id,
      name: "",
      description: "",
      startedDate: moment(today).format("YYYY-MM-DD"),
      endedDate: moment(today).format("YYYY-MM-DD"),
      scrumMasterId: "",
      developer1Id: "",
      developer2Id: "",
      developer3Id: "",
      developer4Id: "",
    },
    validationSchema: yup.object({
      // Name validation
      name: yup
        .string()
        .required("Project name is required")
        .matches(
          /^[a-zA-Z ]*$/,
          "Project name should not contain number or special characters"
        )
        .min(10, "Project name should be more than 10 characters")
        .max(50, "Project name should be less than 50 characters"),

      // Description validation
      description: yup
        .string()
        .required("Project description is required")
        .max(500, "Project description should be less than 500 characters"),

      // Start date validation
      startedDate: yup.date().required("Start date is required"),

      // End date validation
      endedDate: yup
        .date()
        .required("End date is required")
        .test({
          name: "projectSmaller",
          exclusive: false,
          params: {},
          message: "Project duration should be more than 3 months",
          test: function (value) {
            return getDuration(startDate.current.value, value) >= 3;
          },
        })
        .test({
          name: "projectLarger",
          exclusive: false,
          params: {},
          message: "Project duration should be less than 6 months",
          test: function (value) {
            return getDuration(startDate.current.value, value) <= 6;
          },
        }),
    }),
    onSubmit: (data) => {
      data.scrumMasterId = scrumMasterId;
      data.developer1Id = developer1Id;
      data.developer2Id = developer2Id;
      data.developer3Id = developer3Id;
      data.developer4Id = developer4Id;
      projectService
        .update(id, data)
        .then((response) => {
          getProject(id);
          alert("Project updated successfully!");
        })
        .catch((e) => {
          console.log(e);
        });
    },
  });

  useEffect(() => {
    getProject(id);
  }, [id]);

  return (
    <div className="create-project">
      <p className="header-project-list">Create new project</p>
      <form onSubmit={formik.handleSubmit} className="create-project-form">
        <div className="upper-form">
          <p className="form-title">Project information</p>
          <div className="mt-3">
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
                style={{ marginLeft: "7.6rem" }}
              >
                {formik.errors.name}
              </p>
            )}
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
                style={{ marginLeft: "10.2rem" }}
              >
                {formik.errors.description}
              </p>
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
                  ref={startDate}
                  min={moment(formik.values.startedDate).format("YYYY-MM-DD")}
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
                  style={{ marginLeft: "5.5rem" }}
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
                  min={moment(formik.values.endedDate).format("YYYY-MM-DD")}
                  className={`form-control ${
                    formik.errors.endedDate && formik.touched.endedDate === true
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
                  style={{ marginLeft: "5.9rem" }}
                >
                  {formik.errors.endedDate}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="lower-form">
          <p className="form-title">Assign User</p>

          {/* Scrum master selection */}
          <div className="d-flex flex-row mt-3">
            <div className="input-group flex-nowrap">
              <div className="input-group-prepend">
                <span className="input-group-text" id="addon-wrapping">
                  Scrum Master
                </span>
              </div>
              <input
                type="text"
                className="form-control update-project-assign-input"
                style={{ borderRight: "none" }}
                aria-label="Scrum Master select"
                aria-describedby="scrumMasterSelect"
                value={selectedScrumMaster}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-md px-3 py-2 z-depth-0 btn-search-advisor"
                  type="button"
                  onClick={() => setIsModalScrumMasterVisible(true)}
                >
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              </div>
            </div>
            <div className="update-project-remove-user">
              <i
                className="fa-solid fa-xmark fa-xl delete-button"
                onClick={() => {
                  setScrumMasterId("");
                  setSelectedScrumMaster("");
                }}
              ></i>
            </div>
          </div>

          {/* Developer 1 selection */}
          <div className="d-flex flex-row mt-3">
            <div className="input-group flex-nowrap">
              <div className="input-group-prepend">
                <span
                  className="input-group-text"
                  id="addon-wrapping"
                  style={{ width: "7.6rem", justifyContent: "center" }}
                >
                  Developers
                </span>
              </div>
              <input
                type="text"
                className="form-control update-project-assign-input"
                style={{ borderRight: "none" }}
                aria-label="Developer select"
                aria-describedby="developerSelect"
                value={selectedDeveloper1}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-md px-3 py-2 z-depth-0 btn-search-advisor"
                  type="button"
                  onClick={() => setIsModalDeveloper1Visible(true)}
                >
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              </div>
            </div>
            <div className="update-project-remove-user">
              <i
                className="fa-solid fa-xmark fa-xl delete-button"
                onClick={() => {
                  setDeveloper1Id("");
                  setSelectedDeveloper1("");
                }}
              ></i>
            </div>
          </div>

          {/* Developer 2 selection */}
          <div className="d-flex flex-row mt-3">
            <div className="input-group flex-nowrap">
              <div className="input-group-prepend">
                <span
                  id="addon-wrapping"
                  style={{ width: "7.6rem", height: "2.38rem" }}
                ></span>
              </div>
              <input
                type="text"
                className="form-control update-project-assign-input"
                style={{ borderRight: "none" }}
                aria-label="Developer select"
                aria-describedby="developerSelect"
                value={selectedDeveloper2}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-md px-3 py-2 z-depth-0 btn-search-advisor"
                  type="button"
                  onClick={() => setIsModalDeveloper2Visible(true)}
                >
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              </div>
            </div>
            <div className="update-project-remove-user">
              <i
                className="fa-solid fa-xmark fa-xl delete-button"
                onClick={() => {
                  setDeveloper2Id("");
                  setSelectedDeveloper2("");
                }}
              ></i>
            </div>
          </div>

          {/* Developer 3 selection */}
          <div className="d-flex flex-row mt-3">
            <div className="input-group flex-nowrap">
              <div className="input-group-prepend">
                <span
                  id="addon-wrapping"
                  style={{ width: "7.6rem", height: "2.38rem" }}
                ></span>
              </div>
              <input
                type="text"
                className="form-control update-project-assign-input"
                style={{ borderRight: "none" }}
                aria-label="Developer select"
                aria-describedby="developerSelect"
                value={selectedDeveloper3}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-md px-3 py-2 z-depth-0 btn-search-advisor"
                  type="button"
                  onClick={() => setIsModalDeveloper3Visible(true)}
                >
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              </div>
            </div>
            <div className="update-project-remove-user">
              <i
                className="fa-solid fa-xmark fa-xl delete-button"
                onClick={() => {
                  setDeveloper3Id("");
                  setSelectedDeveloper3("");
                }}
              ></i>
            </div>
          </div>

          {/* Developer 4 selection */}
          <div className="d-flex flex-row mt-3">
            <div className="input-group flex-nowrap">
              <div className="input-group-prepend">
                <span
                  id="addon-wrapping"
                  style={{ width: "7.6rem", height: "2.38rem" }}
                ></span>
              </div>
              <input
                type="text"
                className="form-control update-project-assign-input"
                style={{ borderRight: "none" }}
                aria-label="Developer select"
                aria-describedby="developerSelect"
                value={selectedDeveloper4}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-md px-3 py-2 z-depth-0 btn-search-advisor"
                  type="button"
                  onClick={() => setIsModalDeveloper4Visible(true)}
                >
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              </div>
            </div>
            <div className="update-project-remove-user">
              <i
                className="fa-solid fa-xmark fa-xl delete-button"
                onClick={() => {
                  setDeveloper4Id("");
                  setSelectedDeveloper4("");
                }}
              ></i>
            </div>
          </div>
        </div>
        <div className="create-project-button-group">
          <button type="submit" className="btn btn-confirm-advisor">
            Submit
          </button>
          <button
            className="btn btn-cancel"
            onClick={() => {
              navigate("/projects");
            }}
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Scrum master selection modal */}
      <ModalScrumMaster
        visible={isModalScrumMasterVisible}
        selectedScrumMaster={handleSelectedScrumMaster}
        handleCancel={handleCancel}
      />

      {/* Developer 1 selection modal */}
      <ModalDeveloper1
        visible={isModalDeveloper1Visible}
        selectedDeveloper={handleSelectedDeveloper1}
        handleCancel={handleCancel}
        developer2={developer2Id}
        developer3={developer3Id}
        developer4={developer4Id}
        defaultDeveloper={developer1Id}
      />

      {/* Developer 2 selection modal */}
      <ModalDeveloper2
        visible={isModalDeveloper2Visible}
        selectedDeveloper={handleSelectedDeveloper2}
        handleCancel={handleCancel}
        developer1={developer1Id}
        developer3={developer3Id}
        developer4={developer4Id}
        defaultDeveloper={developer2Id}
      />

      {/* Developer 3 selection modal */}
      <ModalDeveloper3
        visible={isModalDeveloper3Visible}
        selectedDeveloper={handleSelectedDeveloper3}
        handleCancel={handleCancel}
        developer1={developer1Id}
        developer2={developer2Id}
        developer4={developer4Id}
        defaultDeveloper={developer3Id}
      />

      {/* Developer 4 selection modal */}
      <ModalDeveloper4
        visible={isModalDeveloper4Visible}
        selectedDeveloper={handleSelectedDeveloper4}
        handleCancel={handleCancel}
        developer1={developer1Id}
        developer2={developer2Id}
        developer3={developer3Id}
        defaultDeveloper={developer4Id}
      />
    </div>
  );
};

export default UpdateProject;
