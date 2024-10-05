import { Button, Divider, Modal, List } from "antd";
import "./index.scss";
import { CloseOutlined, ShoppingOutlined } from "@ant-design/icons";

const ShoppingCart = ({ cartItems, onClose }) => {
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <Modal
      visible={true}
      footer={null}
      closable={false}
      width={417}
      style={{ top: 20, right: 20, position: "fixed" }}
      bodyStyle={{ padding: "20px", position: "relative" }} // Ensure relative positioning for absolute child
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
                  alt={item.title}
                  style={{ width: 50, height: 50 }}
                />
              }
              title={item.title}
              description={
                <>
                  SL: {item.quantity} x
                  <span style={{ color: "#B88E2F" }}> {item.price}VNĐ</span>
                </>
              }
            />
          </List.Item>
        )}
      />
      <br />
      <h5>
        Tổng:{" "}
        <span style={{ color: "#B88E2F", paddingLeft: 60 }}>{subtotal}VNĐ</span>
      </h5>

      <Divider />

      <div className="cart-buttons">
        <Button type="default">Giỏ hàng</Button>
        <Button type="default">Thanh toán</Button>
      </div>
    </Modal>
  );
};

export default ShoppingCart;
