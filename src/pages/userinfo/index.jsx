import "./index.scss";
import ModalEditUser from "./EditUserModal";
import { Container } from "react-bootstrap";
import logo from "/public/images/logo.svg";
import { useSelector } from "react-redux";

const UserInfoPage = () => {
  const user = useSelector((state) => state.user);


 

  return (
    <div>
      <Container>
        <div className="userinfo__container">
          <div className="userinfo__logo">
            <img src={logo} alt="User Avatar" className="userinfo__avatar" />
          </div>
          <div className="userinfo__details">
            <div className="userinfo__item">
              <span className="userinfo__label">Họ và tên:</span> {user.fullName}
            </div>
            <div className="userinfo__item">
              <span className="userinfo__label">Địa chỉ:</span> {user.address}
            </div>
            <div className="userinfo__item">
              <span className="userinfo__label">Email:</span> {user.email}
            </div>
            <div className="userinfo__item">
              <span className="userinfo__label">Số điện thoại:</span> {user.phoneNumber}
            </div>
            <div className="userinfo__item">
              <span className="userinfo__label">Số dư:</span> {user.accountBalance.toFixed(2)}
            </div>
            <ModalEditUser userData={user} title="Thay đổi thông tin cá nhân" />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default UserInfoPage;
