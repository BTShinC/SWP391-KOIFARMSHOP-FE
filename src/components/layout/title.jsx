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
  }else if (location.pathname === "/product") {
    title = "Cá Koi Nhật";
  } else if (location.pathname === "/privacy-policy") {
    title = "Chính sách bảo mật";
  } else if (location.pathname === "/support-policy") {
    title = "Chính sách hỗ trợ";
  } else if (location.pathname === "/order-policy") {
    title = "Chính sách đặt hàng";
  } else if (location.pathname === "/refund-policy") {
    title = "Chính sách hoàn tiền";
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