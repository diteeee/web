import React from "react";
import * as ReactDOMClient from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "App";
import { UserProvider } from "./context/UserContext";

const container = document.getElementById("root");

// Create a root.
const root = ReactDOMClient.createRoot(container);

root.render(
  <Router>
    <UserProvider>
      <App />
    </UserProvider>
  </Router>
);
