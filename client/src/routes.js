// Assuming you have these imports
import Icon from "@mui/material/Icon";

// Pages
// import AboutUs from "layouts/pages/landing-pages/about-us";
// import ContactUs from "layouts/pages/landing-pages/contact-us";
import SignIn from "layouts/pages/authentication/sign-in";
import SignUp from "layouts/pages/authentication/sign-in/sign-up";
import SignOutPage from "pages/LandingPages/SignOut";
import ProfilePage from "layouts/pages/authentication/sign-in/profile";

// Sections
import Teachers from "pages/Presentation/sections/Teachers";
import Meals from "pages/Presentation/sections/Meals";
import Activities from "pages/Presentation/sections/Activities";

const routes = [
  {
    name: "pages",
    icon: <Icon>dashboard</Icon>,
    columns: 1,
    rowsPerColumn: 2,
    collapse: [
      {
        name: "kindergarten",
        collapse: [
          // {
          //   name: "about us",
          //   route: "/pages/landing-pages/about-us",
          //   component: <AboutUs />,
          //   key: "aboutus",
          // },
          // {
          //   name: "contact us",
          //   route: "/pages/landing-pages/contact-us",
          //   component: <ContactUs />,
          //   key: "contactus",
          // },
        ],
      },
      {
        name: "account",
        collapse: [
          {
            name: "profile",
            route: "/profile",
            component: <ProfilePage />,
            key: "profile",
          },
          {
            name: "log out",
            route: "/logout",
            component: <SignOutPage />,
            key: "logout",
          },
          {
            name: "sign in",
            route: "/pages/authentication/sign-in",
            component: <SignIn />,
            key: "signin",
          },
          {
            name: "sign up",
            route: "/pages/authentication/sign-in/sign-up",
            component: <SignUp />,
            key: "signup",
          },
        ],
      },
    ],
  },
  {
    name: "sections",
    icon: <Icon>view_day</Icon>,
    collapse: [
      {
        name: "teachers",
        route: "/sections/Teachers",
        component: <Teachers />,
        key: "teachers",
      },
      {
        name: "meals",
        route: "/sections/Meals",
        component: <Meals />,
        key: "meals",
      },
      {
        name: "activities",
        route: "/sections/Activities",
        component: <Activities />,
        key: "activities",
      },
    ],
  },
];

export default routes;
