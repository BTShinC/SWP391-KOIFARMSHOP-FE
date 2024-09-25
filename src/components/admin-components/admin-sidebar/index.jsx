import { Link, useLocation } from "react-router-dom";
import "./index.scss";

function AdminSideBar() {
  const location = useLocation();

  return (
    <>
      <div className="admin-sidebar">
        <div className="sidebar__logo-container">
          <img src="/public/images/logo.svg" alt="Logo" className="sidebar__logo" />
        </div>
        <div className={`sidebar__item ${location.pathname === "/admin" ? "active" : ""}`}>
          <span className="sidebar__icon">⌘</span>
          <Link to="/admin">Hồ sơ khách hàng</Link>
        </div>
        <div className={`sidebar__item ${location.pathname === "/managefish" ? "active" : ""}`}>
          <span className="sidebar__icon">⌘</span>
          <Link to="/managefish">Quản lý giống cá</Link>
        </div>
        <div className={`sidebar__item ${location.pathname === "/orders" ? "active" : ""}`}>
          <span className="sidebar__icon">⌘</span>
          <Link to="">Quản lý đơn hàng</Link>
        </div>
        <div className={`sidebar__item ${location.pathname === "/reports" ? "active" : ""}`}>
          <span className="sidebar__icon">⌘</span>
          <Link to="">Báo cáo và thông kê</Link>
        </div>
        <div className="sidebar__logout">
          <Link to="">Đăng xuất</Link>
        </div>
      </div>
    </>
  );
}

export default AdminSideBar;
