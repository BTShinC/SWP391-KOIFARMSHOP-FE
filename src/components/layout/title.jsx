
import Header from "../header";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../footer";
import Banner from "../banner";

function LayoutTitle() {

    const location = useLocation(); 

  
  let title = "Trang"; // Tiêu đề mặc định
  if (location.pathname === "/about") {
    title = "Giới thiệu";
  } else if (location.pathname === "/contact") {
    title = "Liên hệ";
  } else if (location.pathname === "/userinfo") {
    title = "Thông tin người dùng";
  }else if (location.pathname === "/compare") {
    title = "So sánh cá";
  }

  return (
    <>
      <Header />

      <Banner title={title}/>

      <Outlet />

      <Footer />
    </>
  );
}

export default LayoutTitle;