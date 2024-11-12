import { useState, useEffect } from "react";
import { Button, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";
import { clearBuyNowItem } from "../redux/features/buyNowSlice";

function BuyNowCheckout() {
  const user = useSelector((state) => state.user);
  const buyNowItem = useSelector((state) => state.buyNow.item);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const deliveryFee = 200000;
  const [finalPrice, setFinalPrice] = useState(0);
  const productIDs = buyNowItem
    .filter((item) => item.type === "Product")
    .map((item) => item.productID);
  const productComboIDs = buyNowItem
    .filter((item) => item.type === "ProductCombo")
    .map((item) => item.productComboID);

  useEffect(() => {
    if (!buyNowItem) {
      message.warning("Không tìm thấy thông tin sản phẩm!");
      navigate("/");
      return;
    }

    const calculateTotal = () => {
      const subtotal = buyNowItem.price;
      setTotalAmount(subtotal);
      if (subtotal >= 2000000) {
        const discountAmount = subtotal * 0.05;
        setDiscount(discountAmount);
        setFinalPrice(subtotal - discountAmount + deliveryFee);
      } else {
        setDiscount(0);
        setFinalPrice(subtotal + deliveryFee);
      }
    };

    calculateTotal();
  }, [buyNowItem]);

  const handleConfirmOrder = async () => {
    if (!user || !buyNowItem) return;

    setLoading(true);
    try {
      const orderData = new URLSearchParams({
        accountID: user.accountID,
        ...(productIDs.length > 0 && { productIDs: productIDs.join(",") }),
        ...(productComboIDs.length > 0 && {
          productComboIDs: productComboIDs.join(","),
        }),
      });

      const response = await api.post("/orders/makeOrder", orderData);

      if (response.status === 200) {
        message.success("Đặt hàng thành công!");
        // Clear buyNow item
        dispatch(clearBuyNowItem());
        navigate("/ordertracking");
      }
    } catch (error) {
      message.error("Đặt hàng thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="buynow-checkout-container">
      <h2>Xác nhận đơn hàng</h2>
      <div className="order-summary">
        <div>
          <strong>Tổng tiền hàng:</strong> {totalAmount.toLocaleString("vi-VN")}{" "}
          VNĐ
        </div>
        <div>
          <strong>Giảm giá:</strong> {discount.toLocaleString("vi-VN")} VNĐ
        </div>
        <div>
          <strong>Phí vận chuyển:</strong> {deliveryFee.toLocaleString("vi-VN")}{" "}
          VNĐ
        </div>
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
        loading={loading}
        style={{ marginTop: "20px" }}
      >
        Xác nhận đặt hàng
      </Button>
    </div>
  );
}

export default BuyNowCheckout;
