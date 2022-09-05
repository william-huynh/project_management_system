import React, { useState, useEffect, useRef } from "react";
// import { useLocation } from "react-router-dom";
import axios from "axios";

import "./Navbar.css";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Password } from "primereact/password";
import { confirmDialog } from "primereact/confirmdialog";

const Navbar = (props) => {
  const user = props.user;
  // const location = useLocation();
  const [displayChangePassword, setDisplayChangePassword] = useState(false);
  const [displayLogout, setDisplayLogout] = useState(false);
  const [position, setPosition] = useState("center");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState([]);
  const toast = useRef(null);
  const menu = useRef(null);
  const items = [
    {
      label: "Personal user",
      icon: "pi pi-user",
    },
    {
      label: "Change password",
      icon: "pi pi-th-large",
      command: () => {
        onClick("displayChangePassword");
      },
    },
    {
      label: "Logout",
      icon: "pi pi-sign-out",
      command: () => {
        onClick("displayLogout");
      },
    },
  ];

  const dialogFuncMap = {
    displayChangePassword: setDisplayChangePassword,
    displayLogout: setDisplayLogout,
  };

  const onClick = (name, position) => {
    dialogFuncMap[`${name}`](true);

    if (position) {
      setPosition(position);
    }
  };

  const onHide = (name) => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    dialogFuncMap[`${name}`](false);
  };

  const renderChangePasswordFooter = (name) => {
    return (
      <div>
        <Button
          label="No"
          icon="pi pi-times"
          onClick={() => onHide(name)}
          className="p-button-text"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          onClick={() => onHide(name)}
          autoFocus
        />
      </div>
    );
  };

  const renderLogoutFooter = (name) => {
    return (
      <div>
        <Button
          label="No"
          icon="pi pi-times"
          onClick={() => onHide(name)}
          className="p-button-text"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          onClick={() => logout()}
          autoFocus
        />
      </div>
    );
  };

  const renderTitle = (title) => {
    const urlTitle = title.split("/");
    switch (urlTitle[1]) {
      case "":
        return "Home";
      case "users":
        switch (urlTitle[2]) {
          case "add":
            return "Manage User > Add User";
          case "update":
            return "Manage User > Edit User";
          default:
            return "Manage User";
        }
      case "assets":
        switch (urlTitle[2]) {
          case "add":
            return "Manage Asset > Add Asset";
          case "update":
            return "Manage Asset > Edit Asset";
          default:
            return "Manage Asset";
        }
      case "assignments":
        switch (urlTitle[2]) {
          case "add":
            return "Manage Assignment > Add Assignment";
          case "update":
            return "Manage Assignment > Edit Assignment";
          default:
            return "Manage Assignment";
        }
      case "requests":
        return "Request for Returning";
      case "reports":
        return "Report";
      default:
        break;
    }
  };

  const logout = () => {
    axios.post("/api/users/logout").then((res) => {
      window.location.reload();
    });
  };

  // const isDisabled = () => {
  //   if (NewPassword !== "" && OldPassword !== "" && ConfirmPassword !== "")
  //     return false;
  //   return true;
  // };

  // const ChangePassword = () => {
  //   setError([]);
  //   const lowercaseRegExp = /(?=.*?[a-z])/;
  //   const digitsRegExp = /(?=.*?[0-9])/;
  //   const minLengthRegExp = /.{6,}/;
  //   const lowercasePassword = lowercaseRegExp.test(NewPassword);
  //   const digitsPassword = digitsRegExp.test(NewPassword);
  //   const minLengthPassword = minLengthRegExp.test(NewPassword);
  //   if (
  //     lowercasePassword &&
  //     digitsPassword &&
  //     minLengthPassword &&
  //     NewPassword === ConfirmPassword
  //   ) {
  //     axios
  //       .post("/api/users/ChangeNewPassword", {
  //         Id: id,
  //         OldPassword: OldPassword,
  //         NewPassword: NewPassword,
  //         ConfirmPassword: ConfirmPassword,
  //       })
  //       .then((res) => {
  //         handleClosePassword();
  //         handleShowSuccess();
  //       })
  //       .catch(function (error) {
  //         setError((error) => [...error, "Password is incorrect!"]);
  //         return Promise.resolve({ error });
  //       });
  //   } else {
  //     if (!lowercasePassword) {
  //       setError((error) => [...error, "At least one Lowercase"]);
  //     }
  //     if (!digitsPassword) {
  //       setError((error) => [...error, "At least one digit"]);
  //     }
  //     if (!minLengthPassword) {
  //       setError((error) => [...error, "At least minumum 6 characters"]);
  //     }
  //     if (NewPassword !== ConfirmPassword) {
  //       setError((error) => [...error, "Password not match!"]);
  //     }
  //   }
  // };

  return (
    <div
      className={
        user.role[0] === "ProjectOwner"
          ? "navigation-bar red-nav"
          : user.role[0] === "ScrumMaster"
          ? "navigation-bar blue-nav"
          : "navigation-bar green-nav"
      }
    >
      <Toast ref={toast}></Toast>
      {/* <p>{renderTitle(location.pathname)}</p> */}
      <p>abc</p>
      <div className="dropdown">
        <Menu model={items} popup ref={menu} id="popup_menu" />
        <div
          className="username-container"
          onClick={(event) => menu.current.toggle(event)}
        >
          <p>{user.userName}</p>
          <div>
            <i className="pi pi-chevron-down"></i>
          </div>
        </div>
      </div>

      <Dialog
        header="Log out"
        visible={displayLogout}
        style={{ width: "20vw" }}
        footer={renderLogoutFooter("displayLogout")}
        onHide={() => onHide("displayLogout")}
      >
        <p>Are you sure you want to log out?</p>
      </Dialog>

      {/* <Dialog
        header="Change Password"
        visible={displayChangePassword}
        style={{ width: "25vw" }}
        footer={renderChangePasswordFooter("displayChangePassword")}
        onHide={() => onHide("displayChangePassword")}
      >
        <span className="p-float-label">
          <Password
            inputId="password"
            value={oldPassword}
            className="change-password-input"
            onChange={(e) => setOldPassword(e.target.value)}
            feedback={false}
          />
          <label htmlFor="password">Old Password</label>
        </span>
        <span className="p-float-label">
          <Password
            inputId="password"
            value={newPassword}
            className="change-password-input"
            onChange={(e) => setNewPassword(e.target.value)}
            feedback={false}
          />
          <label htmlFor="password">New Password</label>
        </span>
        <span className="p-float-label">
          <Password
            inputId="password"
            value={confirmPassword}
            className="change-password-input"
            onChange={(e) => setConfirmPassword(e.target.value)}
            feedback={false}
          />
          <label htmlFor="password">Confirm Password</label>
        </span>
      </Dialog> */}
    </div>
  );
};

export default Navbar;
