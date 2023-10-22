import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Axios from 'axios';
import { AuthContextProvider } from "./context/Context";
Axios.defaults.baseURL ="http://localhost:8008/api/";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>
);
