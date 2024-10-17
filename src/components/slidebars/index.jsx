import { Link, useNavigate } from "react-router-dom";
import { Button } from "antd"; // Nhập Button từ Ant Design
import "./index.scss";
import { CloseCircleOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../pages/redux/features/userSlice";

const Sidebar = ({ isOpen, onClose }) => {
  const user = useSelector((state) => state.user); 
  const dispatch = useDispatch(); // Khai báo useDispatch để sử dụng action
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng


  const handleLogout = async () => {
    try {
      // Gọi API logout nếu backend yêu cầu
      // await api.post('/logout'); // Thay đổi endpoint nếu cần

      // Xóa trạng thái người dùng trong Redux
      dispatch(logout()); 
      // Xóa token khỏi localStorage
      localStorage.data.removeItem("token"); 
      // Điều hướng về trang chủ sau khi đăng xuất
      navigate("/"); 
    } catch (error) {
      console.error("Logout failed:", error);
      // Có thể hiển thị thông báo lỗi cho người dùng ở đây
    }
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
            <Button onClick={handleLogout} type="link" onClick={onClose}>
              Đăng xuất
            </Button>
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
