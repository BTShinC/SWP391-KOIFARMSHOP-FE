import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import UserInfoPage from "./pages/userinfo";
import Admin from "./pages/admin/index";
import Layout from "./components/layout";
import RegisterForm from "./pages/register/Register";
import AboutPage from "./components/about";

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
        {
          path: "/about",
          element: <AboutPage />,
        },
      ],
    },

    {
      path: "/userinfo",
      element: <UserInfoPage />,
    },

    {
      path: "/admin",
      element: <Admin />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
