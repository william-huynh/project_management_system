import axios from "axios";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

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
import HomeProject from "./pages/Home/HomeProject";
import DetailUser from "./pages/Users/DetailUser";
import SprintTable from "./pages/Sprints/ListSprint";
import CreateSprint from "./pages/Sprints/CreateSprint";
import UpdateSprint from "./pages/Sprints/UpdateSprint";
import AssignmentTable from "./pages/Assignments/ListAssignments";
import CreateAssignment from "./pages/Assignments/CreateAssignment";

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
      {user === null ? (
        <>
          <div className="loading">
            <img src={loading} alt="Loading..." />
          </div>
        </>
      ) : (
        <>
          {role === "ProductOwner" ? (
            <>
              <Navbar user={user} />
              <div className="body">
                <Sidebar user={user} />
                <Routes>
                  <Route exact path="/" element={<HomeProject user={user} />} />
                  <Route
                    path="/profile/:id"
                    element={<UpdateProfile user={user} />}
                  />
                  <Route path="/users" element={<UserTable />} />
                  <Route path="/users/add" element={<CreateUser />} />
                  <Route path="/users/update/:id" element={<UpdateUser />} />
                  <Route
                    path="/projects"
                    element={<ProjectTable user={user} />}
                  />
                  <Route path="/users/:id" element={<DetailUser />} />
                  <Route path="/projects/add" element={<CreateProject />} />
                  <Route
                    path="/projects/update/:id"
                    element={<UpdateProject />}
                  />
                  <Route path="/projects/:id" element={<DetailProject />} />
                </Routes>
              </div>
            </>
          ) : role === "ScrumMaster" ? (
            <>
              <Navbar user={user} />
              <div className="body">
                <Sidebar user={user} />
                <Routes>
                  <Route exact path="/" />
                  <Route
                    path="/profile/:id"
                    element={<UpdateProfile user={user} />}
                  />
                  <Route
                    path="/sprints"
                    element={<SprintTable user={user} />}
                  />
                  {/* <Route
                    path="/sprints/add"
                    element={<CreateSprint user={user} />}
                  />
                  <Route
                    path="/sprints/update/:id"
                    element={<UpdateSprint user={user} />}
                  /> */}
                  <Route
                    path="/assignments"
                    element={<AssignmentTable user={user} />}
                  />
                  <Route
                    path="/assignments/add"
                    element={<CreateAssignment user={user} />}
                  />
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
        </>
      )}
    </div>
  );
};

export default App;
