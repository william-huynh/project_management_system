import axios from 'axios';

import logo from './logo.svg';
import './App.css';

axios.interceptors.request.use(config => {
    return config;
});
axios.interceptors.response.use(response => {
    return response;
}, error => {
    if (401 === error.response.status) {
        window.location.href = "/Identity/Account/Login?returnUrl=" + window.location.pathname;
    } else {
        return Promise.reject(error);
    }
});

axios.get("/api/users").then(response => console.table(response.data));

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
