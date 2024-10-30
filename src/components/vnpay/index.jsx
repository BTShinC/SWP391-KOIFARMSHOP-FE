import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import './index.scss'; 
import { toast } from "react-toastify"; // Nhập toast nếu bạn sử dụng để thông báo
import api from "../../config/api";

const VnpayResponsePage = () => {
  const navigate = useNavigate();
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

        if (responseCode === "00") { // Check if the transaction was successful
          // Create the transaction in your system
          const transactionData = {
            accountID: user.accountID,
            price: amount,
            date: new Date(),
            description: `Xác nhận nạp tiền vào ví: ${parseInt(amount).toLocaleString()} VND`,
          };
          await api.post("/transactions/create", transactionData);
          toast.success("Giao dịch đã được xác nhận thành công!"); // Thông báo thành công
        } else {
          toast.error("Giao dịch thất bại: " + responseCode); // Thông báo thất bại với mã phản hồi
        }
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
      <div className="payment-success-page">
        <div className="payment-success-container">
          <h2 className="success-title">Chi tiết giao dịch</h2>
          <p className="success-message">
            Mã giao dịch: {transactionID}<br/> 
            Số tiền: {amount}<br/>
            <br/> 
            Cảm ơn quý khách đã tin tưởng và sử dụng dịch vụ của chúng tôi!
          </p>
          <div className="button-group">
            <button className="home-button" onClick={() => navigate('/')}>
              Về trang chủ
            </button>
            <button className="tracking-button" onClick={() => navigate('/wallet')}>
              Ví tiền
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VnpayResponsePage;