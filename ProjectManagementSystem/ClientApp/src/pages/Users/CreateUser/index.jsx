import React from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import userService from "../../../services/userService";

import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";
import { Typography } from "antd";

import "./index.css";

const CreateUser = () => {
  const navigate = useNavigate();
  const roles = [
    { name: "Product Owner" },
    { name: "Scrum Master" },
    { name: "Developer" },
  ];

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
      dateOfBirth: null,
      gender: null,
      address: "",
      phoneNumber: "",
      role: null,
    },
    validate: (data) => {
      let errors = {};

      // First name validation
      if (data.firstName == "") {
        errors.firstName = "First name is required";
      } else if (data.firstName.length <= 2) {
        errors.firstName = "First name should be more than 2 characters";
      } else if (data.firstName.length >= 50) {
        errors.firstName = "First name should be less than 50 characters";
      } else if (!/^[a-zA-Z ]*$/.test(data.firstName)) {
        errors.firstName =
          "First name should not contain number or special characters";
      }

      // Last name validation
      if (!data.lastName) {
        errors.lastName = "Last name is required";
      } else if (data.lastName.length <= 2) {
        errors.lastName = "Last name should be more than 2 characters";
      } else if (data.lastName.length >= 50) {
        errors.lastName = "Last name should be less than 50 characters";
      } else if (!/^[a-zA-Z ]*$/.test(data.lastName)) {
        errors.lastName =
          "Last name should not contain number or special characters";
      }

      // Email validation
      if (!data.email) {
        errors.email = "Email is required";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)
      ) {
        errors.email = "Email is incorrect. Please re-enter your email";
      }

      // Date of birth validation
      if (data.dateOfBirth == null) {
        errors.dateOfBirth = "Date of birth is required";
      } else if (getAge(data.dateOfBirth) <= 18) {
        errors.dateOfBirth = "User is under 18. Please select a different date";
      }

      // Gender validation
      if (data.gender == null) {
        errors.gender = "Gender is required";
      }

      // Address validation
      if (!data.address) {
        errors.address = "Address is required";
      }

      // Phone number validation
      if (!data.phoneNumber) {
        errors.phoneNumber = "Phone number is required";
      } else if (!/^[0-9]*$/.test(data.phoneNumber)) {
        errors.phoneNumber = "Phone number must be in number";
      } else if (data.phoneNumber.length != 10) {
        errors.phoneNumber = "Phone number should be 10 numbers";
      }

      // Role validation
      if (data.role == null) {
        errors.role = "Role is required";
      }

      return errors;
    },
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

  const isFormFieldValid = (name) =>
    !!(formik.touched[name] && formik.errors[name]);

  const getFormErrorMessage = (name) => {
    return (
      isFormFieldValid(name) && (
        <small className="p-error">{formik.errors[name]}</small>
      )
    );
  };

  return (
    <div className="create-user">
      <Typography className="header-user-list">Create new user</Typography>
      <form onSubmit={formik.handleSubmit} className="create-user-form">
        <div className="upper-form">
          <p className="form-title">User information</p>
          <div className="inline-input-group">
            <div className="input-group">
              <span className="p-float-label">
                <InputText
                  id="firstName"
                  name="firstName"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  autoFocus
                  className={classNames({
                    "p-invalid": isFormFieldValid("firstName"),
                  })}
                />
                <label
                  htmlFor="firstName"
                  className={classNames({
                    "p-error": isFormFieldValid("firstName"),
                  })}
                >
                  First name*
                </label>
              </span>
              {getFormErrorMessage("firstName")}
            </div>
            <div className="input-group">
              <span className="p-float-label">
                <InputText
                  id="lastName"
                  name="lastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  className={classNames({
                    "p-invalid": isFormFieldValid("lastName"),
                  })}
                />
                <label
                  htmlFor="lastName"
                  className={classNames({
                    "p-error": isFormFieldValid("lastName"),
                  })}
                >
                  Last name*
                </label>
              </span>
              {getFormErrorMessage("lastName")}
            </div>
          </div>
          <div className="inline-input-group">
            <div className="input-group">
              <span className="p-float-label">
                <InputText
                  id="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  className={classNames({
                    "p-invalid": isFormFieldValid("email"),
                  })}
                />
                <label
                  htmlFor="email"
                  className={classNames({
                    "p-error": isFormFieldValid("email"),
                  })}
                >
                  Email*
                </label>
              </span>
              {getFormErrorMessage("email")}
            </div>
            <div className="input-group">
              <span className="p-float-label">
                <Calendar
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formik.values.dateOfBirth}
                  onChange={formik.handleChange}
                  dateFormat="dd/mm/yy"
                  mask="99/99/9999"
                  className={classNames({
                    "p-invalid": isFormFieldValid("dateOfBirth"),
                  })}
                  showIcon
                />
                <label
                  htmlFor="dateOfBirth"
                  className={classNames({
                    "p-error": isFormFieldValid("dateOfBirth"),
                  })}
                >
                  Date of Birth*
                </label>
              </span>
              {getFormErrorMessage("dateOfBirth")}
            </div>
            <div className="input-group">
              <label
                id="gender-label"
                className={classNames({
                  "p-error": isFormFieldValid("gender"),
                })}
              >
                Gender*
              </label>
              <div className="radio-input-group">
                <div style={{ marginRight: "1rem" }}>
                  <RadioButton
                    inputId="male"
                    name="gender"
                    value="1"
                    onChange={formik.handleChange}
                    checked={formik.values.gender === "1"}
                  />
                  <label htmlFor="male" style={{ paddingLeft: "0.3rem" }}>
                    Male
                  </label>
                </div>
                <div>
                  <RadioButton
                    inputId="female"
                    name="gender"
                    value="2"
                    onChange={formik.handleChange}
                    checked={formik.values.gender === "2"}
                  />
                  <label htmlFor="female" style={{ paddingLeft: "0.3rem" }}>
                    Female
                  </label>
                </div>
              </div>
              {getFormErrorMessage("gender")}
            </div>
          </div>
          <div className="inline-input-group">
            <div className="input-group">
              <span className="p-float-label">
                <InputText
                  id="address"
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  className={classNames({
                    "p-invalid": isFormFieldValid("address"),
                  })}
                />
                <label
                  htmlFor="address"
                  className={classNames({
                    "p-error": isFormFieldValid("address"),
                  })}
                >
                  Address*
                </label>
              </span>
              {getFormErrorMessage("address")}
            </div>
            <div className="input-group">
              <span className="p-float-label">
                <InputText
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  className={classNames({
                    "p-invalid": isFormFieldValid("phoneNumber"),
                  })}
                />
                <label
                  htmlFor="phoneNumber"
                  className={classNames({
                    "p-error": isFormFieldValid("phoneNumber"),
                  })}
                >
                  Phone number*
                </label>
              </span>
              {getFormErrorMessage("phoneNumber")}
            </div>
          </div>
        </div>
        <div className="lower-form">
          <p className="form-title">Project information</p>
          <div className="inline-input-group">
            <div className="input-group">
              <span className="p-float-label">
                <Dropdown
                  id="role"
                  name="role"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  options={roles}
                  optionLabel="name"
                  className={classNames({
                    "p-invalid": isFormFieldValid("role"),
                  })}
                />
                <label
                  htmlFor="role"
                  className={classNames({
                    "p-error": isFormFieldValid("role"),
                  })}
                >
                  Role*
                </label>
              </span>
              {getFormErrorMessage("role")}
            </div>
            <div className="input-group"></div>
          </div>
        </div>
        <div className="create-user-button-group">
          <Button
            type="submit"
            label="Submit"
            className="p-button-sm create-user-submit-button"
          />
          <Button
            label="Cancel"
            className="p-button-sm p-button-secondary"
            onClick={() => {
              navigate("/users");
            }}
          />
        </div>
      </form>
    </div>
  );
};

export default CreateUser;
