import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RegisterForm from './pages/register/Register';
import Admin from './pages/admin/index';
import Home from './pages/home/index';
import LoginPage from './pages/login/Login';
import UserInfoPage from './pages/userinfo';
import AboutPage from './pages/about';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/login",
      element: <div className='login'><LoginPage /></div>,
    },
    {
      path: "/userinfo",
      element: <UserInfoPage />,
    },
    {
      path: "/register",
      element: <div className='register'><RegisterForm /></div>,
    },
    {
      path: "/admin",
      element: <Admin />,
    },

    {
      path: "/about",
      element: <AboutPage />,
    },

  


  ]);
  return <RouterProvider router={router} />;
}

export default App;
