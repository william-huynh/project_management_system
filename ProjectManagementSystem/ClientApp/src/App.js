import axios from "axios";
import { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import "./App.css";
import loading from "./assets/loading.gif";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import UserTable from "./pages/Users/ListUser";

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
