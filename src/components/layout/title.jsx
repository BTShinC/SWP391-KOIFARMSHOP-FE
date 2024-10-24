
import Header from "../header";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../footer";
import Banner from "../banner";
import e from "cors";

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
    title = "Cá Koi Nhật";
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
    title = "Cá Koi Nhật";
  }else if (location.pathname === "/orderTracking") {
    title = "Theo dõi đơn hàng";
  }else if (location.pathname === "/consignmentTracking") {
    title = "Theo dõi ký gửi";
  }else if (location.pathname === "/checkout") {
    title = "Thanh toán";
  }else if (location.pathname === "/orderSuccess") {
    title = "Đặt hàng thành công";
  }else if (location.pathname === "/consignmentSuccess") {
    title = "Ký gửi thành công";
  }else if (location.pathname === "/vnPayResponse") {
    title = "Giao dịch";
  }else if (location.pathname === "/consignmentFrom") {
    title = "Ký gửi";
  }else if (location.pathname === "/consignmentPayment") {
    title = "Thanh toán";
  }else if (location.pathname === "/consignmentSellPayment") {  
    title = "Thanh toán";
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