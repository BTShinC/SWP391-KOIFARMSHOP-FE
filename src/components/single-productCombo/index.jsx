// src/components/single-product-combo/SingleProductCombo.jsx
import "./index.scss";
import { Link, useParams } from "react-router-dom";
import { Button, Typography, Image, Divider } from "antd";
import { useState, useEffect } from "react";
import Carousel from "../carousel";
import { fetchProductComboById, addToCartAPI } from "../../service/userService"; // Adjust the import based on your service
import { useDispatch, useSelector } from "react-redux";
import ShoppingCart from "../shopping-cart"; // Import ShoppingCart component

const { Title, Text } = Typography;

function SingleProductCombo() {
  const { id } = useParams(); // Get product combo ID from URL
  const [productCombo, setProductCombo] = useState(null); // State to store product combo details
  const [cartVisible, setCartVisible] = useState(false); // State to manage cart visibility
  const [cartItems, setCartItems] = useState([]); // State to store cart items
  const dispatch = useDispatch(); // Initialize dispatch

  // Fetch product combo from backend when component mounts
  useEffect(() => {
    const loadProductCombo = async () => {
      try {
        const response = await fetchProductComboById(id); // Fetch product combo by ID
        console.log("Fetched product combo:", response);
        setProductCombo(response);
      } catch (error) {
        console.error("Error fetching product combo:", error);
      }
    };

    loadProductCombo();
  }, [id, dispatch]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddToCart = async () => {
    const user = useSelector((state) => state.user);

    try {
      if (!user.accountID) {
        console.error("Account information is missing");
        return;
      }

      console.log("Sending to API:", {
        accountID: user.accountID,
        productID: productCombo.productComboID // Use productComboID
      });

      const response = await addToCartAPI({
        accountID: user.accountID,
        productID: productCombo.productComboID // Use productComboID
      });
      console.log("Added to cart successfully:", response);

      // Update cartItems to display product combo information
      setCartItems((prevItems) => [
        ...prevItems,
        {
          productID: productCombo.productComboID,
          comboName: productCombo.comboName,
          price: productCombo.price,
          image: productCombo.image,
          breed: productCombo.breed,
        },
      ]);

      setCartVisible(true); // Show the cart after adding
    } catch (error) {
      console.error("Error adding to cart:", error.response?.data || error.message);
    }
  };

  return (
    <div className="single-product-combo">
      <div className="breadcrumb-banner">
        <nav className="breadcrumb">
          <Link to="/" className="breadcrumb-link faded">Trang chủ</Link>
          <span className="breadcrumb-separator"> &gt; </span>
          <Link to="/productcombo" className="breadcrumb-link faded">Combo sản phẩm</Link>
          <span className="breadcrumb-separator"> &gt; </span>
          <span className="breadcrumb-current">{productCombo ? productCombo.comboName : "Loading..."}</span>
        </nav>
      </div>

      <div className="product-container">
        {productCombo && (
          <>
            <div className="image-gallery">
              <Image
                src={productCombo.image}
                alt="Main Product Combo"
                width={400}
                height={400}
                className="main-image"
              />
            </div>

            <div className="product-details">
              <Title level={6}>{productCombo.comboName}</Title>
              <Text className="price" style={{ color: "#9F9F9F" }}>
                Giá: {formatCurrency(productCombo.price)} VNĐ
              </Text>
              <Text>Giống: {productCombo.breed}</Text>
              <Text>Số lượng: {productCombo.quantity}</Text>
              <Text>Kích thước: {productCombo.size} cm</Text>
              {productCombo.status === "Còn hàng" ? (
                <div className="action-buttons">
                  <Button className="buy-button">Mua ngay</Button>
                  <Button onClick={handleAddToCart} className="buy-button">
                    Thêm vào giỏ hàng
                  </Button>
                </div>
              ) : (
                <div style={{paddingLeft: "10rem", paddingTop: "3rem"}}>
                <Text style={{ fontSize: "Large",fontWeight: "Bold", color: "red" }}>Sản phẩm hết hàng</Text>
                </div>
              )}

              <div className="divider-wrapper">
                <Divider />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="description-container">
        <div className="divider-wrapper">
          <Divider />
        </div>
        <div className="description">
          <Title level={2}>Mô tả</Title>
          <p>{productCombo ? productCombo.description : "Loading description..."}</p>
        </div>
      </div>

      <div className="carousel-container">
        <div className="title">
          <Title level={2}>Sản phẩm liên quan</Title>
        </div>
        <Carousel slidesPerView={4} />
        <div className="button">
          <Button className="color-option" style={{ backgroundColor: "white", color: "#B88E2F", marginTop: 70, width: 150, height: 50 }}>
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

export default SingleProductCombo;
