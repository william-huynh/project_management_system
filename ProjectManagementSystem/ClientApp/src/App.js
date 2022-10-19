import axios from "axios";
import { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import CreateUser from "./pages/Users/CreateUser";
import UserTable from "./pages/Users/ListUser";
import UpdateUser from "./pages/Users/UpdateUser";
import UpdateProfile from "./pages/Users/UpdateProfile";
import ProjectTable from "./pages/Projects/ListProject";
import CreateProject from "./pages/Projects/CreateProject";
import UpdateProject from "./pages/Projects/UpdateProject";
import DetailProject from "./pages/Projects/DetailProject";

import loading from "./assets/loading.gif";
import "./App.css";

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
      {role === "ProductOwner" ? (
        <>
          <Navbar user={user} />
          <div className="body">
            <Sidebar user={user} />
            <Routes>
              <Route exact path="/" />
              <Route path="/users" element={<UserTable />} />
              <Route path="/users/add" element={<CreateUser />} />
              <Route path="/users/update/:id" element={<UpdateUser />} />
              <Route path="/profile/:id" element={<UpdateProfile />} />
              <Route path="/projects" element={<ProjectTable />} />
              <Route path="/projects/add" element={<CreateProject />} />
              <Route path="/projects/update/:id" element={<UpdateProject />} />
              <Route path="/projects/:id" element={<DetailProject />} />
            </Routes>
          </div>
        </>
      ) : role === "ScrumMaster" ? (
        <>
          <Navbar user={user} />
          <div className="body">
            <Sidebar user={user} />
            <div>Hello Scrum Master!</div>
            <Routes>
              <Route exact path="/" />
            </Routes>
          </div>
        </>
      ) : role === "Developer" ? (
        <>
          <Navbar user={user} />
          <div className="body">
            <Sidebar user={user} />
            <div>Hello Developer!</div>
            <Routes>
              <Route exact path="/" />
            </Routes>
          </div>
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
