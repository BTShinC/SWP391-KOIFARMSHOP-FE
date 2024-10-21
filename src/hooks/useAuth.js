import { useEffect } from "react";
import { useDispatch } from "react-redux";


import api from "../config/api";
import { login } from "../pages/redux/features/userSlice";



const useAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Giả sử bạn có một cách để lấy accountId từ token hoặc từ localStorage
      const accountId = localStorage.getItem("accountId"); // Lưu accountId khi đăng nhập thành công

      const fetchUserData = async () => {
        try {
          const response = await api.get(`account/${accountId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          dispatch(login(response.data)); // Cập nhật trạng thái người dùng
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    }
  }, [dispatch]);
};

export default useAuth;
