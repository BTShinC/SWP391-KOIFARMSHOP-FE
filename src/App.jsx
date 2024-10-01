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

import ManageOrder from "./pages/admin/manageOrders";
import ProductPage from "./pages/product";
import LayoutTitle from "./components/layout/title";



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
  ]);
  return <RouterProvider router={router} />;
}

export default App;
