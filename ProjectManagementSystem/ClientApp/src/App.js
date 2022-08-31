import axios from "axios";
import { useEffect, useState } from "react";

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
      {role === "ProjectOwner" ? (
        <div>Hello Project Owner!</div>
          ) : role === "ScrumMaster" ? (
        <div>Hello Scrum Master!</div>
              ) : role === "Developer" ? (
        <div>Hello Developer!</div>
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
