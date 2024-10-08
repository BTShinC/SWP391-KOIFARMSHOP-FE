import "./index.scss";
import { Link, useParams } from "react-router-dom";
import { Button, Typography, Image, Divider } from "antd";
import Carousel from "../carousel";
import { useState, useEffect } from "react";
import ShoppingCart from "../shopping-cart";
import { fetchProductById } from "../../service/userService";

const { Title, Text } = Typography;

function SinglepProduct() {
  const [cartVisible, setCartVisible] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [product, setProduct] = useState(null); // State to hold product details
  // const productId = "1"; // Replace with the actual product ID
  const { id } = useParams();

  const handleAddToCart = (product) => {
    const existingItem = cartItems.find((item) => item.title === product.title);
    if (existingItem) {
      existingItem.quantity += 1; // Increase quantity if already exists
      setCartItems([...cartItems]);
    } else {
      setCartItems((prevItems) => [...prevItems, { ...product, quantity: 1 }]);
    }
    setCartVisible(true);
  };

  useEffect(() => {
    // Fetch product details by ID when the component mounts
    const loadProduct = async () => {
      try {
        const response = await fetchProductById(id);
        setProduct(response); // Set the product data in state
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    loadProduct();
  }, [id]);

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
          <span className="breadcrumb-current">
            {product ? product.productName : "Loading..."}
          </span>
        </nav>
      </div>

      <div className="product-container">
        {product && (
          <>
            <div className="image-gallery">
              <div className="thumbnail-container">
                <Image
                  src={product.image} // Replace with your thumbnail image path
                  alt="Thumbnail 1"
                  className="thumbnail"
                />
                <Image
                  src={product.image} // Replace with your thumbnail image path
                  alt="Thumbnail 2"
                  className="thumbnail"
                />
                <Image
                  src={product.image} // Replace with your thumbnail image path
                  alt="Thumbnail 3"
                  className="thumbnail"
                />
              </div>
              <Image
                src={product.image} // Replace with your main image path
                alt="Main Product"
                width={400}
                height={400}
                className="main-image"
              />
            </div>

            <div className="product-details">
              <Title level={6}>{product.productName}</Title>
              <Text className="price" style={{ color: "#9F9F9F" }}>
                Giá: {product.price} VNĐ
              </Text>

              <Text>Tuổi: {product.size} tháng tuổi</Text>
              <Text>Giới tính: {product.sex}</Text>
              <Text>Năm sinh: {product.origin}</Text>
              <Text>Kích thước: {product.size} cm</Text>
              <Text>Giống: {product.breed}</Text>
              <Text>Nguồn gốc: {product.origin}</Text>

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
                <Link to="/shoppingcart">
                  <Button
                    type="default"
                    className="buy-button"
                  >
                    Mua ngay
                  </Button>
                </Link>

                <Button
                  type="default"
                  className="buy-button"
                  onClick={() =>
                    handleAddToCart({
                      image: product.image,
                      title: product.productName,
                      price: product.price,
                    })
                  }
                >
                  Thêm vào giỏ hàng
                </Button>
              </div>
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
          <p>{product ? product.description : "Loading description..."}</p>
        </div>
        <div className="image-section">
          <img
            src={product ? product.image : "/images/kohaku1.svg"}
            alt="Sample"
            className="description-image"
          />
          <img
            src={product ? product.image : "/images/kohaku1.svg"}
            alt="Sample"
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
