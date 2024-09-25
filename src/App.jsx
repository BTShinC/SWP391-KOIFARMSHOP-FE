import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import UserInfoPage from "./pages/userinfo";
import AddFish from "./pages/admin/addfish";
import Layout from "./components/layout";
import RegisterForm from "./pages/register";


function App() {
  const router = createBrowserRouter([
    {
      path: "",
      element: <Layout/>,
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
      ]
    },

    {
      path: "/userinfo",
      element: <UserInfoPage />,
    },

    {
      path: "/addfish",
      element: <AddFish />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
