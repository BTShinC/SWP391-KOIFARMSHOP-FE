

import logo from '/public/images/logo.svg'
import "./index.scss";
import Header from '../header';
import Footer from '/src/components/footer/index'

function AboutPage() {
    return (
        <div>
            <Header />
            <div className="about">
                <div className="banner-wraper">
                    <div className="banner-container">
                        <img src={logo} alt="Logo" className="logo" />
                        <h2 className="shop-name">Giới thiệu</h2>
                    </div>
                </div>
                <div className="page-content">
                <h1 className="title">Lịch sử và mục tiêu phát triển</h1>
                <p className="content">
                    Koifish được thành lập vào năm  2015, bắt đầu với niềm đam mê cá Koi và mong muốn mang đến những chú cá Koi thuần chủng, chất lượng cao từ Nhật Bản. Qua nhiều năm phát triển, chúng tôi đã mở rộng quy mô hoạt động, xây dựng mối quan hệ vững chắc với các trang trại cá Koi nổi tiếng tại Nhật Bản và không ngừng cải thiện dịch vụ để phục vụ khách hàng tốt nhất.<br></br>
                    Với mục tiêu trở thành nhà cung cấp cá Koi hàng đầu tại Việt Nam, Koi69 cam kết mang đến không chỉ những chú Koi đẹp, khỏe mạnh, mà còn tạo nên những trải nghiệm đáng nhớ cho khách hàng. Chúng tôi không ngừng đầu tư vào công nghệ và nâng cao chất lượng dịch vụ để đạt đến sự hoàn thiện trong mỗi bước phát triển.<br></br>
                </p>
                <h1 className="title">Cam kết uy tín</h1>
                <p className="content">
                    Nguồn gốc rõ ràng: Tất cả cá Koi tại Koifish đều được nhập khẩu từ các trang trại uy tín nhất Nhật Bản, đảm bảo độ thuần chủng và chất lượng cao.<br></br>
                    Chất lượng vượt trội: Cá Koi của chúng tôi được nuôi dưỡng trong điều kiện tốt nhất, được kiểm tra kỹ lưỡng về sức khỏe trước khi đến tay khách hàng.<br></br>
                    Tư vấn và hỗ trợ chuyên nghiệp: Đội ngũ chuyên gia giàu kinh nghiệm của chúng tôi sẽ đồng hành cùng bạn từ khâu chọn cá đến chăm sóc cá.
                </p>
                </div>
            </div>
        <Footer/>
        </div>
    );
}

export default AboutPage;