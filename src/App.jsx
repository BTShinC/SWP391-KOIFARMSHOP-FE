
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";




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
    
      ]);
      return <RouterProvider router={router} />;
}
export default App
