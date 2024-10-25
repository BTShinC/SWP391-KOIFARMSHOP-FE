import "./index.scss";
import { Button, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from 'react-redux';
import { deleteCartItem, fetchCartItems } from "../../service/userService";
import { removeFromCart, setCartItems } from "../redux/features/createSlice";

import { Link } from "react-router-dom";

import { useEffect } from "react";



function ShoppingCartPage() {
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();
  const account = useSelector((state) => state.user);


  const subtotal = cartItems.reduce(
    (total, item) => total + item.price,
    0
  );





  const loadCartItems = async () => {

    if (account && account.accountID) {
      try {
        const items = await fetchCartItems(account.accountID);

        dispatch(setCartItems(items)); // Cập nhật Redux store với giỏ hàng mới
      } catch (error) {
        console.error("Failed to load cart items:", error);
        message.error("Không thể tải giỏ hàng");
      }
    } else {
      console.log("No account ID available");
    }
  };

  useEffect(() => {
    loadCartItems();
  }, [account, dispatch]);

  const handleRemoveFromCart = async (cartItemId) => {
    try {
      // Gọi API để xóa item
      await deleteCartItem(cartItemId); // Gọi hàm deleteCartItem
      dispatch(removeFromCart(cartItemId)); // Cập nhật Redux store
      message.success("Đã xóa sản phẩm khỏi giỏ hàng");
      loadCartItems(); // Gọi lại hàm loadCartItems để cập nhật giỏ hàng
    } catch (error) {
      console.error("Error removing item from cart:", error);
      message.error("Không thể xóa sản phẩm khỏi giỏ hàng");
    }
  };


  return (
    <div className="shopping-cart-page">
      {/* Cart Items Section */}
      <div className="cart-items-section">
        {/* Cart Title Row */}
        <div className="cart-title">
          <div className="cart-title-row">
            <span>Sản phẩm</span>
            <span>Giá</span>
            <span>Số lượng</span>
            <span>Nội dung</span>
          </div>
        </div>
        {/* Cart Items */}
        {cartItems.map((item) => (
          <div className="cart-item" key={item.id}>
            <div className="item-image">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="item-details">
              <div className="item-name">
                <h4>{item.name}</h4>
              </div>
              <div className="item-price">
                <span>{item.price.toLocaleString("vi-VN")} VNĐ</span>
              </div>
              {/* <div className="item-quantity">
                <InputNumber
                  min={1}
                  max={100}
                  value={item.quantity}
                  onChange={(value) => handleQuantityChange(item.id, value)}
                />
              </div> */}
              <div className="item-content">
                <span>{item.content}</span>
              </div>
            </div>
            <div className="item-remove">
              <Button
                type="text"
                icon={<DeleteOutlined style={{ color: "#B88E2F" }} />}
                onClick={() => handleRemoveFromCart(item.shopCartID)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Cart Total Section */}
      <div className="cart-total">
        <h3>Tổng sản phẩm</h3>
        <div className="subtotal">
          <span>Tổng số</span>
          <span>{subtotal.toLocaleString("vi-VN")} VNĐ</span>
        </div>
        <div className="total">
          <span>Tổng tiền</span>
          <span style={{ color: "#B88E2F" }}>{subtotal.toLocaleString("vi-VN")} VNĐ</span>
        </div>
        <Link to="/checkout">
          <Button style={{ backgroundColor: "#F9F1E7" }} className="checkout-button">
            Thanh Toán
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default ShoppingCartPage;
