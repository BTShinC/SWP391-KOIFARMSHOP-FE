import { Link } from "react-router-dom";
import { Button } from "antd"; // Nhập Button từ Ant Design
import "./index.scss";
import { CloseCircleOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

const Sidebar = ({ isOpen, onClose }) => {
  // Example of accessing user data
const user = useSelector((state) => state.user);
console.log("Current User:", user);

  // Function to format the account balance
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <Button
        className="sidebar__close"
        onClick={onClose}
        type="link"
        icon={<CloseCircleOutlined />}
      />
      <ul>
        {!user ? (
          <li>
            <Link to="/login" onClick={onClose}>
              Đăng nhập
            </Link>
          </li>
        ) : (
          <li>
            <div className="welcome-message">
              <p>Chào mừng, <br/>
              {user.account.fullName}</p> {/* Display user's full name */}
              <p>Số dư tài khoản: <br/>
              {formatCurrency(user.account.accountBalance)} VND{/* Display formatted account balance */}</p>
            </div>
          </li>
        )}
        {!user && (
        <li>
          <Link to="/register" onClick={onClose}>Đăng ký</Link>
        </li>
        )}
        {user && ( // Show logout link only if user is logged in
          <li>
            <Link to="/userinfo" onClick={onClose}>
              Cập nhật thông tin
            </Link>
          </li>
        )}
        {user && ( // Show logout link only if user is logged in
          <li>
            <Link to="/" onClick={onClose}>
              Trạng thái đơn hàng
            </Link>
          </li>
        )}
        {user && ( // Show logout link only if user is logged in
          <li>
            <Link to="/" onClick={onClose}>
              Trạng thái ký gửi
            </Link>
          </li>
        )}
        {user && ( // Show logout link only if user is logged in
          <li>
            <Link to="/wallet" onClick={onClose}>
              Nạp tiền
            </Link>
          </li>
        )}
        {user && ( // Show logout link only if user is logged in
          <li>
            <Link to="/logout" onClick={onClose}>
              Đăng xuất
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired, // Change to bool
  onClose: PropTypes.func.isRequired,
};

export default Sidebar;
