import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "context/UserContext";
import logger from "utils/logger";

export const useProfile = () => {
  const { user } = useUser();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [users, setUsers] = useState([]);
  const [selectedSection, setSelectedSection] = useState("profile");
  const [child, setChild] = useState(null); // Store the child data
  const [teachers, setTeachers] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // Flag to toggle between view and edit mode
  const [updatedUserData, setUpdatedUserData] = useState({
    emri: user.emri || "",
    mbiemri: user.mbiemri || "",
    email: user.email || "",
  });
  const token = localStorage.getItem("token");

  const fetchTeachers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/v1/teachers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      logger.info("Teachers fetched:", response.data);
      setTeachers(response.data);
    } catch (error) {
      logger.error("There was an error fetching the teachers!", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/v1/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      logger.error("There was an error fetching the teachers!", error);
    }
  };

  const fetchChildData = () => {
    axios
      .get(`http://localhost:3001/v1/kids/my-kid?email=${user.email}`)
      .then((response) => {
        setChild(response.data);
      })
      .catch((err) => {
        logger.info("failed to fetch child", err);
      });
  };

  const handleEditProfile = () => {
    axios
      .put(
        `http://localhost:3001/v1/users/${user.userID}`,
        { ...updatedUserData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setSnackbarMessage("Profile updated successfully!", response);
        setSnackbarSeverity("success"); // Show success
        setOpenSnackbar(true);
        setIsEditing(false);
        user.emri = updatedUserData.emri;
        user.mbiemri = updatedUserData.mbiemri;
        user.email = updatedUserData.email;
        child.mbiemri = updatedUserData.mbiemri;
      })
      .catch((error) => {
        setSnackbarMessage("Error updating profile!", error);
        setSnackbarSeverity("error"); // Show error
        setOpenSnackbar(true);
      });
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUsers();
      fetchChildData();
    } else {
      logger.info("No user found");
    }
  }, [user]);

  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return {
    user,
    users,
    updatedUserData,
    teachers,
    child,
    selectedSection,
    isEditing,
    setIsEditing,
    handleEditProfile,
    setUpdatedUserData,
    handleSectionChange,
    openSnackbar,
    snackbarMessage,
    snackbarSeverity,
    handleCloseSnackbar,
  };
};
