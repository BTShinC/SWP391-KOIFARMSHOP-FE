import "./index.scss";
import ModalEditUser from "./EditUserModal";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useEffect } from "react"; // Import useEffect

const UserInfoPage = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate(); // Khởi tạo useNavigate

  useEffect(() => {
    if (!user || !user.account) {
      // Kiểm tra nếu chưa đăng nhập, điều hướng đến trang đăng nhập
      navigate("/login"); // Chuyển hướng đến trang login
    }
  }, [user, navigate]);

  return user && user.account ? (
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
          <div className="userinfo__item">
            <span className="userinfo__label">Họ và tên:</span>{" "}
            {user.account.fullName}
          </div>
          <div className="userinfo__item">
            <span className="userinfo__label">Địa chỉ:</span>{" "}
            {user.account.address}
          </div>
          <div className="userinfo__item">
            <span className="userinfo__label">Email:</span> {user.account.email}
          </div>
          <div className="userinfo__item">
            <span className="userinfo__label">Số điện thoại:</span>{" "}
            {user.account.phoneNumber}
          </div>
          <div className="userinfo__item">
            <span className="userinfo__label">Số dư:</span> $
            {user.account.accountBalance.toFixed(2)}
          </div>
          <ModalEditUser
            userData={user.account}
            title="Thay đổi thông tin cá nhân"
          />
        </div>
      </div>
    </div>
  ) : null; // Không render gì nếu chưa đăng nhập, chỉ điều hướng
};

export default UserInfoPage;
