import React from "react";
import {
  Container,
  Grid,
  Typography,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import MKTypography from "components/MKTypography";
import MKBox from "components/MKBox";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import routes from "routes";

import { useProfile } from "./useProfile"; // Corrected import

const Profile = () => {
  const {
    user,
    updatedUserData,
    teachers,
    child,
    selectedSection,
    isEditing,
    openSnackbar,
    snackbarMessage,
    snackbarSeverity,
    setIsEditing,
    handleEditProfile,
    setUpdatedUserData,
    handleSectionChange,
    handleCloseSnackbar,
  } = useProfile();

  return (
    <>
      <DefaultNavbar routes={routes} sticky />
      <Box sx={{ backgroundColor: "#ADD8E6", minHeight: "100vh" }}>
        <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
        <Container>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Paper
                elevation={3}
                sx={{
                  padding: 2,
                  borderRadius: "8px",
                  backgroundColor: "#ffffff",
                  position: "sticky",
                  top: "80px",
                  height: "60vh",
                  marginTop: "80px",
                  boxShadow: 3,
                }}
              >
                <MKTypography
                  variant="h6"
                  fontWeight="bold"
                  align="center"
                  sx={{ marginBottom: 2 }}
                >
                  Menu
                </MKTypography>
                <MKBox sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <List sx={{ padding: 0 }}>
                    <ListItem button onClick={() => handleSectionChange("profile")}>
                      <ListItemText
                        primary={<MKTypography variant="body2">Your Profile</MKTypography>}
                      />
                    </ListItem>
                    <Divider />
                    <ListItem button onClick={() => handleSectionChange("yourchild")}>
                      <ListItemText
                        primary={<MKTypography variant="body2">Your Child</MKTypography>}
                      />
                    </ListItem>
                  </List>
                </MKBox>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={8}>
              <Paper
                elevation={3}
                sx={{
                  padding: 3,
                  borderRadius: "16px",
                  backgroundColor: "#ffffff",
                  boxShadow: 3,
                  marginTop: "80px",
                }}
              >
                {selectedSection === "profile" && (
                  <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} sx={{ textAlign: "center" }}>
                      <MKTypography variant="h4" fontWeight="bold" align="center" gutterBottom>
                        Your Profile
                      </MKTypography>
                    </Grid>
                    {isEditing ? (
                      <>
                        <Grid item xs={12} sx={{ textAlign: "center" }}>
                          <TextField
                            label="Name"
                            value={updatedUserData.emri}
                            onChange={(e) =>
                              setUpdatedUserData({ ...updatedUserData, emri: e.target.value })
                            }
                            fullWidth
                            sx={{ marginBottom: 2 }}
                          />
                        </Grid>
                        <Grid item xs={12} sx={{ textAlign: "center" }}>
                          <TextField
                            label="Surname"
                            value={updatedUserData.mbiemri}
                            onChange={(e) =>
                              setUpdatedUserData({ ...updatedUserData, mbiemri: e.target.value })
                            }
                            fullWidth
                            sx={{ marginBottom: 2 }}
                          />
                        </Grid>
                        <Grid item xs={12} sx={{ textAlign: "center" }}>
                          <TextField
                            label="Email"
                            value={updatedUserData.email}
                            onChange={(e) =>
                              setUpdatedUserData({ ...updatedUserData, email: e.target.value })
                            }
                            fullWidth
                            sx={{ marginBottom: 2 }}
                          />
                        </Grid>
                        <Grid item xs={12} sx={{ textAlign: "center" }}>
                          <Button variant="contained" color="info" onClick={handleEditProfile}>
                            Save Changes
                          </Button>
                          <Button
                            color="info"
                            onClick={() => setIsEditing(null)}
                            style={{ marginLeft: "10px" }}
                          >
                            Cancel
                          </Button>
                        </Grid>
                      </>
                    ) : (
                      <>
                        <Grid item xs={12} sx={{ textAlign: "center" }}>
                          <Typography variant="h6">Name</Typography>
                          <Typography variant="body1" sx={{ fontSize: "1.1rem", color: "#333" }}>
                            {user.emri}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ textAlign: "center" }}>
                          <Typography variant="h6">Surname</Typography>
                          <Typography variant="body1" sx={{ fontSize: "1.1rem", color: "#333" }}>
                            {user.mbiemri}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ textAlign: "center" }}>
                          <Typography variant="h6">Email</Typography>
                          <Typography variant="body1" sx={{ fontSize: "1.1rem", color: "#333" }}>
                            {user.email}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ textAlign: "center" }}>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => setIsEditing(true)}
                          >
                            Edit Profile
                          </Button>
                        </Grid>
                      </>
                    )}
                  </Grid>
                )}

                {selectedSection === "yourchild" && child && (
                  <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} sx={{ textAlign: "center" }}>
                      <MKTypography variant="h4" fontWeight="bold" align="center" gutterBottom>
                        Your Child
                      </MKTypography>
                    </Grid>
                    <Grid item xs={12} sx={{ textAlign: "center" }}>
                      <Typography variant="h6">Name</Typography>
                      <Typography variant="body1" sx={{ fontSize: "1.1rem", color: "#333" }}>
                        {child.emri}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ textAlign: "center" }}>
                      <Typography variant="h6">Surname</Typography>
                      <Typography variant="body1" sx={{ fontSize: "1.1rem", color: "#333" }}>
                        {child.mbiemri}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ textAlign: "center" }}>
                      <Typography variant="h6">Teacher</Typography>
                      <Typography variant="body1" sx={{ fontSize: "1.1rem", color: "#333" }}>
                        {teachers.find((teacher) => teacher.teacherID === child.kidTeacherID)
                          ?.emri || "Unknown"}{" "}
                        {teachers.find((teacher) => teacher.teacherID === child.kidTeacherID)
                          ?.mbiemri || "Unknown"}
                      </Typography>
                    </Grid>
                  </Grid>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Profile;
