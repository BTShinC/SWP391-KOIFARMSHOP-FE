import "./index.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Typography, Image, Divider, message, Modal } from "antd";
import Carousel from "../carousel";
import { useState, useEffect } from "react";
import ShoppingCart from "../shopping-cart";
import { addToCartAPI, fetchCartItems, fetchProductById } from "../../service/userService";
import { useDispatch, useSelector } from "react-redux";
import { setBuyNowItem } from "../../pages/redux/features/buyNowSlice";
import api from "../../config/api";
import { DollarOutlined,ShoppingCartOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

function SingleProduct() {
  const [cartVisible, setCartVisible] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const account = useSelector((state) => state?.user);
  const navigate = useNavigate();

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
  console.log("Current account:", account);
  console.log("Current ID:", account?.accountID);

  const [isBuyNowModalVisible, setBuyNowModalVisible] = useState(false);
  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const deliveryFee = 200000;
  const [finalPrice, setFinalPrice] = useState(0);

  useEffect(() => {
    if (product) {
      const subtotal = product.price;
      setTotalAmount(subtotal);
      if (subtotal >= 2000000) {
        const discountAmount = subtotal * 0.05;
        setDiscount(discountAmount);
        setFinalPrice(subtotal - discountAmount + deliveryFee);
      } else {
        setDiscount(0);
        setFinalPrice(subtotal + deliveryFee);
      }
    }
  }, [product]);

  const handleBuyNow = async () => {
    if (!account) {
      message.warning("Vui lòng đăng nhập để mua hàng!");
      return;
    }
    setBuyNowModalVisible(true);
  };

  const handleConfirmBuyNow = async () => {
    if (!account || !product) return;

    setBuyNowLoading(true);
    try {
      const balanceResponse = await api.get(`/account/${account.accountID}`);
      const accountBalance = balanceResponse.data.accountBalance;

      if (accountBalance >= finalPrice) {
        // Trừ tiền
        await api.put(`/account/deductBalance/${account.accountID}?amount=${finalPrice}`);

        // Tạo đơn hàng
        const params = new URLSearchParams({
          accountID: account.accountID,
          productIDs: product.productID,
        });

        if (totalAmount >= 2000000) {
          params.append("promotionID", "PM001");
        }

        const orderResponse = await api.post(`/orders/makeOrder?${params.toString()}`);

        // Tạo transaction
        await api.post("/transactions/create", {
          accountID: account.accountID,
          price: finalPrice,
          date: new Date().toISOString(),
          description: `Thanh toán đơn hàng ${orderResponse.data.orderID} (Mua ngay)`,
        });

        message.success("Đặt hàng thành công!");
        setBuyNowModalVisible(false);
        
        // Reload sau 1 giây
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        message.info(
          <div className="no-money-msg">
            Tài khoản không đủ số dư! Nạp tiền ngay?
            <Button
              style={{ marginLeft: "20px" }}
              onClick={() => navigate("/wallet")}
            >
              Nạp tiền
            </Button>
          </div>
        );
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Có lỗi xảy ra khi đặt hàng!");
    } finally {
      setBuyNowLoading(false);
    }
  };

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
      if (!account || !account?.accountID) {
        message.warning("Vui lòng đăng nhập để thêm vào giỏ hàng!");
        return;
      }

      // Fetch current cart items from API
      const currentCartItems = await fetchCartItems(account.accountID);
      
      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const existingItem = currentCartItems.find(
        item => item.productID === product.productID
      );

      if (existingItem) {
        message.warning("Sản phẩm đã có trong giỏ hàng!");
        return;
      }

      // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
      const response = await addToCartAPI({
        accountID: account?.accountID,
        productID: product.productID,
      });

      // Fetch lại giỏ hàng sau khi thêm thành công
      const updatedCartItems = await fetchCartItems(account.accountID);
      setCartItems(updatedCartItems);

      message.success("Đã thêm vào giỏ hàng!");
      setCartVisible(true);
    } catch (error) {
      console.error("Error adding to cart:", error);
      message.error("Không thể thêm vào giỏ hàng. Sản phẩm đã hết hàng.");
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
                  src={product.image1}
                  alt="Thumbnail 2"
                  className="thumbnail"
                />
                <Image
                  src={product.image2}
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
                  <Button className="buy-button" onClick={handleBuyNow}><DollarOutlined/>Mua ngay</Button>
                  <Button onClick={handleAddToCart} className="buy-button">
                    <ShoppingCartOutlined/>
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

      <Modal
        title="Xác nhận đơn hàng"
        open={isBuyNowModalVisible}
        onCancel={() => setBuyNowModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setBuyNowModalVisible(false)}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={buyNowLoading}
            onClick={handleConfirmBuyNow}
          >
            Xác nhận đặt hàng
          </Button>,
        ]}
      >
        <div className="order-summary">
          <div style={{ marginBottom: '10px' }}>
            <span>Tổng tiền hàng:</span>
            <span style={{ float: 'right' }}>
              {totalAmount.toLocaleString("vi-VN")} VNĐ
            </span>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <span>Giảm giá:</span>
            <span style={{ float: 'right' }}>
              {discount.toLocaleString("vi-VN")} VNĐ
            </span>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <span>Phí vận chuyển:</span>
            <span style={{ float: 'right' }}>
              {deliveryFee.toLocaleString("vi-VN")} VNĐ
            </span>
          </div>
          <Divider />
          <div>
            <strong>Tổng cộng:</strong>
            <strong style={{ float: 'right', color: "#B88E2F" }}>
              {finalPrice.toLocaleString("vi-VN")} VNĐ
            </strong>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default SingleProduct;