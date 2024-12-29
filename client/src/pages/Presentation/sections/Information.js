import { useState, useEffect } from "react";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

// Material Kit 2 React components
import MKBox from "components/MKBox";

// Material Kit 2 React examples
import RotatingCard from "examples/Cards/RotatingCard";
import RotatingCardFront from "examples/Cards/RotatingCard/RotatingCardFront";
import RotatingCardBack from "examples/Cards/RotatingCard/RotatingCardBack";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";

// Images
import bgFront from "assets/images/rotating-card-bg-front.jpeg";
import bgBack from "assets/images/rotating-card-bg-back.jpeg";

function Information() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <MKBox component="section" py={6} my={6}>
      <Container>
        <Grid container item xs={11} spacing={3} alignItems="center" sx={{ mx: "auto" }}>
          <Grid item xs={12} lg={4} sx={{ mx: "auto" }}>
            {!isAuthenticated ? (
              <RotatingCard>
                <RotatingCardFront
                  image={bgFront}
                  icon="touch_app"
                  title={
                    <>
                      Where Little
                      <br />
                      Hearts Bloom
                    </>
                  }
                  description="All the services we need to grow with love and healthy development."
                />
                <RotatingCardBack
                  image={bgBack}
                  title="Learn and Play?"
                  description="Come Join Us"
                  action={{
                    type: "internal",
                    route: "/pages/authentication/sign-in/sign-up",
                    label: "Join",
                  }}
                />
              </RotatingCard>
            ) : (
              <DefaultInfoCard
                icon="content_copy"
                title="Welcome Back!"
                description="You're signed in. Explore more of our services."
              />
            )}
          </Grid>
          <Grid item xs={12} lg={7} sx={{ ml: "auto" }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <DefaultInfoCard
                  icon="content_copy"
                  title="Our Teachers"
                  description="Our teachers are caring, experienced professionals who create a nurturing and inclusive environment for every child."
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DefaultInfoCard
                  icon="content_copy"
                  title="Daycare"
                  description="Our daycare provides a safe, loving, and stimulating environment where children can explore, learn, and grow."
                />
              </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ mt: { xs: 0, md: 6 } }}>
              <Grid item xs={12} md={6}>
                <DefaultInfoCard
                  icon="price_change"
                  title="Meals"
                  description="Our daycare offers nutritious, delicious, and balanced meals, thoughtfully prepared to support growing bodies and minds."
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DefaultInfoCard
                  icon="devices"
                  title="Activities"
                  description="Our daycare offers a variety of fun and engaging activities, from arts and crafts to outdoor play, designed to spark creativity and support holistic development."
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Information;
