import "./index.scss";
import { Link, useParams } from "react-router-dom";
import { Button, Typography, Image, Divider, message, Modal } from "antd";
import { useState, useEffect } from "react";
import Carousel from "../carousel";
import { fetchProductComboById, addToCartAPI } from "../../service/userService";
import { useDispatch, useSelector } from "react-redux";
import ShoppingCart from "../shopping-cart";
import api from "../../config/api";
const { Title, Text } = Typography;

function SingleProductCombo() {
  const { id } = useParams(); // Get product combo ID from URL
  const [productCombo, setProductCombo] = useState(null); // State to store product combo details
  const [cartVisible, setCartVisible] = useState(false); // State to manage cart visibility
  const [cartItems, setCartItems] = useState([]); // State to store cart items
  const dispatch = useDispatch(); // Initialize dispatch
  const user = useSelector((state) => state.user);
  const [isBuyNowModalVisible, setBuyNowModalVisible] = useState(false);
  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const deliveryFee = 200000;
  const [finalPrice, setFinalPrice] = useState(0);

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

  useEffect(() => {
    if (productCombo) {
      const subtotal = productCombo.price;
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
  }, [productCombo]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddToCart = async () => {
    try {
      if (!user || !user.accountID) {
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
      message.error("Sản phẩm đã hết hàng.");
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      message.warning("Vui lòng đăng nhập để mua hàng!");
      return;
    }
    setBuyNowModalVisible(true);
  };

  const handleConfirmBuyNow = async () => {
    if (!user || !productCombo) return;

    setBuyNowLoading(true);
    try {
      const balanceResponse = await api.get(`/account/${user.accountID}`);
      const accountBalance = balanceResponse.data.accountBalance;

      if (accountBalance >= finalPrice) {
        // Deduct balance
        await api.put(`/account/deductBalance/${user.accountID}?amount=${finalPrice}`);

        // Create order
        const params = new URLSearchParams({
          accountID: user.accountID,
          productComboIDs: productCombo.productComboID,
        });

        if (totalAmount >= 2000000) {
          params.append("promotionID", "PM001");
        }

        const orderResponse = await api.post(`/orders/makeOrder?${params.toString()}`);

        // Create transaction record
        await api.post("/transactions/create", {
          accountID: user.accountID,
          price: finalPrice,
          date: new Date().toISOString(),
          description: `Thanh toán đơn hàng ${orderResponse.data.orderID} (Mua ngay)`,
        });

        message.success("Đặt hàng thành công!");
        setBuyNowModalVisible(false);
        
        // Thêm setTimeout để đảm bảo message hiển thị trước khi reload
        setTimeout(() => {
          window.location.reload(); // Reload trang
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
              <div className="thumbnail-container">
                <Image
                  src={productCombo.image}
                  alt="Thumbnail 1"
                  className="thumbnail"
                />
                <Image
                  src={productCombo.image1}
                  alt="Thumbnail 2"
                  className="thumbnail"
                />
                <Image
                  src={productCombo.image2}
                  alt="Thumbnail 3"
                  className="thumbnail"
                />
              </div>
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
                  <Button onClick={handleBuyNow} className="buy-button">
                    Mua ngay
                  </Button>
                  <Button onClick={handleAddToCart} className="buy-button">
                    Thêm vào giỏ hàng
                  </Button>
                </div>
              ) : (
                <div style={{paddingLeft: "10rem", paddingTop: "3rem"}}>
                  <Text style={{ fontSize: "Large", fontWeight: "Bold", color: "red" }}>Sản phẩm hết hàng</Text>
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

export default SingleProductCombo;