import React from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import userService from "../../../services/userService";
import * as yup from "yup";

import "./index.css";

const CreateUser = () => {
  const navigate = useNavigate();

  // Get user age with date of birth
  function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      dateOfBirth: "",
      gender: "",
      address: "",
      phoneNumber: "",
      role: "",
    },
    validationSchema: yup.object({
      // First name validation
      firstName: yup
        .string()
        .required("First name is required")
        .matches(
          /^[a-zA-Z ]*$/,
          "First name should not contain number or special characters"
        )
        .min(2, "First name should be more than 2 characters")
        .max(50, "First name should be less than 50 characters"),

      // Last name validation
      lastName: yup
        .string()
        .required("Last name is required")
        .matches(
          /^[a-zA-Z ]*$/,
          "Last name should not contain number or special characters"
        )
        .min(2, "Last name should be more than 2 characters")
        .max(50, "Last name should be less than 50 characters"),

      // Email validation
      email: yup
        .string()
        .required("Email is required")
        .matches(
          /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
          "Email is incorrect. Please re-enter your email"
        ),

      // Date of birth validation
      dateOfBirth: yup
        .date()
        .required("Date of birth is required")
        .test(
          "dateOfBirth",
          "User is under 18. Please select another date",
          (value) => {
            return getAge(value) >= 18;
          }
        ),

      // Gender validation
      gender: yup.string().required("Gender is required"),

      // Address validation
      address: yup.string().required("Address is required"),

      // Phone number validation
      phoneNumber: yup
        .string()
        .required("Phone number is required")
        .matches(/^[0-9]*$/, "Phone number should not have any characters")
        .length(10, "Phone number should be 10 numbers"),

      // Role validation
      role: yup.string().required("Role is required"),
    }),
    onSubmit: (data) => {
      switch (data.role.name) {
        case "Product Owner":
          data.role = "ProductOwner";
          break;
        case "Scrum Master":
          data.role = "ScrumMaster";
          break;
        case "Developer":
          data.role = "Developer";
          break;
        default:
          break;
      }
      userService
        .create(data)
        .then((response) => {
          navigate("/users");
        })
        .catch((e) => {
          console.log(e);
        });
    },
  });

  return (
    <div className="create-user">
      <p className="header-user-list">Create new user</p>
      <form onSubmit={formik.handleSubmit} className="create-user-form">
        <div className="upper-form">
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
                  onChange={formik.handleChange}
                  type="text"
                  className={`form-control ${
                    formik.errors.firstName && formik.touched.firstName === true
                      ? "is-invalid"
                      : ""
                  }`}
                  aria-label="FirstName"
                  aria-describedby="addon-wrapping"
                />
              </div>
              {formik.errors.firstName && formik.touched.firstName && (
                <p
                  className="text-danger mb-0 font-weight-normal"
                  style={{ marginLeft: "6.3rem" }}
                >
                  {formik.errors.firstName}
                </p>
              )}
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
                  onChange={formik.handleChange}
                  type="text"
                  className={`form-control ${
                    formik.errors.lastName && formik.touched.lastName === true
                      ? "is-invalid"
                      : ""
                  }`}
                  aria-label="LastName"
                  aria-describedby="addon-wrapping"
                />
              </div>
              {formik.errors.lastName && formik.touched.lastName && (
                <p
                  className="text-danger mb-0 font-weight-normal"
                  style={{ marginLeft: "6.3rem" }}
                >
                  {formik.errors.lastName}
                </p>
              )}
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-4">
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
                  onChange={formik.handleChange}
                  type="text"
                  className={`form-control ${
                    formik.errors.email && formik.touched.email === true
                      ? "is-invalid"
                      : ""
                  }`}
                  aria-label="Email"
                  aria-describedby="addon-wrapping"
                />
              </div>
              {formik.errors.email && formik.touched.email && (
                <p
                  className="text-danger mb-0 font-weight-normal"
                  style={{ marginLeft: "4.3rem" }}
                >
                  {formik.errors.email}
                </p>
              )}
            </div>
            <div className="col-5">
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
                  onChange={formik.handleChange}
                  type="date"
                  className={`form-control ${
                    formik.errors.dateOfBirth &&
                    formik.touched.dateOfBirth === true
                      ? "is-invalid"
                      : ""
                  }`}
                  aria-label="DateOfBirth"
                  aria-describedby="addon-wrapping"
                />
              </div>
              {formik.errors.dateOfBirth && formik.touched.dateOfBirth && (
                <p
                  className="text-danger mb-0 font-weight-normal"
                  style={{ marginLeft: "7.5rem" }}
                >
                  {formik.errors.dateOfBirth}
                </p>
              )}
            </div>
            <div className="col-3">
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
                      className={`custom-control-input ${
                        formik.errors.gender && formik.touched.gender === true
                          ? "is-invalid"
                          : ""
                      }`}
                      id="male"
                      name="gender"
                      value="1"
                      onChange={formik.handleChange}
                    />
                    <label
                      className="custom-control-label font-weight-normal"
                      for="male"
                    >
                      Male
                    </label>
                  </div>
                  <div className="custom-control custom-radio ml-4">
                    <input
                      type="radio"
                      className={`custom-control-input ${
                        formik.errors.gender && formik.touched.gender === true
                          ? "is-invalid"
                          : ""
                      }`}
                      id="female"
                      name="gender"
                      value="2"
                      onChange={formik.handleChange}
                    />
                    <label
                      className="custom-control-label font-weight-normal"
                      for="female"
                    >
                      Female
                    </label>
                  </div>
                </div>
              </div>
              {formik.errors.gender && formik.touched.gender && (
                <p
                  className="text-danger mb-0 font-weight-normal"
                  style={{ marginLeft: "6.3rem" }}
                >
                  {formik.errors.gender}
                </p>
              )}
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-6">
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
                  onChange={formik.handleChange}
                  type="text"
                  className={`form-control ${
                    formik.errors.address && formik.touched.address === true
                      ? "is-invalid"
                      : ""
                  }`}
                  aria-label="Address"
                  aria-describedby="addon-wrapping"
                />
              </div>
              {formik.errors.address && formik.touched.address && (
                <p
                  className="text-danger mb-0 font-weight-normal"
                  style={{ marginLeft: "5.5rem" }}
                >
                  {formik.errors.address}
                </p>
              )}
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
                  onChange={formik.handleChange}
                  type="text"
                  className={`form-control ${
                    formik.errors.phoneNumber &&
                    formik.touched.phoneNumber === true
                      ? "is-invalid"
                      : ""
                  }`}
                  aria-label="PhoneNumber"
                  aria-describedby="addon-wrapping"
                />
              </div>
              {formik.errors.phoneNumber && formik.touched.phoneNumber && (
                <p
                  className="text-danger mb-0 font-weight-normal"
                  style={{ marginLeft: "8.5rem" }}
                >
                  {formik.errors.phoneNumber}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="lower-form">
          <p className="form-title">Project information</p>
          <div className="input-group flex-nowrap mt-4">
            <div className="input-group-prepend">
              <span className="input-group-text" id="addon-wrapping">
                Role
              </span>
            </div>
            <select
              className={`browser-default custom-select ${
                formik.errors.role && formik.touched.role === true
                  ? "is-invalid"
                  : ""
              }`}
              id="role"
              name="role"
              value={formik.values.role}
              onChange={formik.handleChange}
            >
              <option selected>Please select role for the user</option>
              <option value="ProductOwner">Product Owner</option>
              <option value="Scrum Master">Scrum Master</option>
              <option value="Developer">Developer</option>
            </select>
          </div>
          {formik.errors.role && formik.touched.role && (
            <p
              className="text-danger mb-0 font-weight-normal"
              style={{ marginLeft: "3.8rem" }}
            >
              {formik.errors.role}
            </p>
          )}
        </div>
        <div className="create-user-button-group">
          <button type="submit" className="btn btn-confirm-advisor">
            Submit
          </button>
          <button
            type="submit"
            className="btn btn-cancel-advisor"
            onClick={() => {
              navigate("/users");
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUser;
