
import { useSelector } from "react-redux";
import UserAvatar from "../user-avatar";
import "./index.scss";
function AdminHeader() {
  const user = useSelector((state) => state?.user?.account)
  return (
    <div className="content__header">
      <div className="content__welcome">
        <h3>Xin chào {user ? user.fullName : "User"}!</h3>{" "}
        {/* Kiểm tra giá trị userName */}
        <span>Chào mừng trở lại {user ? user.fullName : "User"} </span>
      </div>
      <div className="admin-info">
        <div className="admin-info__avatar">

          <UserAvatar></UserAvatar>
        </div>
        <div className="admin-info__details">
          <span className="admin-info__name">
            {user ? user.fullName : "User"}
          </span>
          <span className="admin-info__role">Admin</span>

        </div>
      </div>
    </div>
  );
}

export default AdminHeader;
