import poster from "swp391-koifarmshop-fe/public/images/poster-upscaled.jpeg";
//upscalled image

import "./index.scss";
import { Link } from "react-router-dom";

import { Card } from "antd";
import { useState } from 'react';
import { Modal } from 'antd';
import { GiftOutlined } from '@ant-design/icons';
import Meta from "antd/es/card/Meta";

import koi1 from "swp391-koifarmshop-fe/public/images/koi1.svg";
import koi2 from "swp391-koifarmshop-fe/public/images/koi2.svg";
import koi3 from "swp391-koifarmshop-fe/public/images/koi3.svg";
import koi4 from "swp391-koifarmshop-fe/public/images/koi4.svg";
import Carousel from "../../../components/carousel";
import CarouselCombo from "../../../components/carousel/CarouselCombo";


function Body() {

  const [isSaleModalVisible, setSaleModalVisible] = useState(false);
  const showSaleModal = () => {
    setSaleModalVisible(true);
  };

  const handleSaleModalClose = () => {
    setSaleModalVisible(false);
  };

  const koiImages = [
    { id: 1, imgSrc: koi1, title: "Asagi" },
    { id: 2, imgSrc: koi2, title: "Showa Sanshoku" },
    { id: 3, imgSrc: koi3, title: "Karashi" },
    { id: 4, imgSrc: koi4, title: "Benigoi" },
  ];

  return (
    <body className="body">
      <div className="body__poster">
        <img src={poster} alt="Poster" />
      </div>

      <div className="body__content">
        <h2>Các loại cá Koi tiêu biểu tại SHOP</h2>
        <div className="body__content__image">
          <ul className="image-list">
            {koiImages.map((koi) => (
              <li key={koi.id}>
                {" "}
                {/* Chỉnh sửa ở đây */}
                <Card
                  hoverable
                  cover={<img src={koi.imgSrc} alt={koi.title} />}
                >
                  <Meta title={koi.title} />
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="body__carousel le">
        <h2>Mua lẻ</h2>
        <Carousel />
        <div className="more-button-container">
          {" "}
          {/* Thêm thẻ div này */}
          <Link to="/product" className="more-button">
            Xem thêm
          </Link>
        </div>
      </div>

      <div className="body__carousel lo">
        <h2>Mua lô</h2>
        <CarouselCombo />
        <div className="more-button-container">
          {" "}
          {/* Thêm thẻ div này */}
          <Link to="/product" className="more-button">
            Xem thêm
          </Link>
        </div>
      </div>

      <div className="body__background">
        <div className="body__background__content">
          <h1>50+ Loại cá đẹp trong cửa hàng</h1>
          <h5>
            Cá Koi không chỉ làm không gian thêm sinh động mà còn giúp giảm căng
            thẳng và mệt mỏi.
          </h5>
          <Link to="/product">
            <button className="view-more-button">Xem thêm</button>
          </Link>
        </div>
        <div className="body__background__carousel">
          <Carousel slidesPerView={2} />
        </div>
      </div>

      <div className="body__introduction">
        <div className="body__introduction__content">
          <h1>Giới thiệu về Koifish - Đam mê Koi Nhật</h1>
          <h5>
            Chào mừng bạn đến với Koifish nơi niềm đam mê với cá Koi Nhật Bản
            được kết hợp với sự chuyên nghiệp và tận tâm. Chúng tôi tự hào là
            một trong những địa chỉ uy tín hàng đầu cung cấp cá Koi chất lượng
            cao tại Việt Nam. Với tiêu chuẩn vượt trội và cam kết mang lại dịch
            vụ hoàn hảo, Koifish luôn nỗ lực để mỗi khách hàng đều hài lòng.
          </h5>
          <Link to="/about">
            <button className="view-more-button">Xem thêm</button>
          </Link>

        </div>

        <div className="body__introduction__image">
          <img src="/images/imtro.svg" alt="" />
        </div>
      </div>
      <div className="floating-sale-icon" onClick={showSaleModal}>
        <GiftOutlined className="sale-icon" />
        <span style={{ fontSize: 8 }} className="sale-badge">Ưu đãi sốc!</span>
      </div>

      <Modal
        title="Ưu đãi đặc biệt"
        visible={isSaleModalVisible}
        onCancel={handleSaleModalClose}
        footer={null}
        className="sale-modal"
        width={500}
        centered

      >
        <div className="sale-content">
          <h2>Giảm giá 5%</h2>
          <p>Áp dụng cho đơn hàng từ 2.000.000 VND</p>
          <div className="sale-details">
            <ul>
              <li>Ưu đãi áp dụng cho tất cả sản phẩm</li>
              <li>Thời gian áp dụng: Không giới hạn</li>
              <li>Không áp dụng cùng các khuyến mãi khác</li>
            </ul>
          </div>
        </div>
      </Modal>
    </body>
  );
}

export default Body;
