import { useState, useEffect } from "react";
import axios from "axios";
import logger from "utils/logger";

const useTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const token = localStorage.getItem("token");

  const axiosConfig = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  };

  //display
  const fetchTeachers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/v1/teachers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTeachers(response.data);
    } catch (error) {
      logger.error("There was an error fetching the teachers!", error);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  //add teacher
  const [formErrors, setFormErrors] = useState({});
  const [showAddTeacherForm, setShowAddTeacherForm] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    emri: "",
    mbiemri: "",
    nrTel: "",
  });

  const validateForm = () => {
    const errors = {};
    if (!newTeacher.emri) errors.emri = "Name is required.";
    if (!newTeacher.mbiemri) errors.mbiemri = "Surname is required.";
    if (!newTeacher.nrTel.trim()) {
      errors.nrTel = "Phone Number is required.";
    } else if (!newTeacher.nrTel.match(/^\d{5,15}$/)) {
      errors.nrTel = "Phone Number should have between 5 and 15 digits.";
    }
    return errors;
  };

  const handleAddTeacherClick = () => {
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      handleAddTeacher();
      setFormErrors({});
    } else {
      setFormErrors(errors);
    }
  };

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeacher((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddTeacher = async () => {
    const formData = new FormData();
    formData.append("emri", newTeacher.emri);
    formData.append("mbiemri", newTeacher.mbiemri);
    formData.append("nrTel", newTeacher.nrTel);
    if (selectedImage) {
      formData.append("imageUrl", selectedImage);
    }

    try {
      await axios.post("http://localhost:3001/v1/teachers", formData, axiosConfig, {});
      fetchTeachers();
      setNewTeacher({
        emri: "",
        mbiemri: "",
        nrTel: "",
      });
      setSelectedImage(null);
      setShowAddTeacherForm(false);
    } catch (error) {
      logger.error("Error adding teacher:", error);
    }
  };

  //edit
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [editedTeacher, setEditedTeacher] = useState({
    emri: "",
    mbiemri: "",
    nrTel: "",
    imageUrl: "",
  });

  const handleImageChange = (e, type) => {
    if (type === "new") {
      setSelectedImage(e.target.files[0]);
    } else {
      setEditedTeacher((prevState) => ({
        ...prevState,
        image: e.target.files[0],
      }));
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTeacher((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEdit = (teacher) => {
    setEditingTeacherId(teacher.teacherID);
    setEditedTeacher(teacher);
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("emri", editedTeacher.emri);
    formData.append("mbiemri", editedTeacher.mbiemri);
    formData.append("nrTel", editedTeacher.nrTel);
    if (editedTeacher.image) {
      formData.append("imageUrl", editedTeacher.image);
    }

    try {
      await axios.put(
        `http://localhost:3001/v1/teachers/${editingTeacherId}`,
        formData,
        axiosConfig,
        {}
      );
      fetchTeachers();
      setEditingTeacherId(null);
      setSelectedImage(null);
    } catch (error) {
      logger.error("Error updating teacher:", error);
    }
  };

  //delete
  const handleDelete = async (teacherID) => {
    try {
      await axios.delete(`http://localhost:3001/v1/teachers/${teacherID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTeachers();
    } catch (error) {
      logger.error("Error deleting teacher:", error);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return {
    teachers,
    newTeacher,
    editedTeacher,
    editingTeacherId,
    showAddTeacherForm,
    formErrors,
    selectedImage,
    setEditingTeacherId,
    handleEdit,
    handleImageChange,
    handleEditInputChange,
    handleSave,
    handleDelete,
    handleAddInputChange,
    setShowAddTeacherForm,
    handleAddTeacherClick,
  };
};

export default useTeachers;
