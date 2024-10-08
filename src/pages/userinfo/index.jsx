import "./index.scss";
import ModalEditUser from "./EditUserModal";
import logo from "/public/images/logo.svg";


const UserInfoPage = () => {
  const user = {
    fullName: "John Doe",
    address: "123 Main St, Anytown, USA",
    email: "john.doe@example.com",
    phoneNumber: "(555) 123-4567",
    accountBalance: 5000.0,
    roleID:3
  };

  return (

    <div className="user-info">

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
              <span className="userinfo__label">Số dư:</span> ${user.accountBalance.toFixed(2)}
            </div>
              <ModalEditUser userData={user} title = "Thay đổi thông tin cá nhân" />
          </div>
        </div>

      </div>

  );
};
export default UserInfoPage;
