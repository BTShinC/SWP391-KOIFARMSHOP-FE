// import { useSelector } from "react-redux";
import "./index.scss";
function AdminHeader() {
  // const user = useSelector((state) => state.user)
  const user = "Tai";
  return (
    <div className="content__header">
      <div className="content__welcome">
        <h3>Xin chào {user ? user.userName : 'User'}!</h3> {/* Kiểm tra giá trị userName */}
        <span>Chào mừng trở lại</span>
      </div>
      <div className="admin-info">
        <div className="admin-info__avatar">
          <img className="avatar-placeholder" src="/images/logo.svg" alt="User Avatar" /> {/* Cập nhật đường dẫn hình ảnh */}
        </div>
        <div className="admin-info__details">      
          <span className="admin-info__name">{user.userName}</span>
          <span className="user-info__role">Admin</span>
        </div>
      </div>
    </div>
  );
}

export default AdminHeader;
