import React, { useRef, useState, useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import sprintService from "../../../services/sprintService";
import * as yup from "yup";
import moment from "moment";

import "./index.css";

const UpdateSprint = (props) => {
  const { id } = useParams();
  const userId = props.user.id;
  const navigate = useNavigate();
  const [projectId, setProjectId] = useState(null);
  const [sprintStartedDate, setSprintStartedDate] = useState(new Date());
  const [sprintEndedDate, setSprintEndedDate] = useState(new Date());
  const startDate = useRef(null);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get data
  const fetchData = (userId, id) => {
    sprintService.sprintDetail(userId).then((response) => {
      console.log(response.data);
      setProjectId(response.data.id);
      setSprintEndedDate(response.data.project.endedDate);
    });
    sprintService.getUpdateDetail(id).then((response) => {
      console.log(response.data);
      setSprintStartedDate(response.data.startedDate);
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
    });
  };

  // Get project duration months
  function getDuration(startDate, endDate) {
    let start = new Date(startDate);
    let end = new Date(endDate);
    let year = end.getFullYear() - start.getFullYear();
    let month = end.getMonth() - start.getMonth();
    let date = end.getDate() - start.getDate();
    if (year > 0) {
      date += 365 * year;
      if (month > 0) date += 30 * month;
    }
    return date;
  }

  const formik = useFormik({
    initialValues: {
      id: id,
      name: "",
      description: "",
      startedDate: moment(today).format("YYYY-MM-DD"),
      endedDate: moment(today).format("YYYY-MM-DD"),
    },
    validationSchema: yup.object({
      // Name validation
      name: yup
        .string()
        .required("Sprint name is required")
        .matches(
          /^[a-zA-Z0-9 ]*$/,
          "Sprint name should not contain special characters"
        )
        .min(5, "Sprint name should be more than 5 characters")
        .max(50, "Sprint name should be less than 50 characters"),

      // Description validation
      description: yup
        .string()
        .required("Sprint description is required")
        .max(500, "Sprint description should be less than 500 characters"),

      // Start date validation
      startedDate: yup.date().required("Start date is required"),

      // End date validation
      endedDate: yup
        .date()
        .required("End date is required")
        .min(today, "End date is only current or future date")
        .test(
          "endedDate",
          "Sprint duration should be more than 1 week",
          (value) => {
            return getDuration(startDate.current.value, value) >= 7;
          }
        )
        .test(
          "endedDate",
          "Sprint duration should be less than 1 month",
          (value) => {
            return getDuration(startDate.current.value, value) <= 30;
          }
        ),
    }),
    onSubmit: (data) => {
      sprintService
        .update(id, data)
        .then((response) => {
          navigate("/sprints");
        })
        .catch((e) => {
          console.log(e);
        });
    },
  });

  useEffect(() => {
    fetchData(userId, id);
  }, [userId]);

  return (
    <div className="create-sprint">
      <p className="header-sprint-list">Create new sprint</p>
      <form onSubmit={formik.handleSubmit}>
        <div className="upper-form">
          <p className="form-title">Sprint information</p>
          <div className="mt-3">
            <div className="input-group flex-nowrap">
              <div className="input-group-prepend">
                <span className="input-group-text" id="addon-wrapping">
                  Sprint name
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
                style={{ marginLeft: "7.2rem" }}
              >
                {formik.errors.name}
              </p>
            )}
          </div>
          <div className="mt-3">
            <div className="input-group flex-nowrap">
              <div className="input-group-prepend">
                <span className="input-group-text" id="addon-wrapping">
                  Sprint description
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
                  min={moment(sprintStartedDate).format("YYYY-MM-DD")}
                  max={moment(sprintEndedDate).format("YYYY-MM-DD")}
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
                  style={{ marginLeft: "6.2rem" }}
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
                  min={moment(sprintStartedDate).format("YYYY-MM-DD")}
                  max={moment(sprintEndedDate).format("YYYY-MM-DD")}
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
        <div className="create-sprint-button-group">
          <button type="submit" className="btn btn-confirm-scrum-master">
            Submit
          </button>
          <button
            type="submit"
            className="btn btn-cancel"
            onClick={() => {
              navigate("/sprints");
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateSprint;
