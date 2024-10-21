import "./index.scss";
import ModalEditUser from "./EditUserModal";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useEffect } from "react"; // Import useEffect

const UserInfoPage = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate(); // Khởi tạo useNavigate
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};



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
            src="/public/images/a.jpg"
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
              <span className="userinfo__label">Số dư:</span> {formatCurrency(user?.accountBalance)}VND
            </div>

          </div>
          <ModalEditUser
            userData={user}
            title="Thay đổi thông tin cá nhân"
          />
        </div>
      </div>
    </div>
  ) : null; // Không render gì nếu chưa đăng nhập, chỉ điều hướng
};

export default UserInfoPage;
