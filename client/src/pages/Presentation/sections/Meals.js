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
import DefaultFooter from "examples/Footers/DefaultFooter";
import footerRoutes from "footer.routes";
import useMeals from "../hooks/useMeals";
import { useUser } from "context/UserContext";

const OurMeals = () => {
  const { user } = useUser();
  const {
    meals,
    editedMeal,
    editingMealId,
    newMeal,
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
  } = useMeals();

  const role = user ? user.role : "guest";

  // Define the custom order for the days of the week
  const daysOrder = ["e hene", "e marte", "e merkure", "e enjte", "e premte"];

  // Sort meals based on the custom days order
  const sortedMeals = meals.sort((a, b) => {
    return daysOrder.indexOf(a.dita.toLowerCase()) - daysOrder.indexOf(b.dita.toLowerCase());
  });

  // Group meals by pershkrim type (mengjes, dreke, embelsire)
  const breakfastMeals = sortedMeals.filter((meal) => meal.pershkrim.toLowerCase() === "mengjes");
  const lunchMeals = sortedMeals.filter((meal) => meal.pershkrim.toLowerCase() === "dreke");
  const dessertMeals = sortedMeals.filter((meal) => meal.pershkrim.toLowerCase() === "embelsire");

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
              onClick={() => setShowAddMealForm(!showAddMealForm)}
            >
              {showAddMealForm ? "Cancel" : "Add New Meal"}
            </Button>
          )}
          <Grid container spacing={3}>
            {showAddMealForm && role === "admin" && (
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardContent>
                    <TextField
                      label="Name"
                      name="emri"
                      value={newMeal.emri}
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
                      value={newMeal.pershkrim}
                      onChange={handleAddInputChange}
                      fullWidth
                      margin="normal"
                      required
                      error={Boolean(formErrors.pershkrim)}
                      helperText={formErrors.pershkrim}
                    />
                    <TextField
                      label="Week Day"
                      name="dita"
                      value={newMeal.dita}
                      onChange={handleAddInputChange}
                      fullWidth
                      margin="normal"
                      required
                      error={Boolean(formErrors.dita)}
                      helperText={formErrors.dita}
                    />
                    <TextField
                      label="Time"
                      name="orari"
                      value={newMeal.orari}
                      onChange={handleAddInputChange}
                      fullWidth
                      margin="normal"
                      required
                      error={Boolean(formErrors.orari)}
                      helperText={formErrors.orari}
                    />
                    <Button color="primary" onClick={handleAddMealClick}>
                      Add
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
          <Typography variant="h4" sx={{ marginBottom: 2, marginTop: 3 }}>
            Breakfast
          </Typography>
          <Grid container spacing={3}>
            {breakfastMeals.length > 0 ? (
              breakfastMeals.map((meal) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={meal.mealID}>
                  <Card sx={{ maxWidth: 345 }}>
                    <CardContent>
                      {editingMealId === meal.mealID ? (
                        <>
                          <TextField
                            label="Name"
                            name="emri"
                            value={editedMeal.emri}
                            onChange={handleEditInputChange}
                            fullWidth
                            margin="normal"
                          />
                          <TextField
                            label="Description"
                            name="pershkrim"
                            value={editedMeal.pershkrim}
                            onChange={handleEditInputChange}
                            fullWidth
                            margin="normal"
                          />
                          <TextField
                            label="Week Day"
                            name="dita"
                            value={editedMeal.dita}
                            onChange={handleEditInputChange}
                            fullWidth
                            margin="normal"
                          />
                          <TextField
                            label="Time"
                            name="orari"
                            value={editedMeal.orari}
                            onChange={handleEditInputChange}
                            fullWidth
                            margin="normal"
                          />
                          <Button color="primary" onClick={handleSave}>
                            Save
                          </Button>
                          <Button
                            onClick={() => setEditingMealId(null)}
                            style={{ marginLeft: "10px" }}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Typography gutterBottom variant="h5" component="div">
                            {meal.dita}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {meal.emri}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {meal.pershkrim}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {meal.orari}
                          </Typography>
                          {role === "admin" && (
                            <>
                              <Button onClick={() => handleEdit(meal)}>Edit</Button>
                              <Button
                                onClick={() => handleDelete(meal.mealID)}
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
                  No breakfast meals found.
                </Typography>
              </Grid>
            )}
          </Grid>
          <Typography variant="h4" sx={{ marginTop: 4, marginBottom: 2 }}>
            Lunch
          </Typography>
          <Grid container spacing={3}>
            {lunchMeals.length > 0 ? (
              lunchMeals.map((meal) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={meal.mealID}>
                  <Card sx={{ maxWidth: 345 }}>
                    <CardContent>
                      {editingMealId === meal.mealID ? (
                        <>
                          <TextField
                            label="Name"
                            name="emri"
                            value={editedMeal.emri}
                            onChange={handleEditInputChange}
                            fullWidth
                            margin="normal"
                          />
                          <TextField
                            label="Description"
                            name="pershkrim"
                            value={editedMeal.pershkrim}
                            onChange={handleEditInputChange}
                            fullWidth
                            margin="normal"
                          />
                          <TextField
                            label="Week Day"
                            name="dita"
                            value={editedMeal.dita}
                            onChange={handleEditInputChange}
                            fullWidth
                            margin="normal"
                          />
                          <TextField
                            label="Time"
                            name="orari"
                            value={editedMeal.orari}
                            onChange={handleEditInputChange}
                            fullWidth
                            margin="normal"
                          />
                          <Button color="primary" onClick={handleSave}>
                            Save
                          </Button>
                          <Button
                            onClick={() => setEditingMealId(null)}
                            style={{ marginLeft: "10px" }}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Typography gutterBottom variant="h5" component="div">
                            {meal.dita}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {meal.emri}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {meal.pershkrim}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {meal.orari}
                          </Typography>
                          {role === "admin" && (
                            <>
                              <Button onClick={() => handleEdit(meal)}>Edit</Button>
                              <Button
                                onClick={() => handleDelete(meal.mealID)}
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
                  No lunch meals found.
                </Typography>
              </Grid>
            )}
          </Grid>

          <Typography variant="h4" sx={{ marginTop: 4, marginBottom: 2 }}>
            Desserts
          </Typography>
          <Grid container spacing={3}>
            {dessertMeals.length > 0 ? (
              dessertMeals.map((meal) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={meal.mealID}>
                  <Card sx={{ maxWidth: 345 }}>
                    <CardContent>
                      {editingMealId === meal.mealID ? (
                        <>
                          <TextField
                            label="Name"
                            name="emri"
                            value={editedMeal.emri}
                            onChange={handleEditInputChange}
                            fullWidth
                            margin="normal"
                          />
                          <TextField
                            label="Description"
                            name="pershkrim"
                            value={editedMeal.pershkrim}
                            onChange={handleEditInputChange}
                            fullWidth
                            margin="normal"
                          />
                          <TextField
                            label="Week Day"
                            name="dita"
                            value={editedMeal.dita}
                            onChange={handleEditInputChange}
                            fullWidth
                            margin="normal"
                          />
                          <TextField
                            label="Time"
                            name="orari"
                            value={editedMeal.orari}
                            onChange={handleEditInputChange}
                            fullWidth
                            margin="normal"
                          />
                          <Button color="primary" onClick={handleSave}>
                            Save
                          </Button>
                          <Button
                            onClick={() => setEditingMealId(null)}
                            style={{ marginLeft: "10px" }}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Typography gutterBottom variant="h5" component="div">
                            {meal.dita}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {meal.emri}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {meal.pershkrim}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {meal.orari}
                          </Typography>
                          {role === "admin" && (
                            <>
                              <Button onClick={() => handleEdit(meal)}>Edit</Button>
                              <Button
                                onClick={() => handleDelete(meal.mealID)}
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
                  No dessert meals found.
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

export default OurMeals;
