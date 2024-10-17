import "./index.scss";
import ModalEditUser from "./EditUserModal";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const UserInfoPage = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(user.account); // Tạo state để lưu thông tin người dùng

  useEffect(() => {
    if (!user || !user.account) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Hàm cập nhật thông tin người dùng
  const handleUserChange = (updatedUserData) => {
    setUserInfo(updatedUserData); // Cập nhật lại state khi có thay đổi
  };

  return user && user.account ? (
    <div className="user-info">
      <div className="userinfo__container">
        {/* Phần logo và ảnh đại diện */}
        <div className="userinfo__logo">
          <img
            src={userInfo.image}
            alt="User Avatar"
            className="userinfo__avatar"
          />
        </div>

        {/* Phần thông tin chi tiết */}
        <div className="userinfo__details">
          <div className="userinfo__item">
            <span className="userinfo__label">Họ và tên:</span>{" "}
            {userInfo.fullName}
          </div>
          <div className="userinfo__item">
            <span className="userinfo__label">Địa chỉ:</span> {userInfo.address}
          </div>
          <div className="userinfo__item">
            <span className="userinfo__label">Email:</span> {userInfo.email}
          </div>
          <div className="userinfo__item">
            <span className="userinfo__label">Số điện thoại:</span>{" "}
            {userInfo.phoneNumber}
          </div>
          <div className="userinfo__item">
            <span className="userinfo__label">Số dư tài khoản:</span>{" "}
            {userInfo.accountBalance.toFixed(2)} VND
          </div>

          {/* Nút sửa thông tin */}
          <ModalEditUser
            userData={userInfo}
            title="Thay đổi thông tin cá nhân"
            onChange={handleUserChange} // Truyền hàm onChange vào Modal
          />
        </div>
      </div>
    </div>
  ) : null;
};

export default UserInfoPage;
