import { Button, Divider, Modal, List, message, Spin } from "antd";
import "./index.scss";
import { CloseOutlined, ShoppingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { setCartItems, removeFromCart} from "../../pages/redux/features/createSlice";
import { useEffect, useState } from "react";
import { deleteCartItem, fetchCartItems } from "../../service/userService";

const ShoppingCart = ({ onClose }) => {
  const cartItems = useSelector(state => state.cart.items);
  const account = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   console.log("Current account:", account);

    // const loadCartItems = async () => {
    //   if (account && account.accountID) {
    //     try {
    //       setLoading(true);
    //       const items = await fetchCartItems(account.accountID);
    //       dispatch(setCartItems(items));
    //     } catch (error) {
    //       console.error("Failed to load cart items:", error);
    //       message.error("Không thể tải giỏ hàng");
    //     } finally {
    //       setLoading(false);
    //     }
    //   } else {
    //     console.log("No account ID available");
    //     setLoading(false);
    //   }
    // };

    const loadCartItems = async () => {
      if (account.accountID) {
        try {
          setLoading(true);
          const items = await fetchCartItems(account.accountID);
          dispatch(setCartItems(items));
        } catch (error) {
          console.error("Failed to load cart items:", error);
          message.error("Không thể tải giỏ hàng");
        } finally {
          setLoading(false);
        }
      } else {
        console.log("No account ID available");
        setLoading(false);
      }
    };


  //   loadCartItems();
  // }, [account, dispatch]);

  useEffect(() => {
    console.log("Current account:", account);
    loadCartItems(); // Gọi hàm loadCartItems khi component mount
  }, [account, dispatch]);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price,
    0
  );


  const handleRemoveFromCart = async (cartItemId) => {
    try {
      // Gọi API để xóa item
      await deleteCartItem(cartItemId); // Gọi hàm deleteCartItem
      dispatch(removeFromCart(cartItemId)); // Cập nhật Redux store
      message.success("Đã xóa sản phẩm khỏi giỏ hàng");
      // loadCartItems();
    } catch (error) {
      console.error("Error removing item from cart:", error);
      message.error("Không thể xóa sản phẩm khỏi giỏ hàng");
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <Modal
      open={true}
      footer={null}
      closable={false}
      width={417}
      style={{ top: 20, right: 20, position: "fixed" }}
      styles={{ body: { padding: "20px", position: "relative" } }}
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
        dataSource={cartItems}
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
              title={item.productName}
              description={
                <>
                  <div>
                    <strong>Tên:</strong> {item.name} <br />
                    {/* <strong>Số lượng:</strong> {item.quantity} <br /> */}
                    <strong>Giá:</strong> {item.price.toLocaleString("vi-VN")} VNĐ
                  </div>
                </>
              }
            />
            <Button onClick={() => handleRemoveFromCart(item.shopCartID)}>Xóa</Button>
          </List.Item>
        )}
      />
      <br />
      <h5>
        Tổng:{" "}
        <span style={{ color: "#B88E2F", paddingLeft: 60 }}>{subtotal.toLocaleString("vi-VN")} VNĐ</span>
      </h5>

      <Divider />

      <div className="cart-buttons">
        <Link to="/shoppingcart">
          <Button type="default">Giỏ hàng</Button>
        </Link>
        <Link to="/checkout">
          <Button type="primary">Thanh toán</Button>
        </Link>
      </div>
    </Modal>
  );
};

export default ShoppingCart;
