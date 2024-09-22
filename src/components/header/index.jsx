import { Link } from "react-router-dom";
import logo from "swp391-koifarmshop-fe/public/images/logo.svg"

import {
  SearchOutlined,
  UserOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";

import "./index.scss";

function Header() {
  return (
    <header className="header">

      <div className="header__logo">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>

        <div className="name">
          <div className="shopname">Koifish</div>
        </div>
       
      </div>

      <div className="header__nav">
        <ul>
          <li>
            <Link to="/home">Trang chủ</Link>
          </li>
          <li>
            <Link to="/">Giới thiệu</Link>
          </li>
          <li>
            <Link to="/">Cá Koi Nhật</Link>
          </li>
          <li>
            <Link to="/">Ký gửi</Link>
          </li>
          <li>
            <Link to="/">Tin tức</Link>
          </li>
          <li>
            <Link to="/">Liên hệ</Link>
          </li>
        </ul>
      </div>

      <div className="header__icon">
        <ul>
          <li>
            <Link to="/login">
              <UserOutlined />
            </Link>
          </li>
          <li>
            <Link to="/">
              <SearchOutlined />
            </Link>
          </li>
          <li>
            <Link to="/">
              <ShoppingCartOutlined />
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
