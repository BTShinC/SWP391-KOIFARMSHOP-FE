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
          <span>Hồ sơ khách hàng</span>
        </div>
        <div
          className={`sidebar__item ${
            location.pathname === "/managefish" ? "active" : ""
          }`}
          onClick={() => handleNavigation("/managefish")}
        >
          <span className="sidebar__icon">⌘</span>
          <span>Quản lý giống cá </span>
        </div>
        <div
          className={`sidebar__item ${
            location.pathname === "/manageProductCombo" ? "active" : ""
          }`}
          onClick={() => handleNavigation("/manageProductCombo")}
        >
          <span className="sidebar__icon">⌘</span>
          <span>Quản lý lô cá</span>
        </div>
        <div
          className={`sidebar__item ${
            location.pathname === "/manageConsignment" ? "active" : ""
          }`}
          onClick={() => handleNavigation("/manageConsignment")}
        >
          <span className="sidebar__icon">⌘</span>
          <span> Quản lý ký gửi</span>
        </div>
        <div
          className={`sidebar__item ${
            location.pathname === "/manageOrder" ? "active" : ""
          }`}
          onClick={() => handleNavigation("/manageOrder")}
        >
          <span className="sidebar__icon">⌘</span>
          <span>Quản lý đơn hàng</span>
        </div>
        <div
          className={`sidebar__item ${
            location.pathname === "/members" ? "active" : ""
          }`}
          onClick={() => handleNavigation("/members")}
        >
          <span className="sidebar__icon">⌘</span>
          <span>Thành viên</span>
        </div>
        <div
          className={`sidebar__item ${
            location.pathname === "/reports" ? "active" : ""
          }`}
          onClick={() => handleNavigation("/reports")}
        >
          <span className="sidebar__icon">⌘</span>
          <span> Báo cáo và thống kê</span>
        </div>
        <div
          className="sidebar__logout"
          onClick={() => handleNavigation("/logout")}
        >
          <span>Đăng xuất</span>
        </div>
      </div>
    </>
  );
}

export default AdminSideBar;
