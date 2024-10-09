import { Link } from "react-router-dom";
import { SearchOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useState } from "react";
import "./index.scss";
import Sidebar from "../slidebars";
import { useSelector } from "react-redux";
import UserAvatar from "../admin-components/user-avatar";
function Header() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const user = useSelector((state) => state.user);
  console.log(user);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <header className="header">
      <div className="header__logo">
        <div className="logo">
          <img src="/images/logo.svg" alt="Logo" />
        </div>
        <div className="name">
          <div className="shopname">Koifish</div>
        </div>
      </div>

      <div className="header__nav">
        <ul>
          <li>
            <Link to="/">Trang chủ</Link>
          </li>
          <li>
            <Link to="/about">Giới thiệu</Link>
          </li>
          <li>
            <Link to="/product">Cá Koi Nhật</Link>
          </li>
          <li>
            <Link to="/consignment">Ký gửi</Link>
          </li>
          <li>
            <Link to="/blog">Tin tức</Link>
          </li>
          <li>
            <Link to="/contact">Liên hệ</Link>
          </li>
        </ul>
      </div>

      <div className="header__icon">
        <ul>
          {user && (
            <li className="userName">
              <span>{user.userName}</span>
              <div>{user.accountBalance} VND</div>
            </li>
          )}
          <li>
            <Link to="#" onClick={toggleSidebar}>
            <UserAvatar></UserAvatar>
            </Link>
          </li>
          <li>
            <Link to="/">
              <SearchOutlined />
            </Link>
          </li>
          <li>
            <Link to="/shoppingcart">
              <ShoppingCartOutlined />
            </Link>
          </li>
        </ul>
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
    </header>
  );
}

export default Header;
