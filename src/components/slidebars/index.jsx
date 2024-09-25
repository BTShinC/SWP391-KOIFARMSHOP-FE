import React from 'react';
import { Link } from 'react-router-dom';
import { Button} from 'antd'; // Nhập Button từ Ant Design
import './index.scss';
import { CloseCircleOutlined } from '@ant-design/icons';

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <Button className="sidebar__close" onClick={onClose} type="link" icon={<CloseCircleOutlined />} />
      <ul>
        <li>
          <Link to="/login" onClick={onClose}>Đăng nhập</Link>
        </li>
        <li>
          <Link to="/register" onClick={onClose}>Đăng ký</Link>
        </li>
        <li>
          <Link to="/logout" onClick={onClose}>Đăng xuất</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
