
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
  }else if (location.pathname === "/shoppingcart") {
    title = "Giỏ hàng";
  }else if (location.pathname === "/product") {
    title = "Cá koi Nhật";
  }else if (location.pathname === "/privacy-policy") {
    title = "Chính sách bảo mật";
  }else if (location.pathname === "/support-policy") {
    title = "Hỗ trợ";
  }else if (location.pathname === "/order-policy") {
    title = "Hỗ trợ mua hàng";
  }else if (location.pathname === "/refund-policy") {
    title = "Chính sách đổi trả";
  }else if (location.pathname === "/blog") {
    title = "Tin tức";
  }else if (location.pathname === "/wallet") {
    title = "Ví tiền";
  }else if (location.pathname === "/productcombo") {
    title = "Lô cá Koi";
  }else if (location.pathname === "/orderTracking") {
    title = "Theo dõi đơn hàng";
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