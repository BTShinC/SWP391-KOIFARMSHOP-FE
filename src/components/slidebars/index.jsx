import { Link } from "react-router-dom";
import { Button } from "antd"; // Nhập Button từ Ant Design
import "./index.scss";
import { CloseCircleOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

const Sidebar = ({ isOpen, onClose }) => {
  const user = useSelector((state) => state.user);
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <Button
        className="sidebar__close"
        onClick={onClose}
        type="link"
        icon={<CloseCircleOutlined />}
      />
      <ul>
        {!user && (
          <>
            <li>
              <Link to="/login" onClick={onClose}>
                Đăng nhập
              </Link>
            </li>
            <li>
              <Link to="/register" onClick={onClose}>
                Đăng ký
              </Link>
            </li>
          </>
        )}

        <li>
          <Link to="/userinfo" onClick={onClose}>
            Cập nhật thông tin
          </Link>
        </li>

        <li>
          <Link to="/logout" onClick={onClose}>
            Đăng xuất
          </Link>
        </li>
      </ul>
    </div>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.func,
  onClose: PropTypes.func,
};

export default Sidebar;
