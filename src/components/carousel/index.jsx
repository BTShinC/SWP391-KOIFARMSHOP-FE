// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { ShoppingCartOutlined } from "@ant-design/icons";
import "./index.scss";
// import required modules
import PropTypes from 'prop-types';
import { Autoplay, Pagination } from "swiper/modules";
import { Button, Card } from "antd";

const { Meta } = Card;


const koiImage = [
  { id: 1, imgSrc: "/images/kohaku.svg", title: "Asagi" },
  { id: 2, imgSrc: "/images/koi5.svg", title: "Showa Sanshoku" },
  { id: 3, imgSrc: "/images/koi6.svg", title: "Karashi" },
  { id: 4, imgSrc: "/images/kohaku.svg", title: "Benigoi" },
  { id: 5, imgSrc: "/images/kohaku.svg", title: "Asagi" },
  { id: 6, imgSrc: "/images/koi5.svg", title: "Showa Sanshoku" },
  { id: 7, imgSrc: "/images/koi6.svg", title: "Karashi" },
  { id: 8, imgSrc: "/images/kohaku.svg", title: "Benigoi" },
];

export default function Carousel({ slidesPerView = 4, images = koiImage}) {
  return (
    <>
      <Swiper
        slidesPerView={slidesPerView}
        autoplay={{
          delay:3000,
          disableOnInteraction: false,
        }}
        spaceBetween={0}
        modules={[Pagination, Autoplay]}
        className="carousel"
      >
        {images.map((image) => (
          <SwiperSlide key={image.id}>
            <HoverCard imgSrc={image.imgSrc} title={image.title} />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
const HoverCard = ({ imgSrc, title }) => {
  return (
    <div className="hover-card">
      <Card
        hoverable
        style={{ width: 240 }}
        cover={
          <img
            alt={title}
            src={imgSrc}
            className="product-image"
          />
        }
      >
        <Meta title={title} description="2.500k" />
        <div className="hover-info">
          <Button type="primary" icon={<ShoppingCartOutlined />}>
            Add to Cart
          </Button>
        </div>
      </Card>
    </div>
  );
};
Carousel.propTypes = {
  slidesPerView: PropTypes.number,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      imgSrc: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
};

Carousel.defaultProps = {
  slidesPerView: 4,
};

HoverCard.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};