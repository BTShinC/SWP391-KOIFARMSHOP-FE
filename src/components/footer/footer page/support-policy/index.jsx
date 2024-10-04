import logo from '/public/logo.svg'
import "./index.scss";
import Header from '../../../header';
import Footer from '../..';


function SupportPolicy() {
    return (
        <div>
            <div className="support-policy-page">
                <Header/>
                <div className="banner-wraper">
                    <div className="banner-container">
                        <img src={logo} alt="Logo" className="logo" />
                        <h2 className="shop-name">Giúp đỡ</h2>
                    </div>
                </div>
                <div className="page-content">
                    <p className="content">
                        Koifish luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi để đảm bảo trải nghiệm mua sắm của bạn hoàn hảo.
                    </p>
                    <p className="content">
                        Chúng tôi hiểu rằng việc mua cá Koi không chỉ đơn giản là chọn một sản phẩm, mà còn là một quá trình cần sự tư vấn kỹ lưỡng về giống cá, cách chăm sóc và vận chuyển. Để hỗ trợ bạn tốt hơn, chúng tôi cung cấp nhiều kênh liên lạc tiện lợi:
                    </p>
                    <h1 className="title-1">1. Hỗ trợ qua số điện thoại</h1>
                    <p className="content">
                        Đội ngũ hỗ trợ của Koifish sẵn sàng giải đáp mọi thắc mắc của bạn qua số số điện thoại 0967838745 từ 9:00 đến 21:00 hàng ngày. Chúng tôi cam kết sẽ giải quyết nhanh chóng mọi vấn đề liên quan đến đặt hàng, thanh toán, và hỗ trợ sau mua.
                    </p>
                    <h1 className="title-1">2. Trang liên hệ</h1>
                    <p className="content">
                        Bạn có thể truy cập trang liên hệ ngay trên website để trò chuyện với nhân viên hỗ trợ của chúng tôi. Họ sẽ cung cấp tư vấn chuyên sâu về mọi thắc mắc của quý khách, Đội ngũ của chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc..
                    </p>
                </div>
                <Footer/>
            </div>
        </div>
    );
}

export default SupportPolicy;