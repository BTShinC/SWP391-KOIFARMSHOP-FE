import "./index.scss";
import { Button, InputNumber } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

function ShoppingCartPage() {
  const cartItems = [
    {
      id: 1,
      image: "/images/kohaku1.svg",
      name: "Tancho Kohaku",
      price: 250000,
      quantity: 1,
      content: "Mua lẻ",
    },
    {
      id: 2,
      image: "/images/kohaku1.svg",
      name: "Tancho Kohaku",
      price: 250000,
      quantity: 1,
      content: "Mua theo lô",
    },
  ];

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

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
                  defaultValue={item.quantity}
                  onChange={(value) => console.log("Change quantity", value)}
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
                onClick={() => console.log("Remove item", item.id)}
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
