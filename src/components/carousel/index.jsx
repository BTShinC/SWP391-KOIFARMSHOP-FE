// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { ShoppingCartOutlined } from "@ant-design/icons";
import "./index.scss";
import image from "swp391-koifarmshop-fe/public/images/image 1.svg"
// import required modules
import { Pagination } from "swiper/modules";
import { Button, Card } from "antd";

const { Meta } = Card;
export default function Carousel() {
  return (
    <>
      <Swiper
        slidesPerView={4}
        spaceBetween={0}
        modules={[Pagination]}
        className="carousel"
      >
        <SwiperSlide>
          <HoverCard/>
        </SwiperSlide>
        <SwiperSlide>
          <HoverCard/>
        </SwiperSlide>
        <SwiperSlide>
          <HoverCard/>
        </SwiperSlide>
        <SwiperSlide>
          <HoverCard/>
        </SwiperSlide>
        <SwiperSlide>
          <HoverCard/>
        </SwiperSlide>
        <SwiperSlide>
          <HoverCard/>
        </SwiperSlide>
        
      </Swiper>
    </>
  );
}
const HoverCard = () => {
  return (
    <div className="hover-card">
      <Card
        hoverable
        style={{ width: 240 }}
        cover={
          <img
            alt="example"
            src={image}
            className="product-image"
          />
        }
      >
        <Meta title="Tên cá" description="2.500k" />
        <div className="hover-info">
          <Button type="primary" icon={<ShoppingCartOutlined />}>
            Add to Cart
          </Button>
        </div>
      </Card>
    </div>
  );
};
