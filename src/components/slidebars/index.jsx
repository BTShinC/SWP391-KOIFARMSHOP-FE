import { Link } from "react-router-dom";
import { Button } from "antd"; // Nhập Button từ Ant Design
import "./index.scss";
import { CloseCircleOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

const Sidebar = ({ isOpen, onClose }) => {
  const user = useSelector((state) => state.user); 

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
              {user.fullName}</p> {/* Display user's full name */}
              <p>Số dư tài khoản: <br/>
              {user.accountBalance} VND</p> {/* Display account balance */}
            </div>
          </li>
        )}
        {!user && (
        <li>
          <Link to="/register" onClick={onClose}>Đăng ký</Link>
        </li>
        )}
        <li>
          <Link to="/userinfo" onClick={onClose}>
            Cập nhật thông tin
          </Link>
        </li>
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
  isOpen: PropTypes.func,
  onClose: PropTypes.func,
};

export default Sidebar;
