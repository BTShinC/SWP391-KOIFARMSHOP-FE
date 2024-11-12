import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./main.scss";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import store from "./pages/redux/store.js";

import useAuth from "./hooks/useAuth.js";

const Main = () => {
  useAuth(); // Gọi hook useAuth để kiểm tra token và cập nhật trạng thái người dùng
  return <App />;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <Main />
    </Provider>
    <ToastContainer />
  </React.StrictMode>
);
