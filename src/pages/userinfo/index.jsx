
import "./index.scss";
import Header from '../../components/header';

const UserInfoPage = () => {
  
  const user = {
    fullName: "John Doe",
    address: "123 Main St, Anytown, USA",
    email: "john.doe@example.com",
    phoneNumber: "(555) 123-4567",
    accountBalance: 5000.00
  };

  return (
    <div>
      <Header />

          <div className="userinfo-container">
      <h2>Thông tin người dùng</h2>
      <div className="userinfo-item">
        <span>Tên:</span> {user.fullName}
      </div>
      <div className="userinfo-item">
        <span>Địa chỉ:</span> {user.address}
      </div>
      <div className="userinfo-item">
        <span>Email:</span> {user.email}
      </div>
      <div className="userinfo-item">
        <span>Số điện thoại:</span> {user.phoneNumber}
      </div>
      <div className="userinfo-item">
        <span>Số dư:</span> ${user.accountBalance.toFixed(2)}
      </div>
    </div>

    </div>

  );
};

export default UserInfoPage;