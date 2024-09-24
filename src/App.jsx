import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RegisterForm from './pages/register/Register';
import Admin from './pages/admin/index';
import HomePage from './pages/home/index';
import LoginPage from './pages/login/Login';
import UserInfoPage from './pages/userinfo';
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/login",
      element: <div className='login'><LoginPage /></div>,
    },
    {
      path: "/userinfo", 
      element: <UserInfoPage/>,
    },
    {
      path: "/register",
      element:<div className='register'><RegisterForm /></div>,
    },
    {
      path: "/admin",
      element: <Admin />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
