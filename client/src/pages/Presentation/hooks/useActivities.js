import { useState, useEffect } from "react";
import axios from "axios";
import logger from "utils/logger";

const useActivities = () => {
  const [activities, setActivities] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [showAddActivityForm, setShowAddActivityForm] = useState(false);
  const [newActivity, setNewActivity] = useState({
    emri: "",
    pershkrim: "",
    activityTeacherID: "",
  });
  const [editingActivityId, setEditingActivityId] = useState(null);
  const [editedActivity, setEditedActivity] = useState({
    emri: "",
    pershkrim: "",
    activityTeacherID: "",
  });

  const token = localStorage.getItem("token");

  const axiosConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchActivities = async () => {
    try {
      const response = await axios.get("http://localhost:3001/v1/activities", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setActivities(response.data);
    } catch (error) {
      logger.error("There was an error fetching the activities!", error);
    }
  };

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

  useEffect(() => {
    fetchActivities();
    fetchTeachers();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!newActivity.emri) errors.emri = "Name is required.";
    if (!newActivity.pershkrim) errors.pershkrim = "Description is required.";
    if (!newActivity.activityTeacherID) {
      errors.activityTeacherID = "Teacher is required.";
    }
    return errors;
  };

  const handleAddActivityClick = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      await handleAddActivity();
      setFormErrors({});
    } else {
      setFormErrors(errors);
    }
  };

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setNewActivity((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddActivity = async () => {
    const activityData = {
      emri: newActivity.emri,
      pershkrim: newActivity.pershkrim,
      activityTeacherID: newActivity.activityTeacherID,
    };

    try {
      await axios.post("http://localhost:3001/v1/activities", activityData, axiosConfig);
      fetchActivities();
      setNewActivity({
        emri: "",
        pershkrim: "",
        activityTeacherID: "",
      });
      setShowAddActivityForm(false);
    } catch (error) {
      logger.error("Error adding activity:", error);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditedActivity((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEdit = (activity) => {
    setEditingActivityId(activity.activityID);
    setEditedActivity(activity);
  };

  const handleSave = async () => {
    const activityData = {
      emri: editedActivity.emri,
      pershkrim: editedActivity.pershkrim,
      activityTeacherID: editedActivity.activityTeacherID,
    };

    try {
      await axios.put(
        `http://localhost:3001/v1/activities/${editingActivityId}`,
        activityData,
        axiosConfig
      );
      fetchActivities();
      setEditingActivityId(null);
    } catch (error) {
      logger.error("Error updating activity:", error);
    }
  };

  const handleDelete = async (activityID) => {
    try {
      await axios.delete(`http://localhost:3001/v1/activities/${activityID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchActivities();
    } catch (error) {
      logger.error("Error deleting activity:", error);
    }
  };

  return {
    activities,
    teachers,
    newActivity,
    editedActivity,
    editingActivityId,
    showAddActivityForm,
    formErrors,
    setEditingActivityId,
    handleEdit,
    handleEditInputChange,
    handleSave,
    handleDelete,
    handleAddInputChange,
    setShowAddActivityForm,
    handleAddActivityClick,
  };
};

export default useActivities;
