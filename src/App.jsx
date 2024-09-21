
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";




function App() {
    const router = createBrowserRouter([
        {
          path: "/home",
          element: <HomePage/>,
        },
        
    
      ]);
      return <RouterProvider router={router} />;
}
export default App
