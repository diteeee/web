import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logger from "utils/logger";

export const useRegisterForm = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");

  const [newUser, setNewUser] = useState({
    emri: "",
    mbiemri: "",
    email: "",
    password: "",
    kidData: {
      emri: "",
      mbiemri: "",
      emriPrindit: "",
      emailPrindit: "",
      nrKontaktues: "",
      kidTeacherID: "",
    },
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get("http://localhost:3001/v1/teachers");
        setTeachers(response.data);
      } catch (error) {
        logger.error("Failed to fetch teachers:", error);
      }
    };
    fetchTeachers();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name.startsWith("kidData")) {
      const fieldName = name.split(".").pop();
      setNewUser((prevState) => ({
        ...prevState,
        kidData: {
          ...prevState.kidData,
          [fieldName]: value,
        },
      }));
    } else {
      setNewUser((prevState) => {
        const updatedUser = { ...prevState, [name]: value };

        if (name === "emri") {
          updatedUser.kidData.emriPrindit = value;
        }
        if (name === "mbiemri") {
          updatedUser.kidData.mbiemri = value;
        }
        if (name === "email") {
          updatedUser.kidData.emailPrindit = value;
        }

        return updatedUser;
      });
    }
  };

  const handleTeacherChange = (e) => {
    const teacherID = e.target.value;
    setSelectedTeacher(teacherID);
    setNewUser((prev) => ({
      ...prev,
      kidData: {
        ...prev.kidData,
        kidTeacherID: teacherID,
      },
    }));
  };

  const validateForm = () => {
    const errors = {};

    // Parent Information Validation
    if (!newUser.emri.match(/^[A-Z][a-zA-Z\s]*$/))
      errors.parentEmri = "Parent name must start with a capital letter and contain only letters.";
    if (!newUser.mbiemri.match(/^[A-Z][a-zA-Z\s]*$/))
      errors.parentMbiemri =
        "Parent surname must start with a capital letter and contain only letters.";
    if (!newUser.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      errors.email = "Please enter a valid email address.";
    if (!newUser.password.match(/^(?=.*\d)[A-Za-z\d]{8,16}$/))
      errors.password = "Password must be 8-16 characters long and include at least one number.";

    // Child Information Validation
    if (!newUser.kidData.emri.match(/^[A-Z][a-zA-Z\s]*$/))
      errors.childEmri = "Child name must start with a capital letter and contain only letters.";
    if (!newUser.kidData.nrKontaktues.match(/^\d{5,15}$/))
      errors.nrKontaktues = "Phone Number should have between 5 and 15 digits.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("newUser state:", newUser);

    if (!validateForm()) return;

    try {
      const response = await axios.post("http://localhost:3001/v1/users", {
        ...newUser,
      });
      logger.info("User registered successfully:", response.data);
      setErrorMessage("");
      setNewUser({
        emri: "",
        mbiemri: "",
        email: "",
        password: "",
        kidData: {
          emri: "",
          mbiemri: "",
          emriPrindit: "",
          emailPrindit: "",
          nrKontaktues: "",
          kidTeacherID: "",
        },
      });
      navigate("/pages/authentication/sign-in");
    } catch (error) {
      logger.error("Error during registration:", error);
      if (error.response) {
        setErrorMessage(
          `Registration failed: ${error.response.data.message || "Please try again."}`
        );
      } else if (error.request) {
        setErrorMessage("No response received from the server.");
      } else {
        setErrorMessage("An error occurred during the request setup.");
      }
    }
  };

  useEffect(() => {
    return () => {
      setNewUser({
        emri: "",
        mbiemri: "",
        email: "",
        password: "",
        kidData: {
          emri: "",
          mbiemri: "",
          emriPrindit: "",
          emailPrindit: "",
          nrKontaktues: "",
          kidTeacherID: "",
        },
      });
      setErrorMessage("");
      setFormErrors({});
    };
  }, []);

  return {
    newUser,
    teachers,
    errorMessage,
    formErrors,
    selectedTeacher,
    handleTeacherChange,
    handleChange,
    handleSubmit,
  };
};
