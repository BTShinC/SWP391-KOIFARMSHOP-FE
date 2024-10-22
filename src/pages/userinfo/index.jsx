import "./index.scss";
import ModalEditUser from "./EditUserModal";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useEffect } from "react"; // Import useEffect
import { setUser } from "../redux/features/userSlice";

const UserInfoPage = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch(); // Khởi tạo dispatch
  const navigate = useNavigate(); // Khởi tạo useNavigate
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
  };

  // Hàm xử lý khi thay đổi thông tin người dùng
  const handleUserInfoChange = (updatedUser) => {
    // Dispatch hành động cập nhật Redux store với thông tin mới
    dispatch(setUser(updatedUser));
  };

  // Nếu không có user, chuyển hướng về trang login
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return user ? (
    <div className="user-info">
      <div className="userinfo__container">
        <div className="userinfo__logo">
          <img
            src={user?.image || "/public/images/a.jpg"}
            alt="User Avatar"
            className="userinfo__avatar"
          />
        </div>
        <div className="userinfo__details">
          <div className="userinfo__details">
            <div className="userinfo__item">
              <span className="userinfo__label">Họ và tên:</span> {user?.fullName}
            </div>
            <div className="userinfo__item">
              <span className="userinfo__label">Địa chỉ:</span> {user?.address}
            </div>
            <div className="userinfo__item">
              <span className="userinfo__label">Email:</span> {user?.email}
            </div>
            <div className="userinfo__item">
              <span className="userinfo__label">Số điện thoại:</span> {user?.phoneNumber}
            </div>
            <div className="userinfo__item">
              <span className="userinfo__label">Số dư:</span> {formatCurrency(user?.accountBalance)} VND
            </div>
          </div>
          <ModalEditUser
            userData={user}
            title="Thay đổi thông tin cá nhân"
            onChange={handleUserInfoChange} 
          />
        </div>
      </div>
    </div>
  ) : null;
};

export default UserInfoPage;
