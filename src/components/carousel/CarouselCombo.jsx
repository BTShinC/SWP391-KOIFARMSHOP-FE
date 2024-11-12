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
import { formatCurrency } from "../../utils/formatters";


const { Meta } = Card;

export default function CarouselCombo({ slidesPerView = 4 }) {
  const [combos, setCombos] = useState([]);

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const response = await api.get("/productcombo/getall");
        // Lọc chỉ lấy các combo còn hàng và không phải chăm sóc
        const filteredCombos = response.data.filter(
          combo => combo.status === "Còn hàng" && combo.consignmentType !== "chăm sóc"
        );
        setCombos(filteredCombos);
      } catch (error) {
        console.error("Error fetching combos:", error);
      }
    };

    fetchCombos();
  }, []);

  return (
    <>
      <Swiper
        slidesPerView={slidesPerView}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        spaceBetween={80}
        modules={[Pagination, Autoplay]}
        className="carousel"
      >
        {combos && combos.map((combo) => (
          <SwiperSlide key={combo.productComboID} className="swipper">
            <Link to={`/singleproductcombo/${combo.productComboID}`}>
              <Card
                hoverable
                cover={<img alt={combo.comboName} src={combo.image} />}
                className="product-card"
              >
                <Meta
                  title={combo.comboName}
                  description={`${formatCurrency(combo.price)} VND`}
                />
              </Card>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}

const HoverCard = ({ imgSrc, title, price, id}) => {
  
  return (
    <Link to={`/singleproduct/${id}`} className="hover-card">
      <Card
        hoverable
        style={{ width: 240 }}
        cover={<img alt={title} src={imgSrc} className="product-image" />}
      >
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


CarouselCombo.propTypes = {
  slidesPerView: PropTypes.number,
};

HoverCard.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired, // Assuming price is a number
  id: PropTypes.string.isRequired,
};
