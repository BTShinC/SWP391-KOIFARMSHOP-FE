// export default ChangeStatus;
import { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, message } from "antd";
import { updateOrderStatus } from "../../service/userService"; // Import API
import api from "../../config/api";

ChangeStatus.propTypes = {
  data: PropTypes.shape({
    orderID: PropTypes.string.isRequired, // Yêu cầu orderID hợp lệ
    status: PropTypes.string.isRequired,  // Trạng thái ban đầu
  }).isRequired,
};

function ChangeStatus({ data }) {
  const [showButtons, setShowButtons] = useState(false); // Kiểm soát hiển thị nút
  const [status, setStatus] = useState(data.status); // Trạng thái hiện tại của đơn hàng
  const orderAccountID = data.accountID;

  // Xử lý cập nhật trạng thái đơn hàng
  const updateAccountBalance = async (accountID, amount) => {
    const apiUrl = `/account/updateBalance/${accountID}?amount=${amount}`;
    try {
      const response = await api.put(apiUrl); // Use api.put for PUT requests
      if (!response.ok) {
        throw new Error("Failed to update account balance");
      }
    } catch (error) {
      console.error("Error updating account balance:", error);
    }
  };
  // Xử lý cập nhật trạng thái đơn hàng
  const handleUpdateStatus = async (newStatus) => {
    try {
      const date = new Date().toISOString();

      // Nếu trạng thái mới là "Đã hủy", thực hiện hoàn tiền
      if (newStatus === "Đã hủy") {
        const refundAmount = data.discountedTotal + 200000;
  
        // Log thông tin trước khi gửi request
        console.log("Request Data:", {
          endpoint: `account/updateBalance/${orderAccountID}`,
          body: {
            accountID: orderAccountID,
            amount: refundAmount,
          }
        });
        await updateAccountBalance(orderAccountID, refundAmount);
        // Log response từ API
        // Tạo transaction
        const transactionResponse = await api.post("/transactions/create", {
          accountID: orderAccountID,
          price: refundAmount,
          date: date,
          description: `Hoàn tiền đơn hàng ${data.orderID} (Admin hủy đơn)`
        });
  
        // Log transaction response
        console.log("Transaction Response:", transactionResponse.data);
  
        message.success(`Đã hoàn trả ${refundAmount.toLocaleString()} VND cho khách hàng`);
      }

      // Cập nhật trạng thái đơn hàng
      await updateOrderStatus(data.orderID, newStatus, orderAccountID, date);
      setStatus(newStatus);
      message.success(`Trạng thái cập nhật thành công: ${newStatus}`);
      setShowButtons(false);
      // window.location.reload();
    } catch (error) {
      message.error("Lỗi khi cập nhật trạng thái!");
      console.error("Error updating order status:", error);
    }
  };

  // Hiển thị modal xác nhận nếu trạng thái là "Đã hủy"
  const confirmCancel = () => {
    Modal.confirm({
      title: "Bạn có chắc muốn hủy đơn này?",
      content: "Hệ thống sẽ hoàn tiền lại cho khách hàng sau khi hủy đơn.",
      okText: "Đồng ý",
      cancelText: "Hủy",
      onOk: () => handleUpdateStatus("Đã hủy"),
    });
  };

  return (
    <div>
      {!showButtons ? (
        <Button onClick={() => setShowButtons(true)}>Cập nhật trạng thái</Button>
      ) : (
        <div className="change-status-button__container">
          <Button onClick={() => setShowButtons(false)}>Ẩn cập nhật</Button>

          <div className="change-status-button">
            {status === "Đang xử lý" && (
              <>
                <Button style={{marginTop:10,marginBottom:10}} onClick={() => handleUpdateStatus("Đang chuẩn bị")} className="btn-button">
                  Xác nhận
                </Button>
                <Button type="primary" danger onClick={confirmCancel} style={{marginTop:10}}>
                  Hủy đơn
                </Button>
              </>
            )}

            {status === "Đang chuẩn bị" && (
              <Button style={{marginTop:10}} onClick={() => handleUpdateStatus("Đang vận chuyển")}>
                Đang vận chuyển
              </Button>
            )}
            {status === "Đang vận chuyển" && (
              <Button style={{marginTop:10}} onClick={() => handleUpdateStatus("Đã giao hàng")}>
                Đã giao hàng
              </Button>
            )}
            {status === "Đã giao hàng" && (
              <Button style={{marginTop:10}} onClick={() => handleUpdateStatus("Hoàn tất")}>
                Hoàn tất
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ChangeStatus;

