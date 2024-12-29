import React from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MKBox from "components/MKBox";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";
import routes from "routes";
import footerRoutes from "footer.routes";
import useTeachers from "../hooks/useTeachers";
import { useUser } from "context/UserContext";

const OurTeachers = () => {
  const { user } = useUser();
  const {
    teachers,
    editedTeacher,
    editingTeacherId,
    newTeacher,
    showAddTeacherForm,
    formErrors,
    setEditingTeacherId,
    handleEdit,
    handleImageChange,
    handleEditInputChange,
    handleSave,
    handleDelete,
    handleAddInputChange,
    setShowAddTeacherForm,
    handleAddTeacherClick,
  } = useTeachers();

  const role = user ? user.role : "guest";
  return (
    <>
      <DefaultNavbar routes={routes} sticky />
      <MKBox sx={{ paddingTop: "100px" }}>
        <Container>
          {role === "admin" && (
            <Button
              color="primary"
              variant="contained"
              sx={{ marginBottom: 2, color: "#fff" }}
              onClick={() => setShowAddTeacherForm(!showAddTeacherForm)}
            >
              {showAddTeacherForm ? "Cancel" : "Add New Teacher"}
            </Button>
          )}
          <Grid container spacing={3}>
            {showAddTeacherForm && role === "admin" && (
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardContent>
                    <TextField
                      label="Name"
                      name="emri"
                      value={newTeacher.emri}
                      onChange={handleAddInputChange}
                      fullWidth
                      margin="normal"
                      required
                      error={Boolean(formErrors.emri)}
                      helperText={formErrors.emri}
                    />
                    <TextField
                      label="Surname"
                      name="mbiemri"
                      value={newTeacher.mbiemri}
                      onChange={handleAddInputChange}
                      fullWidth
                      margin="normal"
                      required
                      error={Boolean(formErrors.mbiemri)}
                      helperText={formErrors.mbiemri}
                    />
                    <TextField
                      label="Phone Number"
                      name="nrTel"
                      value={newTeacher.nrTel}
                      onChange={handleAddInputChange}
                      fullWidth
                      margin="normal"
                      required
                      error={Boolean(formErrors.nrTel)}
                      helperText={formErrors.nrTel}
                    />
                    <input
                      type="file"
                      name="imageUrl"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "new")}
                    />
                    <Button color="primary" onClick={handleAddTeacherClick}>
                      Add
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            )}
            {teachers.length > 0 ? (
              teachers.map((teacher) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={teacher.teacherID}>
                  <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                      component="img"
                      alt={teacher.emri}
                      height="140"
                      image={`http://localhost:3001/${teacher.imageUrl}`}
                    />
                    <CardContent>
                      {editingTeacherId === teacher.teacherID ? (
                        <>
                          <TextField
                            label="Name"
                            name="emri"
                            value={editedTeacher.emri}
                            onChange={handleEditInputChange}
                            fullWidth
                            margin="normal"
                          />
                          <TextField
                            label="Surname"
                            name="mbiemri"
                            value={editedTeacher.mbiemri}
                            onChange={handleEditInputChange}
                            fullWidth
                            margin="normal"
                          />
                          <TextField
                            label="Phone Number"
                            name="nrTel"
                            value={editedTeacher.nrTel}
                            onChange={handleEditInputChange}
                            fullWidth
                            margin="normal"
                          />
                          <input
                            type="file"
                            name="imageUrl"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, "edit")}
                          />
                          <Button color="primary" onClick={handleSave}>
                            Save
                          </Button>
                          <Button
                            onClick={() => setEditingTeacherId(null)}
                            style={{ marginLeft: "10px" }}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Typography gutterBottom variant="h5" component="div">
                            {teacher.emri}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {teacher.mbiemri}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {teacher.nrTel}
                          </Typography>
                          {role === "admin" && (
                            <>
                              <Button onClick={() => handleEdit(teacher)}>Edit</Button>
                              <Button
                                onClick={() => handleDelete(teacher.teacherID)}
                                style={{ marginLeft: "10px" }}
                              >
                                Delete
                              </Button>
                            </>
                          )}
                        </>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography variant="h6" align="center">
                  No teachers found.
                </Typography>
              </Grid>
            )}
          </Grid>
        </Container>
      </MKBox>
      <MKBox pt={6} px={1} mt={6}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </>
  );
};

export default OurTeachers;
