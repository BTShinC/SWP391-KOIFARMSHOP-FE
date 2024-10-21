import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "../pages/redux/features/userSlice";

import api from "../config/api";



const useAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Giả sử bạn có một API để lấy thông tin người dùng từ token
      const fetchUserData = async (id) => {
        try {
          const response = await api.get(`account/${id}`); // Thay đổi endpoint nếu cần
          dispatch(login(response.data)); // Cập nhật thông tin người dùng vào Redux
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      };

      fetchUserData();
    }
  }, [dispatch]);
};

export default useAuth;
