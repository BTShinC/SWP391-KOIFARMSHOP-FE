import { createRoot } from "react-dom/client";
import Register from "./features/Register";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App/>
  </BrowserRouter>
);
