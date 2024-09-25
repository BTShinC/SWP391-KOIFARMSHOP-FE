import { Link } from "react-router-dom";
import "./index.scss";

function AdminSideBar() {
  return (
    <>
      <div className="sidebar">
        <div className="sidebar__logo-container">
          <img src="/public/images/logo.svg" alt="Logo" className="sidebar__logo" />
        </div>
        <div className="sidebar__item active">
          <span className="sidebar__icon">⌘</span>
          <Link to="">Hồ sơ khách hàng</Link>
        </div>
        <div className="sidebar__item">
          <span className="sidebar__icon">⌘</span>
          <Link to="">Quản lý giống cá</Link>
        </div>
        <div className="sidebar__item">
          <span className="sidebar__icon">⌘</span>
          <Link to="">Quản lý đơn hàng</Link>
        </div>
        <div className="sidebar__item">
          <span className="sidebar__icon">⌘</span>
          <Link to="">Quản lý đơn ký gửi</Link>
        </div>
        <div className="sidebar__item">
          <span className="sidebar__icon">⌘</span>
          <Link to="">Báo cáo và thông kê</Link>
        </div>
        <div className="sidebar__logout">
          <Link to="/logout">Đăng xuất</Link>
        </div>
      </div>
    </>
  );
}
export default AdminSideBar;
