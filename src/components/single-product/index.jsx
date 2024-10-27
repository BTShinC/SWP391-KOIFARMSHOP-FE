import "./index.scss";
import { Link, useParams } from "react-router-dom";
import { Button, Typography, Image, Divider, message } from "antd";
import Carousel from "../carousel";
import { useState, useEffect } from "react";
import ShoppingCart from "../shopping-cart";
import { addToCartAPI, fetchProductById } from "../../service/userService";
import { useDispatch, useSelector } from "react-redux";

const { Title, Text } = Typography;

function SingleProduct() {
  const [cartVisible, setCartVisible] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const account = useSelector((state) => state.user);


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const { id } = useParams(); // Lấy productId từ URL
  const [product, setProduct] = useState(null); // State để lưu thông tin sản phẩm
  const dispatch = useDispatch(); // Khởi tạo dispatch
  // console.log("Current account:", account);
  // console.log("Current ID:", account.accountID);

  useEffect(() => {

    const loadProduct = async () => {
      try {
        const response = await fetchProductById(id);
        console.log("Fetched product:", response);
        setProduct(response);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    loadProduct();
  }, [id, dispatch]);

  // useEffect(() => {
  //   console.log("Current account:", account);
  // }, account);

  useEffect(() => {
    console.log("Current product:", product);
  }, [product]);

  const handleAddToCart = async () => {
    
    try {
      if (!account || !account.accountID) {
        console.error("Account information is missing");
        return;
      }

      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const existingItem = cartItems.find(
        (item) => item.productID === product.productID
      );
      if (existingItem) {
        message.warning("Sản phẩm đã có trong giỏ hàng.");
        return; // Không thêm sản phẩm nếu đã có
      }

      console.log("Sending to API:", {
        accountID: account.accountID,
        productID: product.productID,
      });

      const response = await addToCartAPI({
        accountID: account.accountID,
        productID: product.productID,
      });
      console.log("Added to cart successfully:", response);

      // Fetch product details
      const productDetails = await fetchProductById(product.productID);
      console.log("Fetched product details:", productDetails);

      // Cập nhật cartItems để hiển thị thông tin sản phẩm
      setCartItems((prevItems) => [
        ...prevItems,
        {
          productID: product.productID,
          productName: productDetails.productName,
          price: productDetails.price,
          image: productDetails.image,
          breed: productDetails.breed,
        },
      ]);

      setCartVisible(true);
    } catch (error) {
      console.error(
        "Error adding to cart:",
        error.response?.data || error.message
      );
      message.error("Sản phẩm đã hết hàng.");
    }
  };

  return (
    <div className="single-product">
      <div className="breadcrumb-banner">
        <nav className="breadcrumb">
          <Link to="/" className="breadcrumb-link faded">
            Trang chủ
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
          <Link to="/product" className="breadcrumb-link faded">
            Cá Koi Nhật
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
                  src={product.image}
                  alt="Thumbnail 1"
                  className="thumbnail"
                />
                <Image
                  src={product.image}
                  alt="Thumbnail 2"
                  className="thumbnail"
                />
                <Image
                  src={product.image}
                  alt="Thumbnail 3"
                  className="thumbnail"
                />
              </div>
              <Image
                src={product.image}
                alt="Main Product"
                width={400}
                height={400}
                className="main-image"
              />
            </div>

            <div className="product-details">
              <Title level={6}>{product.productName}</Title>
              <Text className="price" style={{ color: "#9F9F9F" }}>
                Giá: {formatCurrency(product.price)} VNĐ
              </Text>
              <Text>Tuổi: {product.size} tháng tuổi</Text>
              <Text>Giới tính: {product.sex}</Text>
              <Text>Kích thước: {product.size} cm</Text>
              <Text>Giống: {product.breed}</Text>
              <Text>Nguồn gốc: {product.origin}</Text>
              {product.status === "Còn hàng" ? (
                <div className="action-buttons">
                  <Button className="buy-button">Mua ngay</Button>
                  <Button onClick={handleAddToCart} className="buy-button">
                    Thêm vào giỏ hàng
                  </Button>
                </div>
              ) : (
                <Text style={{ color: "red" }}>Sản phẩm hết hàng</Text>
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
          <p>{product ? product.description : "Loading description..."}</p>
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

export default SingleProduct;