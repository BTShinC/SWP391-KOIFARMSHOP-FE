import { Button, Divider, Modal, List } from "antd";
import "./index.scss";
import { CloseOutlined, ShoppingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from "../../pages/redux/features/createSlice";
import { useEffect, useState } from "react";


const ShoppingCart = ({ onClose }) => {
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();
  const [modalItems, setModalItems] = useState([]);

  useEffect(() => {
    setModalItems(cartItems);
  }, [cartItems]);

  const subtotal = modalItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleAddToCart = (item) => {
    // Dispatch to Redux store
    dispatch(addToCart({ ...item, quantity: 1 }));

    // Add to modal items
    setModalItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(i => i.id === item.id);
      if (existingItemIndex !== -1) {
        // If item exists, create a new array with updated quantity
        return prevItems.map((i, index) => 
          index === existingItemIndex ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        // If item doesn't exist, add it to the array
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });

    // Save to database
    saveOrderToDatabase({ ...item, quantity: 1 });
  };

  const saveOrderToDatabase = async (item) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });
      if (!response.ok) {
        throw new Error('Failed to save order');
      }
      console.log('Order saved successfully');
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  return (
    <Modal
      visible={true}
      footer={null}
      closable={false}
      width={417}
      style={{ top: 20, right: 20, position: "fixed" }}
      bodyStyle={{ padding: "20px", position: "relative" }}
    >
      <Button
        className="close-button"
        onClick={onClose}
        icon={<CloseOutlined />}
      />
      <div className="head">
        <h3>Giỏ hàng</h3>
        <ShoppingOutlined style={{ fontSize: 20, paddingLeft: 50 }} />
      </div>

      <Divider style={{ backgroundColor: "#D9D9D9" }} />
      <List
        itemLayout="horizontal"
        dataSource={modalItems}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: 50, height: 50 }}
                />
              }
              title={item.name}
              description={
                <>
                  SL: {item.quantity} x
                  <span style={{ color: "#B88E2F" }}> {item.price.toLocaleString("vi-VN")}VNĐ</span>
                </>
              }
            />
            <Button onClick={() => handleAddToCart(item)}>Thêm vào giỏ hàng</Button>
          </List.Item>
        )}
      />
      <br />
      <h5>
        Tổng:{" "}
        <span style={{ color: "#B88E2F", paddingLeft: 60 }}>{subtotal.toLocaleString("vi-VN")}VNĐ</span>
      </h5>

      <Divider />

      <div className="cart-buttons">
        <Link to="/shoppingcart">
          <Button type="default">Giỏ hàng</Button>
        </Link>
        <Link to="/">
          <Button type="default">Thanh toán</Button>
        </Link>
      </div>
    </Modal>
  );
};

export default ShoppingCart;
