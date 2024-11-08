import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { ShoppingCartOutlined } from "@ant-design/icons";
import "./index.scss";
import { Autoplay, Pagination } from "swiper/modules";
import { Button, Card, message } from "antd";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";
import { addToCartAPI, fetchAllProduct } from "../../service/userService";
import { useSelector } from "react-redux";

const { Meta } = Card;

export default function Carousel({ slidesPerView = 4 }) {
  const [products, setProducts] = useState([]);
  


  useEffect(() => {
    // Fetch products from API
    const loadProducts = async () => {
      try {
        const response = await fetchAllProduct();
        const filteredProducts = response.data.filter(
          product => product.status === "Còn hàng" && product.consignmentType !== "chăm sóc"
        );
        console.log(filteredProducts);
        setProducts(filteredProducts); // Assuming response.data contains the product array
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    loadProducts();
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
        {products && products.map((product) =>  (
          <SwiperSlide key={product.productID} className="swipper">
            <HoverCard
              imgSrc={product.image}
              title={product.productName}
              price={product.price.toLocaleString()}
              id={product.productID}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}

const HoverCard = ({ imgSrc, title, price, id}) => {
  const account = useSelector((state) => state.user);

  const handleAddToCart = async () => {
    try {
      if (!account) {
        message.warning("Vui lòng đăng nhập để thêm vào giỏ hàng!");
        return;
      }

      await addToCartAPI({
        accountID: account.accountID,
        productID: id,
      });
      
      message.success("Đã thêm vào giỏ hàng!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      message.error("Không thể thêm vào giỏ hàng!");
    }
  };
  
  return (
    <Link to={`/singleproduct/${id}`} className="hover-card">
      <Card
        hoverable
        style={{ width: 240 }}
        cover={<img alt={title} src={imgSrc} className="product-image" />}
      >
        <Meta title={title} description={`${price} VND`} />
        <div className="hover-info">
          <Button type="primary" icon={<ShoppingCartOutlined />} onClick={handleAddToCart}>
            Thêm giỏ hàng
          </Button>
        </div>
      </Card>
    </Link>
  );
};


Carousel.propTypes = {
  slidesPerView: PropTypes.number,
};

HoverCard.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired, // Assuming price is a number
  id: PropTypes.string.isRequired,
};
