import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RegisterForm from './pages/register/Register';
import Admin from './pages/admin/index';
import Home from './pages/home/index';
import LoginPage from './pages/login/Login';
import UserInfoPage from './pages/userinfo';
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/login",
      element: <LoginPage />
    },
    {
      path: "/userinfo", 
      element: <UserInfoPage/>,
    },
    {
      path: "/register",
      element:<RegisterForm />
    },
    {
      path: "/admin",
      element: <Admin />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
