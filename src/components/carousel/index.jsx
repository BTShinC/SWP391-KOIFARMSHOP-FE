import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { ShoppingCartOutlined } from "@ant-design/icons";
import "./index.scss";
import { Autoplay, Pagination } from "swiper/modules";
import { Button, Card } from "antd";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";
import api from "../../config/api";

const { Meta } = Card;

export default function Carousel({ slidesPerView = 4 }) {
  const [images, setImages] = useState([]);

  useEffect(() => {
    
    const fetchImages = async (values) => {
      try {
        const response = await api.get("product/getall",values);  
        setImages(response.data);  
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <>
      <Swiper
        slidesPerView={slidesPerView}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        spaceBetween={0}
        modules={[Pagination, Autoplay]}
        className="carousel"
      >
        {images.map((image) => (
          <SwiperSlide key={image.id}>
            <HoverCard
              imgSrc={image.image}  
              title={image.productName}  
              price={image.price}  
              id={image.id}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}

const HoverCard = ({ imgSrc, title, price, id }) => {
  return (
    <Link to={`/singleproduct/${id}`} className="hover-card">
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
        {/* Meta will display product name and price */}
        <Meta title={title} description={`${price} VND`} />
        <div className="hover-info">
          <Button type="primary" icon={<ShoppingCartOutlined />}>
            Add to Cart
          </Button>
        </div>
      </Card>
    </Link>
  );
};

Carousel.propTypes = {
  slidesPerView: PropTypes.number,
};

Carousel.defaultProps = {
  slidesPerView: 4,
};

HoverCard.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  id: PropTypes.number.isRequired,
};
