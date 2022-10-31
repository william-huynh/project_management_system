import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./Navbar.css";

const Navbar = (props) => {
  const user = props.user;
  const role = props.user.role[0];
  const navigate = useNavigate();
  // const location = useLocation();

  // const renderTitle = (title) => {
  //   const urlTitle = title.split("/");
  //   switch (urlTitle[1]) {
  //     case "":
  //       return "Home";
  //     case "users":
  //       switch (urlTitle[2]) {
  //         case "add":
  //           return "Manage User > Add User";
  //         case "update":
  //           return "Manage User > Edit User";
  //         default:
  //           return "Manage User";
  //       }
  //     case "assets":
  //       switch (urlTitle[2]) {
  //         case "add":
  //           return "Manage Asset > Add Asset";
  //         case "update":
  //           return "Manage Asset > Edit Asset";
  //         default:
  //           return "Manage Asset";
  //       }
  //     case "assignments":
  //       switch (urlTitle[2]) {
  //         case "add":
  //           return "Manage Assignment > Add Assignment";
  //         case "update":
  //           return "Manage Assignment > Edit Assignment";
  //         default:
  //           return "Manage Assignment";
  //       }
  //     case "requests":
  //       return "Request for Returning";
  //     case "reports":
  //       return "Report";
  //     default:
  //       break;
  //   }
  // };

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
    <div>
      <nav
        className={
          user.role[0] === "ProductOwner"
            ? "red-nav navbar navbar-expand-lg"
            : user.role[0] === "ScrumMaster"
            ? "blue-nav navbar navbar-expand-lg"
            : "green-nav navbar navbar-expand-lg"
        }
      >
        <p className="navbar-brand">Navbar</p>

        <div className="collapse navbar-collapse" id="basicExampleNav">
          <div className="navbar-nav ml-auto">
            <div className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle"
                id="navbarDropdownMenu"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
              >
                {user.userName}
              </button>
              <div
                className="dropdown-menu dropdown-primary"
                aria-labelledby="navbarDropdownMenu"
                style={{ left: "auto", right: 0, textAlign: "right" }}
              >
                <button
                  className="dropdown-item"
                  onClick={() => navigate(`profile/${user.id}`)}
                >
                  User Profile
                </button>
                <button
                  className="dropdown-item"
                  data-toggle="modal"
                  data-target="#logoutModal"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Logout modal */}
      <div
        className="modal fade"
        id="logoutModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="logoutModal"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered"
          role="document"
          id="logout-modal"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">
                Logout
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">Are you sure you want to logout?</div>
            <div className="modal-footer">
              <button
                type="button"
                className={`btn ${
                  role === "ProductOwner"
                    ? "btn-confirm-advisor"
                    : role === "ScrumMaster"
                    ? "btn-confirm-scrum-master"
                    : "btn-confirm-developer"
                }`}
                onClick={logout}
              >
                Yes
              </button>
              <button
                type="button"
                className="btn btn-cancel"
                data-dismiss="modal"
              >
                No
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
