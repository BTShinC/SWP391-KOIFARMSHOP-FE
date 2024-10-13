import "./index.scss";
import { Button, InputNumber } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from "../redux/features/createSlice";


function ShoppingCartPage() {
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleQuantityChange = (id, value) => {
    dispatch(updateQuantity({ id, quantity: value }));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
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
              <div className="item-quantity">
                <InputNumber
                  min={1}
                  max={100}
                  value={item.quantity}
                  onChange={(value) => handleQuantityChange(item.id, value)}
                />
              </div>
              <div className="item-content">
                <span>{item.content}</span>
              </div>
            </div>
            <div className="item-remove">
              <Button
                type="text"
                icon={<DeleteOutlined style={{ color: "#B88E2F" }} />}
                onClick={() => handleRemoveItem(item.id)}
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
          <span style={{color:"#B88E2F"}}>{subtotal.toLocaleString("vi-VN")} VNĐ</span>
        </div>
        <Button style={{backgroundColor:"#F9F1E7"}} className="checkout-button">
          Thanh Toán
        </Button>
      </div>
    </div>
  );
}

export default ShoppingCartPage;
