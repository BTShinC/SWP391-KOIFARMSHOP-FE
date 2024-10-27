import { Button, Carousel } from "antd";
import { useRef } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "./index.scss"; // Import file index.scss
import { useNavigate } from "react-router-dom";

function ConsignmentCarousel() {
  const navigate = useNavigate()
  const slides = [
    {
      backgroundImage:
        "url('/images/ho-ca-koi-ngoai-troi-1024x640.jpg')", // Hình nền slide 1
      buttonLabel: "Ký gửi ngay",
    },
    {
      backgroundImage: "url('/images/banner-JPD.jpg')", // Hình nền slide 2
      buttonLabel: "Ký gửi ngay",
    },
    {
      backgroundImage: "url('/images/banner-SAKURA.jpg')", // Thêm hình nền mới
      buttonLabel: "Ký gửi ngay",
    },
  ];

  const carouselRef = useRef(null); // Tạo ref để điều khiển carousel

  const handlePrev = () => {
    carouselRef.current.prev(); // Gọi phương thức prev của Carousel
  };

  const handleNext = () => {
    carouselRef.current.next(); // Gọi phương thức next của Carousel
  };

  return (
    <div className="consignment-carousel-container">
      <Carousel autoplay ref={carouselRef}>
        {slides.map((slide, index) => (
          <div key={index}>
            <div
              className="consignment-carousel"
              style={{ backgroundImage: slide.backgroundImage }}
            >
              <div style={{ flexGrow: 1 }}></div>
              <Button type="primary" className="carousel-button" onClick={() => navigate('/carePackageList')}>
                {slide.buttonLabel}
              </Button>
            </div>
          </div>
        ))}
      </Carousel>

      {/* Nút quay lại */}
      <Button
        onClick={handlePrev}
        className="carousel-nav-button carousel-nav-prev"
        icon={<LeftOutlined />}
        shape="circle"
        size="large"
      />

      {/* Nút tiếp theo */}
      <Button
        onClick={handleNext}
        className="carousel-nav-button carousel-nav-next"
        icon={<RightOutlined />}
        shape="circle"
        size="large"
      />
    </div>
  );
}

export default ConsignmentCarousel;
