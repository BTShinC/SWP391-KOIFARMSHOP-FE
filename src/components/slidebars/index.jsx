import { Link, useNavigate } from "react-router-dom";
import { Button } from "antd"; // Nhập Button từ Ant Design
import "./index.scss";
import { CloseCircleOutlined, ToolOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../pages/redux/features/userSlice";
import { useEffect, useState } from "react"; // Import useEffect and useState
import axios from "axios"; // Import axios for API calls

const Sidebar = ({ isOpen, onClose }) => {
  const [accountBalance, setAccountBalance] = useState(0); // Local state for account balance
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch(); // Khai báo useDispatch để sử dụng action
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

  // Function to format the account balance
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Fetch account balance from API when the component mounts
  useEffect(() => {
    const fetchAccountBalance = async () => {
      if (user && user.account && user.account.accountID) {
        try {
          const response = await axios.get(`http://103.90.227.69:8080/api/account/${user.account.accountID}`);
          setAccountBalance(response.data.accountBalance); // Set the fetched balance
        } catch (error) {
          console.error("Error fetching account balance:", error);
        }
      }
    };

    fetchAccountBalance();
  }, [user]);

  const handleLogout = async () => {
    try {
      // Gọi API logout nếu backend yêu cầu
      // await api.post('/logout'); // Thay đổi endpoint nếu cần

      // Xóa trạng thái người dùng trong Redux
      dispatch(logout());
      // Xóa token khỏi localStorage
      localStorage.removeItem("token");
      // Điều hướng về trang chủ sau khi đăng xuất
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // Có thể hiển thị thông báo lỗi cho người dùng ở đây
    }
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-wrapper">
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
                <p>Chào mừng, <br />
                  {user.account.fullName}</p> {/* Display user's full name */}
                <p>Số dư tài khoản: <br />
                  {formatCurrency(accountBalance)} VND{/* Display formatted account balance */}</p>
                {user && user.account.roleName === "Admin" && ( // Show admin button if user is an admin
                  <Link to="/admin" onClick={onClose}>
                    <Button className="adminpage-button"><ToolOutlined />Quản lý</Button>
                  </Link>
                )}
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
              <Link to="/orderTracking" onClick={onClose}>
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
              <Button onClick={handleLogout} type="link" onClick={onClose}>
                Đăng xuất
              </Button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired, // Change to bool
  onClose: PropTypes.func.isRequired,
};

export default Sidebar;
