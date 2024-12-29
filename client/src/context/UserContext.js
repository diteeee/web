import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import logger from "utils/logger";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // Fetch user data from the backend using the token
      axios
        .get("http://localhost:3001/v1/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          logger.info("Fetched user data:", response.data); // log user data to check
          setUser(response.data); // Update the user context with fetched data
        });
    }
  }, []);

  const isAuthenticated = !!user;
  logger.info("Is user authenticated?", isAuthenticated); // Check if authenticated

  return (
    <UserContext.Provider value={{ user, setUser, isAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
