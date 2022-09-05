import axios from "axios";
import { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import "./App.css";
import loading from "./assets/loading.gif";
import Navbar from "./components/Navbar/Navbar";

axios.interceptors.request.use((config) => {
  return config;
});
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (401 === error.response.status) {
      window.location.href =
        "/Identity/Account/Login?returnUrl=" + window.location.pathname;
    } else {
      return Promise.reject(error);
    }
  }
);

const App = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");

  useEffect(() => {
    axios.get("/api/users/get-user").then((response) => {
      setUser(response.data);
      setRole(response.data.role[0]);
    });
  }, []);

  return (
    <div>
      {role === "ProjectOwner" ? (
        <>
          <Navbar user={user} />
          <div>Hello Project Owner!</div>
          <Routes>{/* <Route exact path="/" element={<Home />} /> */}</Routes>
        </>
      ) : role === "ScrumMaster" ? (
        <>
          <Navbar user={user} />
          <div>Hello Scrum Master!</div>
        </>
      ) : role === "Developer" ? (
        <>
          <Navbar user={user} />
          <div>Hello Developer!</div>
        </>
      ) : (
        <>
          <div className="loading">
            <img src={loading} alt="Loading..." />
          </div>
        </>
      )}
    </div>
  );
};

export default App;
