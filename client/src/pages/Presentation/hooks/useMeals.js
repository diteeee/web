import { useState, useEffect } from "react";
import axios from "axios";
import logger from "utils/logger";

const useMeals = () => {
  const [meals, setMeals] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [showAddMealForm, setShowAddMealForm] = useState(false);
  const [newMeal, setNewMeal] = useState({
    emri: "",
    pershkrim: "",
    dita: "",
    orari: "",
  });
  const [editingMealId, setEditingMealId] = useState(null);
  const [editedMeal, setEditedMeal] = useState({
    emri: "",
    pershkrim: "",
    dita: "",
    orari: "",
  });

  const token = localStorage.getItem("token");

  const axiosConfig = {
    headers: {
      "Content-Type": "application/json", // Change to JSON
      Authorization: `Bearer ${token}`,
    },
  };

  // Fetch meals
  const fetchMeals = async () => {
    try {
      const response = await axios.get("http://localhost:3001/v1/meals", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMeals(response.data);
    } catch (error) {
      logger.error("There was an error fetching the meals!", error);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!newMeal.emri) errors.emri = "Name is required.";
    if (!newMeal.pershkrim) errors.pershkrim = "Description is required.";
    if (!newMeal.dita) {
      errors.dita = "Week Day is required.";
    }
    if (!newMeal.orari) {
      errors.orari = "Time is required.";
    }
    return errors;
  };

  // Handle Add Meal
  const handleAddMealClick = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      await handleAddMeal();
      setFormErrors({});
    } else {
      setFormErrors(errors);
    }
  };

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setNewMeal((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddMeal = async () => {
    const mealData = {
      emri: newMeal.emri,
      pershkrim: newMeal.pershkrim,
      dita: newMeal.dita,
      orari: newMeal.orari,
    };

    try {
      const response = await axios.post("http://localhost:3001/v1/meals", mealData, axiosConfig);

      logger.info("Meal added successfully:", response);

      fetchMeals();
      setNewMeal({
        emri: "",
        pershkrim: "",
        dita: "",
        orari: "",
      });
      setShowAddMealForm(false);
    } catch (error) {
      logger.error("Error adding meal:", error);
    }
  };

  // Handle Edit Meal
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditedMeal((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEdit = (meal) => {
    setEditingMealId(meal.mealID);
    setEditedMeal(meal);
  };

  const handleSave = async () => {
    const mealData = {
      emri: editedMeal.emri,
      pershkrim: editedMeal.pershkrim,
      dita: editedMeal.dita,
      orari: editedMeal.orari,
    };

    try {
      await axios.put(`http://localhost:3001/v1/meals/${editingMealId}`, mealData, axiosConfig);
      fetchMeals();
      setEditingMealId(null);
    } catch (error) {
      logger.error("Error updating meal:", error);
    }
  };

  // Handle Delete Meal
  const handleDelete = async (mealID) => {
    try {
      await axios.delete(`http://localhost:3001/v1/meals/${mealID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchMeals();
    } catch (error) {
      logger.error("Error deleting meal:", error);
    }
  };

  return {
    meals,
    newMeal,
    editedMeal,
    editingMealId,
    showAddMealForm,
    formErrors,
    setEditingMealId,
    handleEdit,
    handleEditInputChange,
    handleSave,
    handleDelete,
    handleAddInputChange,
    setShowAddMealForm,
    handleAddMealClick,
  };
};

export default useMeals;
