import { Link, useNavigate } from "react-router-dom";
import { Button } from "antd"; // Nhập Button từ Ant Design
import "./index.scss";
import { CloseCircleOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../pages/redux/features/userSlice";
import { toast } from "react-toastify";

const Sidebar = ({ isOpen, onClose }) => {
  // Function to format the account balance
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch(); // Khai báo useDispatch để sử dụng action
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

  const handleLogout = async () => {
    try {
      // Gọi API logout nếu backend yêu cầu
      // await api.post('/logout'); // Thay đổi endpoint nếu cần

      // Xóa token khỏi localStorage
      localStorage.removeItem("token"); // Sửa lại từ localStorage.data.removeItem

      // Xóa trạng thái người dùng trong Redux
      dispatch(logout());

      toast.success("Đăng xuất thành công!");
      navigate("/login"); // Chuyển hướng đến trang đăng nhập sau khi đăng xuất
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
              <p>
                Chào mừng, <br />
                {user.fullName}
              </p>{" "}
              {/* Display user's full name */}
              <p>
                Số dư tài khoản: <br />
                {formatCurrency(user.accountBalance)} VND
                {/* Display formatted account balance */}
              </p>
            </div>
            {user &&
              user.roleName === "Admin" && ( // Show admin button if user is an admin
                <li>
                  <Link to="/admin" onClick={onClose}>
                    <Button className="adminpage-button" type="primary">Quản lý</Button>
                  </Link>
                </li>
              )}
          </li>
        )}
        {!user && (
          <li>
            <Link to="/register" onClick={onClose}>
              Đăng ký
            </Link>
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
            <Button onClick={handleLogout} type="link">
              Đăng xuất
            </Button>
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
