import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../redux/features/createSlice";
import { Button, message, Divider } from "antd";
import { Link, useNavigate } from "react-router-dom";
import api from "../../config/api"; // Import the api instance
import "./index.scss"; 

function CheckoutPage() {
  const user = useSelector((state) => state.user);
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const deliveryFee = 200000;
  const [finalPrice, setFinalPrice] = useState(0);

  useEffect(() => {
    const calculateTotal = () => {
      const subtotal = cartItems.reduce((total, item) => total + item.price, 0);
      setTotalAmount(subtotal);
      if (subtotal >= 2000000) {
        const discountAmount = subtotal * 0.05; 
        setDiscount(discountAmount);
      } else {
        setDiscount(0);
      }
      setFinalPrice(subtotal - discount + deliveryFee);
    };

    calculateTotal();

    const recalculateOnDiscountChange = () => {
      calculateTotal();
    };

    recalculateOnDiscountChange();
  }, [cartItems, discount]);

  const deductAccountBalance = async (accountID, amount) => {
    const apiUrl = `/account/deductBalance/${user.accountID}?amount=${amount}`;
    try {
      const response = await api.put(apiUrl); // Use api.put for PUT requests

      if (!response.ok) {
        throw new Error("Failed to update account balance");
      }
    } catch (error) {
      console.error("Error updating account balance:", error);
    }
  };

  const handleConfirmOrder = async () => {
    if (!user || !user.accountID) {
      message.error("User account not found.");
      return;
    }
    try {
      console.log("Account ID:", user.accountID);

      const balanceResponse = await api.get(`/account/${user.accountID}`);
      const accountBalance = balanceResponse.data.accountBalance;

      const productIDs = cartItems
        .filter((item) => item.type === "Product")
        .map((item) => item.productID);
      const productComboIDs = cartItems
        .filter((item) => item.type === "Combo")
        .map((item) => item.productComboID);

      if (accountBalance >= finalPrice) {
        await deductAccountBalance(user.accountID, finalPrice); 

        const params = new URLSearchParams({
          accountID: user.accountID,
          ...(productIDs.length > 0 && { productIDs: productIDs.join(",") }),
          ...(productComboIDs.length > 0 && {
            productComboIDs: productComboIDs.join(","),
          }),
        });

        console.log("Query Parameters:", params.toString());

        const orderResponse = await api.post(
          `/orders/makeOrder?${params.toString()}`,
          { promotionID: null } // Add promotionID parameter and set to null by default
        ); 
        console.log("Order Response:", orderResponse.data);

        dispatch(clearCart());
        message.success("Đơn hàng của bạn đã được đặt thành công!");
        message.success(
          "Bạn sẽ được điều hướng về trang chủ trong 5s, vui lòng đừng thao tác!"
        );

        let countdown = 3;
        const countdownInterval = setInterval(() => {
          if (countdown <= 0) {
            clearInterval(countdownInterval);
            navigate("/");
          } else {
            countdown--;
          }
        }, 1000);
      } else {
        message.info("Tài khoản hiện không đủ số dư!", 5);
        message.info(
          <div className="no-money-msg">
            Nạp tiền ngay?
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
      console.error("Error during order confirmation:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        message.error(`Có lỗi khi đặt hàng: `);
      } else {
        message.error("Có lỗi khi đặt hàng.");
      }
    }
  };

  return (
    <div className="checkout-wrapper">
      <div className="checkout-page">
        <h2>Thanh toán</h2>
        <Divider />
        <div className="checkout-details">
          <div>
            <span>Tổng số tiền:</span>
            <span>{totalAmount.toLocaleString("vi-VN")} VNĐ</span>
          </div>
          <div>
            <span>Giảm giá:</span>
            <span>{discount.toLocaleString("vi-VN")} VNĐ</span>
          </div>
          <div>
            <span>Phí giao hàng:</span>
            <span>{deliveryFee.toLocaleString("vi-VN")} VNĐ</span>
          </div>
          <Divider />
          <div>
            <strong>Tổng cộng:</strong>
            <strong style={{ color: "#B88E2F" }}>
              {finalPrice.toLocaleString("vi-VN")} VNĐ
            </strong>
          </div>
        </div>
        <Button
          type="primary"
          onClick={handleConfirmOrder}
          style={{ marginTop: "20px" }}
        >
          Xác nhận đặt hàng
        </Button>
        <Link to="/shoppingcart">
          <Button type="primary" style={{ marginTop: "20px" }}>
            Quay lại
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default CheckoutPage;
