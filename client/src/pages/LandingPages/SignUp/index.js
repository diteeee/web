import { Grid, Card, MenuItem } from "@mui/material";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import bgImage from "assets/images/bg-presentation.jpg";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import routes from "routes";

import { useRegisterForm } from "./useRegisterForm";

const RegisterUser = () => {
  const { newUser, formErrors, handleChange, handleSubmit, errorMessage, teachers } =
    useRegisterForm();

  return (
    <>
      <DefaultNavbar routes={routes} transparent light />
      <MKBox
        position="absolute"
        top={0}
        left={0}
        zIndex={1}
        width="100%"
        minHeight="100vh"
        sx={{
          backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.dark.main, 0.6),
              rgba(gradients.dark.state, 0.6)
            )}, url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <MKBox px={1} width="100%" height="100vh" mx="auto" position="relative" zIndex={2}>
        <Grid container spacing={1} justifyContent="center" alignItems="center" height="100%">
          <Grid item xs={11} sm={9} md={6} lg={4}>
            <Card>
              <MKBox
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                mx={2}
                mt={-3}
                p={2}
                mb={1}
                textAlign="center"
              >
                <MKTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                  Register
                </MKTypography>
              </MKBox>
              {errorMessage && (
                <MKBox px={3}>
                  <MKTypography variant="body2" color="error">
                    {errorMessage}
                  </MKTypography>
                </MKBox>
              )}
              <MKBox pt={4} pb={3} px={3}>
                <MKBox component="form" role="form" onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    {/* Parent Information */}
                    <Grid item xs={12}>
                      <MKTypography variant="h6" fontWeight="medium">
                        Parent Information
                      </MKTypography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MKInput
                        type="text"
                        label="Parent Name"
                        fullWidth
                        name="emri"
                        value={newUser.emri}
                        onChange={handleChange}
                        required
                        helperText={formErrors.parentEmri}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MKInput
                        type="text"
                        label="Parent Surname"
                        fullWidth
                        name="mbiemri"
                        value={newUser.mbiemri}
                        onChange={handleChange}
                        required
                        helperText={formErrors.mbiemri}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MKInput
                        type="email"
                        label="Parent Email"
                        fullWidth
                        name="email"
                        value={newUser.email}
                        onChange={handleChange}
                        required
                        helperText={formErrors.email}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MKInput
                        type="password"
                        label="Password"
                        fullWidth
                        name="password"
                        value={newUser.password}
                        onChange={handleChange}
                        required
                        helperText={formErrors.password}
                        autoComplete="new-password"
                      />
                    </Grid>
                    {/* Child Information */}
                    <Grid item xs={12}>
                      <MKTypography variant="h6" fontWeight="medium">
                        Child Information
                      </MKTypography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MKInput
                        type="text"
                        label="Child Name"
                        fullWidth
                        name="kidData.emri"
                        value={newUser.kidData.emri}
                        onChange={handleChange}
                        required
                        helperText={formErrors.childEmri}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MKInput
                        type="text"
                        label="Contact Number"
                        fullWidth
                        name="kidData.nrKontaktues"
                        value={newUser.kidData.nrKontaktues}
                        onChange={handleChange}
                        required
                        helperText={formErrors.nrKontaktues}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MKInput
                        select
                        label="Child's Teacher"
                        fullWidth
                        name="kidData.kidTeacherID"
                        value={newUser.kidData.kidTeacherID}
                        onChange={handleChange}
                        required
                        helperText={formErrors["kidData.kidTeacherID"]}
                        sx={{
                          "& .MuiSelect-select": {
                            paddingTop: "12px",
                            paddingBottom: "12px",
                          },
                          "& .MuiInputBase-root": {
                            height: "45px",
                          },
                        }}
                      >
                        {teachers.map((teacher) => (
                          <MenuItem key={teacher.teacherID} value={teacher.teacherID}>
                            {teacher.emri}
                          </MenuItem>
                        ))}
                      </MKInput>
                    </Grid>
                    <Grid item xs={12}>
                      <MKBox mt={4}>
                        <MKButton variant="gradient" color="info" fullWidth type="submit">
                          Register
                        </MKButton>
                      </MKBox>
                    </Grid>
                  </Grid>
                </MKBox>
              </MKBox>
            </Card>
          </Grid>
        </Grid>
      </MKBox>
    </>
  );
};

export default RegisterUser;
