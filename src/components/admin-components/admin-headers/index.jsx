import { useSelector } from "react-redux";
import UserAvatar from "../user-avatar";
import { Typography } from "antd";
import "./index.scss";

const { Title, Text } = Typography;

function AdminHeader() {
  const user = useSelector((state) => state?.user);

  return (
    <div className="content__header">
      <div className="content__welcome">
        <Title level={3}>Xin chào, {user ? user.fullName : "User"}</Title>
        <Text type="secondary">Chào mừng trở lại!</Text>
      </div>
      <div className="admin-info">
        <div className="admin-info__avatar">
          {/* Keeping UserAvatar component */}
          <UserAvatar />
        </div>
        <div className="admin-info__details">
          <Text strong className="admin-info__name">
            {user ? user.fullName : "User"}
          </Text>
          <Text type="secondary" className="admin-info__role">
            {user?.roleName === "Admin" && <span>Quản trị viên</span>}
            {user?.roleName === "Staff" && <span>Nhân viên</span>}
            {user?.roleName === "Customer" && <span>Khách hàng</span>}
          </Text>
        </div>
      </div>
    </div>
  );
}

export default AdminHeader;
