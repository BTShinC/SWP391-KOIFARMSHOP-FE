import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import UserInfoPage from "./pages/userinfo";
import AddFish from "./pages/addfish";




function App() {
    const router = createBrowserRouter([
        {
          path: "/",
          element: <HomePage/>,
        },

        {
          path: "/login",
          element: <LoginPage/>,
        },

        {
          path: "/userinfo", 
          element: <UserInfoPage/>,
        },

        {
          path: "/addfish",
          element: <AddFish/>,
        },
        
    
      ]);
      return <RouterProvider router={router} />;
    }

export default App


