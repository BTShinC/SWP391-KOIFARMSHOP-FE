import { Button, Carousel } from "antd";
import { useRef } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "./index.scss"; // Import file index.scss
import { useNavigate } from "react-router-dom";
function ConsignmentCarousel() {
  const navigate = useNavigate();
  const slides = [
    {
      imageSrc: "/images/ho-ca-koi-ngoai-troi-1024x640.jpg", 
      buttonLabel: "Ký gửi ngay",
    },
    {
      imageSrc: "/images/banner-JPD.jpg", 
    },
    {
      imageSrc: "/images/banner-SAKURA.jpg",
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
            <div className="consignment-carousel">
              {/* Sử dụng img thay vì background-image */}
              <img
                src={slide.imageSrc}
                alt={`Slide ${index + 1}`}
                className="carousel-image"
              />
              <div className="carousel-content">
                <Button
                  type="primary"
                  className="carousel-button"
                  onClick={() => navigate("/carePackageList")}
                >
                  {slide.buttonLabel}
                </Button>
              </div>
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
