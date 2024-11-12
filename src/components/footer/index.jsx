import { Link } from "react-router-dom"
import "./index.scss"
// import PrivacyPolicy from "./footerpage/privacy-policy"
// import OrderPolicy from "./footerpage/order-policy"

function Footer() {
  return (
    <div className="footer">
        <div className="footer__contact">
            <div className="footer__address__shopname">Koifish</div>
            <div className="footer__address__address">Địa chỉ xem cá Koi: Số 10 ngách 54, ngõ 76 An Dương, Q. Tây Hồ, Hà Nội</div>
            <div className="footer__address__phonenumber">SDT: 0967838745</div> 
        </div>
        <div className="footer__nav">
        <ul>
          <li>
            <Link to="/">Trang chủ</Link>
          </li>
          <li>
            <Link to="/about">Giới thiệu</Link>
          </li>
          <li>
            <Link to="/blog">Tin tức</Link>
          </li>
          <li>
            <Link to="/contact">Liên hệ</Link>
          </li>
        </ul>
        </div>
        <div className="footer__help">
        <ul>
          <li>
            <Link to="/privacy-policy">Chính sách bảo mật</Link>
          </li>
          <li>
            <Link to="/support-policy">Giúp đỡ</Link>
          </li>
          <li>
            <Link to="/order-policy">Hướng dẫn mua hàng</Link>
          </li>
          <li>
            <Link to="/refund-policy">Chính sách đổi trả</Link>
          </li>
        </ul>
        </div>
    </div>
  )
}

export default Footer