import "./index.scss";
import ModalEditUser from "./EditUserModal";
import logo from "/public/images/logo.svg";
import { useSelector } from "react-redux";

const UserInfoPage = () => {
  const user = useSelector((state) => state.user);
  console.log(user);


 

  return (

    <div className="user-info">

        <div className="userinfo__container">
          <div className="userinfo__logo">
            <img src={logo} alt="User Avatar" className="userinfo__avatar" />
          </div>
          <div className="userinfo__details">
            <div className="userinfo__item">
              <span className="userinfo__label">Họ và tên:</span> {user.account.fullName}
            </div>
            <div className="userinfo__item">
              <span className="userinfo__label">Địa chỉ:</span> {user.account.address}
            </div>
            <div className="userinfo__item">
              <span className="userinfo__label">Email:</span> {user.account.email}
            </div>
            <div className="userinfo__item">
              <span className="userinfo__label">Số điện thoại:</span> {user.account.phoneNumber}
            </div>
            <div className="userinfo__item">
              <span className="userinfo__label">Số dư:</span> {user.account.accountBalance.toFixed(2)}
            </div>
            <ModalEditUser userData={user} title="Thay đổi thông tin cá nhân" />
          </div>
        </div>

      </div>

  );
};

export default UserInfoPage;
