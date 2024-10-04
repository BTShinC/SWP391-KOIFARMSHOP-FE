import "./index.scss";
import { Link } from "react-router-dom";
import { Button, Typography, Image, Divider } from "antd";
import Carousel from "../../components/carousel";
import { useState } from "react";
import ShoppingCart from "../../components/shopping-cart";

const { Title, Text } = Typography;

function SinglepProduct() {
  const [cartVisible, setCartVisible] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (product) => {
    const existingItem = cartItems.find(item => item.title === product.title);
    if (existingItem) {
      existingItem.quantity += 1; // Increase quantity if already exists
      setCartItems([...cartItems]);
    } else {
      setCartItems((prevItems) => [...prevItems, { ...product, quantity: 1 }]);
    }
    setCartVisible(true);
  };
  return (
    <div className="single-product">
      <div className="breadcrumb-banner">
        <nav className="breadcrumb">
          <Link to="/" className="breadcrumb-link faded">
            HomePage
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
          <Link to="/shop" className="breadcrumb-link faded">
            Shop
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
          <span className="breadcrumb-current">Tên sản phẩm</span>
        </nav>
      </div>

      <div className="product-container">
        <div className="image-gallery">
          <div className="thumbnail-container">
            <Image
              src="/images/kohaku1.svg" // Replace with your thumbnail image path
              alt="Thumbnail 1"
              className="thumbnail"
            />
            <Image
              src="/images/kohaku1.svg" // Replace with your thumbnail image path
              alt="Thumbnail 2"
              className="thumbnail"
            />
            <Image
              src="/images/kohaku1.svg" // Replace with your thumbnail image path
              alt="Thumbnail 3"
              className="thumbnail"
            />
          </div>
          <Image
            src="/images/kohaku1.svg" // Replace with your main image path
            alt="Main Product"
            width={400}
            height={400}
            className="main-image"
          />
        </div>

        <div className="product-details">
          <Title level={6}>Tên sản phẩm</Title>
          <Text className="price" style={{ color: "#9F9F9F" }}>
            Giá: 1.000.000 VNĐ
          </Text>

          <Text>Tuổi: 5 tháng tuổi</Text>

          <Text>Giới tính: Koi Cái</Text>

          <Text>Năm sinh: 2024</Text>

          <Text>Kích thước: 80cm</Text>

          <Text>Giống: Tancho Kohaku</Text>

          <Text>Nguồn gốc: Danchi Koi Farm</Text>

          <div className="color-selection">
            <Text>Chọn màu sắc: </Text>
            <Button
              className="color-option"
              style={{ backgroundColor: "white" }}
            />
            <Button
              className="color-option"
              style={{ backgroundColor: "red" }}
            />
            <Button
              className="color-option"
              style={{ backgroundColor: "black" }}
            />
          </div>

          <div className="action-buttons">
            <Button
              type="default"
              className="buy-button"
              onClick={() => handleAddToCart({ image: "/images/kohaku1.svg", title: "Mua lẻ", price: 1000000 })}
            >
              Mua lẻ
            </Button>
            <Button
              type="default"
              className="buy-button"
              onClick={() => handleAddToCart({ image: "/images/kohaku1.svg", title: "Mua lô", price: 1000000 })}
            >
              Mua lô
            </Button>
          </div>
          <div className="divider-wrapper">
            <Divider />
          </div>
        </div>
      </div>

      <div className="description-container">
        <div className="divider-wrapper">
          <Divider />
        </div>
        <div className="description">
          <Title level={2}>Mô tả</Title>
          <p>
            Embodying the raw, wayward spirit of rock ‘n’ roll, the Kilburn
            portable active stereo speaker takes the unmistakable look and sound
            of Marshall, unplugs the chords, and takes the show on the road.
          </p>
          <p>
            Weighing in under 7 pounds, the Kilburn is a lightweight piece of
            vintage styled engineering. Setting the bar as one of the loudest
            speakers in its class, the Kilburn is a compact, stout-hearted hero
            with a well-balanced audio which boasts a clear midrange and
            extended highs for a sound that is both articulate and pronounced.
            The analogue knobs allow you to fine tune the controls to your
            personal preferences while the guitar-influenced leather strap
            enables easy and stylish travel.
          </p>
        </div>
        <div className="image-section">
          <img
            src="/images/kohaku1.svg"
            alt="Sample 1"
            className="description-image"
          />
          <img
            src="/images/kohaku1.svg"
            alt="Sample 2"
            className="description-image"
          />
        </div>
      </div>

      <div className="carousel-container">
        <div className="title">
          <Title level={2}>Sản phẩm liên quan</Title>
        </div>
        <Carousel slidesPerView={4} />
        <div className="button">
          <Button
            className="color-option"
            style={{
              backgroundColor: "white",
              color: "#B88E2F",
              marginTop: 70,
              width: 150,
              height: 50,
            }}
          >
            {" "}
            Xem thêm
          </Button>
        </div>
      </div>

      {/* Show ShoppingCart if visible */}
      {cartVisible && (
        <ShoppingCart
          cartItems={cartItems}
          onClose={() => setCartVisible(false)}
        />
      )}
    </div>
  );
}

export default SinglepProduct;
