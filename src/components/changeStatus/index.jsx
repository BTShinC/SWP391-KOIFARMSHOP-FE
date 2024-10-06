import PropTypes from "prop-types";
import { Button, Modal } from "antd";
import { useState } from "react";
import "./index.scss";

ChangeStatus.propTypes = {
  data: PropTypes.object.isRequired, // Nhận dữ liệu là một đối tượng
};

function ChangeStatus({ data }) {
  const initOrder = {
    orderId: data.orderId,
    customerId: data.customerId,
    totalAmount: data.totalAmount,
    orderDate: data.orderDate,
    status: data.status,
  };

  const [newOrder, setNewOrder] = useState(initOrder);
  const [showButtons, setShowButtons] = useState(false); // Trạng thái để hiển thị các nút cập nhật

  // Hàm xử lý khi nhấn vào nút "Cập nhật trạng thái"
  const handleShowButtons = () => {
    setShowButtons(true); // Hiển thị các nút cập nhật
  };
  const handleCloseButtons = () => {
    setShowButtons(false);
  };

  // Hàm xử lý khi cập nhật trạng thái đơn hàng
  const handleUpdateStatus = (newStatus) => {
    if (newStatus === "Đã hủy") {
      // Hiển thị Modal xác nhận hủy
      Modal.confirm({
        title: "Bạn chắc chắn muốn hủy?",
        okText: "Yes",
        cancelText: "No",
        centered: true,
        onOk: () => {
          // Hành động khi người dùng nhấn "Yes"
          setNewOrder((preNewOrder) => {
            const updatedForm = {
              ...preNewOrder,
              status: newStatus,
            };
            console.log(updatedForm);
            return updatedForm;
          });
        },
        onCancel: () => {
          // Hành động khi người dùng nhấn "No" (Không cần làm gì nếu chỉ muốn đóng modal)
        },
      });
    } else {
      // Cập nhật trạng thái nếu không phải "Đã hủy"
      setNewOrder((preNewOrder) => {
        const updatedForm = {
          ...preNewOrder,
          status: newStatus,
        };
        console.log(updatedForm);
        return updatedForm;
      });
    }
  };

  return (
    <div>
      {!showButtons ? (
        <Button onClick={handleShowButtons}>Cập nhật trạng thái</Button>
      ) : (
        <div className="change-status-button__container">
          <div className="change-status-button__close">
            <Button onClick={handleCloseButtons}>Ẩn cập nhật trạng thái</Button>
          </div>
          <div className="change-status-button">
            {newOrder.status == "Chờ xác nhận" ? (
              <>
                <Button
                  className="custom-button__transport"
                  onClick={() => handleUpdateStatus("Đang chuẩn bị")}
                >
                  Xác nhận
                </Button>
                <Button
                  type="primary"
                  danger
                  onClick={() => handleUpdateStatus("Đã hủy")}
                >
                  Hủy đơn
                </Button>
              </>
            ) : newOrder.status == "Đang chuẩn bị" ? (
              <Button
                className="custom-button__transport"
                onClick={() => handleUpdateStatus("Đang vận chuyển")}
              >
                Đang vận chuyển
              </Button>
            ) : newOrder.status == "Đang vận chuyển" ? (
              <Button
                className="custom-button"
                onClick={() => handleUpdateStatus("Hoàn tất")}
              >
                Hoàn tất
              </Button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

export default ChangeStatus;
