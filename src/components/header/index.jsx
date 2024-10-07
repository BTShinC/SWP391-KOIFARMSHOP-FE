import { Link } from "react-router-dom";
import { SearchOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useState } from "react";
import "./index.scss";
import Sidebar from "../slidebars";
import { useSelector } from "react-redux";
import { Avatar, Badge } from "@mui/material";
import { styled } from "@mui/material/styles";

// Tùy chỉnh Badge để hiển thị dot
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

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
            <Link to="/">Ký gửi</Link>
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
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot" // Đây là phần quan trọng để hiển thị dot
              >
                <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
              </StyledBadge>
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
