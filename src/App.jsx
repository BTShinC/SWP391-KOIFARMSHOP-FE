import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import UserInfoPage from "./pages/userinfo";
import Admin from "./pages/admin/index";
import Layout from "./components/layout";
import RegisterForm from "./pages/register/Register";
import AboutPage from "./pages/about";
import ManageFish from "./pages/admin/manageFish";
import ContactPage from "./pages/contact";
import ComparePage from "./pages/compare";
import ManageOrder from "./pages/admin/manageOrders";
import ProductPage from "./pages/product";
import LayoutTitle from "./components/layout/title";

// import PrivacyPolicy from "./components/footer/footerpage/privacy-policy";
// import OrderPolicy from "./components/footer/footerpage/order-policy";



function App() {
  const router = createBrowserRouter([
    {
      path: "",
      element: <Layout />,
      children: [
        {
          path: "",
          element: <HomePage />,
        },
        {
          path: "/login",
          element: <LoginPage />,
        },
        {
          path: "/register",
          element: <RegisterForm />,
        },
        
      ],
    },

    {
      path: "",
      element: <LayoutTitle/>,
      children: [
        {
          path: "/about",
          element: <AboutPage />,
        },
        {

          path: "/contact",
          element: <ContactPage />,

        },
      ],
    },

    {
      path: "/userinfo",
      element: <UserInfoPage />,
    },

    {
      path: "/product",
      element: <ProductPage />,
    },

    // {
    //   path: "/privacy-policy",
    //   element: <PrivacyPolicy />,
    // },

    // {
    //   path: "/order-policy",
    //   element: <OrderPolicy />,
    // },




    {
      path: "/admin",
      element: <Admin />,
    },
    {
      path: "/managefish",
      element: <ManageFish />,
    },    {
      path: "/manageOrder",
      element: <ManageOrder />,
    },
    {
      path: "/compare",
      element: <ComparePage />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
