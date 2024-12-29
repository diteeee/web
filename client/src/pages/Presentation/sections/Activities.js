import React from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MKBox from "components/MKBox";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import routes from "routes";
import useActivities from "../hooks/useActivities";
import { useUser } from "context/UserContext";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

const OurActivities = () => {
  const { user } = useUser();
  const {
    activities,
    teachers,
    newActivity,
    editedActivity,
    editingActivityId,
    showAddActivityForm,
    formErrors,
    handleEdit,
    handleEditInputChange,
    handleSave,
    handleDelete,
    handleAddInputChange,
    setShowAddActivityForm,
    handleAddActivityClick,
  } = useActivities();

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
              onClick={() => setShowAddActivityForm(!showAddActivityForm)}
            >
              {showAddActivityForm ? "Cancel" : "Add New Activity"}
            </Button>
          )}
          <Grid container spacing={3}>
            {showAddActivityForm && role === "admin" && (
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardContent>
                    <TextField
                      label="Name"
                      name="emri"
                      value={newActivity.emri}
                      onChange={handleAddInputChange}
                      fullWidth
                      margin="normal"
                      required
                      error={Boolean(formErrors.emri)}
                      helperText={formErrors.emri}
                    />
                    <TextField
                      label="Description"
                      name="pershkrim"
                      value={newActivity.pershkrim}
                      onChange={handleAddInputChange}
                      fullWidth
                      margin="normal"
                      required
                      error={Boolean(formErrors.pershkrim)}
                      helperText={formErrors.pershkrim}
                    />
                    <FormControl fullWidth margin="normal" required>
                      <InputLabel>Teacher</InputLabel>
                      <Select
                        label="Teacher"
                        name="activityTeacherID"
                        value={newActivity.activityTeacherID}
                        onChange={handleAddInputChange}
                        error={Boolean(formErrors.activityTeacherID)}
                      >
                        {teachers.map((teacher) => (
                          <MenuItem key={teacher.teacherID} value={teacher.teacherID}>
                            {teacher.emri} {teacher.mbiemri}
                          </MenuItem>
                        ))}
                      </Select>
                      {formErrors.activityTeacherID && (
                        <Typography color="error" variant="body2">
                          {formErrors.activityTeacherID}
                        </Typography>
                      )}
                    </FormControl>
                    <Button color="primary" onClick={handleAddActivityClick}>
                      Add
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            )}
            {activities.length > 0 ? (
              activities.map((activity) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={activity.activityID}>
                  <Card sx={{ maxWidth: 345 }}>
                    <CardContent>
                      {editingActivityId === activity.activityID ? (
                        <>
                          <TextField
                            label="Name"
                            name="emri"
                            value={editedActivity.emri}
                            onChange={handleEditInputChange}
                            fullWidth
                            margin="normal"
                            required
                          />
                          <TextField
                            label="Description"
                            name="pershkrim"
                            value={editedActivity.pershkrim}
                            onChange={handleEditInputChange}
                            fullWidth
                            margin="normal"
                            required
                          />
                          <FormControl fullWidth margin="normal">
                            <InputLabel>Teacher</InputLabel>
                            <Select
                              name="activityTeacherID"
                              value={editedActivity.activityTeacherID}
                              onChange={handleEditInputChange}
                            >
                              {teachers.map((teacher) => (
                                <MenuItem key={teacher.teacherID} value={teacher.teacherID}>
                                  {teacher.emri}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <Button color="primary" onClick={handleSave}>
                            Save
                          </Button>
                        </>
                      ) : (
                        <>
                          <Typography variant="h5">{activity.emri}</Typography>
                          <Typography>{activity.pershkrim}</Typography>
                          <Typography variant="body2">
                            Teacher:{" "}
                            {teachers.find(
                              (teacher) => teacher.teacherID === activity.activityTeacherID
                            )?.emri || "Unknown"}{" "}
                            {teachers.find(
                              (teacher) => teacher.teacherID === activity.activityTeacherID
                            )?.mbiemri || "Unknown"}
                          </Typography>
                          {role === "admin" && (
                            <>
                              <Button onClick={() => handleEdit(activity)}>Edit</Button>
                              <Button
                                onClick={() => handleDelete(activity.activityID)}
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
              <Typography>No activities available.</Typography>
            )}
          </Grid>
        </Container>
      </MKBox>
    </>
  );
};

export default OurActivities;
