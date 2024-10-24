import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { toast } from "react-toastify"; // Nhập toast nếu bạn sử dụng để thông báo
import api from "../../config/api";

const VnpayResponsePage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Lấy các tham số cần thiết
  const transactionID = queryParams.get("transactionID");

  const amount = queryParams.get("vnp_Amount");

  const responseCode = queryParams.get("vnp_ResponseCode");

  // Xử lý phản hồi
  useEffect(() => {
    const sendTransactionResponse = async () => {
      const transactionResponse = {
        vnp_Amount: amount.toString(), // Đảm bảo rằng amount là chuỗi
        vnp_ResponseCode: responseCode || "00", // Thay thế bằng mã phản hồi thực tế
        vnp_TxnRef: transactionID, // Sử dụng ID giao dịch thực tế từ phản hồi
      };

      try {
        // Gửi phản hồi đến API
        console.log("Data being sent to API:", transactionResponse);
        const apiResponse = await api.post(
          `/transactions/vnpay/response`,
          transactionResponse
        );
        console.log("API Response:", apiResponse.data); // Kiểm tra xem có nhận được phản hồi không
        toast.success("Giao dịch đã được xác nhận thành công!"); // Thông báo thành công
      } catch (error) {
        console.error("Error sending transaction response:", error);
        const errorMessage = error.response?.data?.message || "Có lỗi xảy ra."; // Lấy thông báo lỗi từ server
        toast.error("Giao dịch thất bại: " + errorMessage); // Thông báo thất bại với thông báo lỗi
      }
    };

    // Gọi hàm gửi phản hồi
    sendTransactionResponse();
  }, [transactionID, amount, responseCode]); // Chạy lại khi các tham số thay đổi

  return (
    <div>
      <h1>Transaction Response</h1>
      <p>Transaction ID: {transactionID}</p>
      <p>Amount: {amount}</p>
      <p>Response Code: {responseCode}</p>
      {/* Hiển thị thông tin khác nếu cần */}
    </div>
  );
};

export default VnpayResponsePage;
