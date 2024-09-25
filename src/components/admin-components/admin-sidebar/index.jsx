import { useLocation, useNavigate } from "react-router-dom";
import "./index.scss";

function AdminSideBar() {
  const location = useLocation();
  const navigate = useNavigate(); // Sử dụng hook useNavigate để điều hướng

  // Hàm điều hướng khi người dùng nhấp vào các mục
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <>
      <div className="admin-sidebar">
        <div className="sidebar__logo-container">
          <img
            src="/public/images/logo.svg"
            alt="Logo"
            className="sidebar__logo"
          />
        </div>
        <div
          className={`sidebar__item ${
            location.pathname === "/admin" ? "active" : ""
          }`}
          onClick={() => handleNavigation("/admin")}
        >
          <span className="sidebar__icon">⌘</span>
          Hồ sơ khách hàng
        </div>
        <div
          className={`sidebar__item ${
            location.pathname === "/managefish" ? "active" : ""
          }`}
          onClick={() => handleNavigation("/managefish")}
        >
          <span className="sidebar__icon">⌘</span>
          Quản lý giống cá
        </div>
        <div
          className={`sidebar__item ${
            location.pathname === "/orders" ? "active" : ""
          }`}
          onClick={() => handleNavigation("/orders")}
        >
          <span className="sidebar__icon">⌘</span>
          Quản lý đơn hàng
        </div>
        <div
          className={`sidebar__item ${
            location.pathname === "/reports" ? "active" : ""
          }`}
          onClick={() => handleNavigation("/reports")}
        >
          <span className="sidebar__icon">⌘</span>
          Báo cáo và thống kê
        </div>
        <div
          className="sidebar__logout"
          onClick={() => handleNavigation("/logout")}
        >
          Đăng xuất
        </div>
      </div>
    </>
  );
}

export default AdminSideBar;
