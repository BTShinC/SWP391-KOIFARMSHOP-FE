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

  const transactionID = queryParams.get("transactionID");
  const amount = queryParams.get("vnp_Amount");
  const responseCode = queryParams.get("vnp_ResponseCode");

  useEffect(() => {
    const handleTransaction = async () => {
      // Nếu giao dịch bị hủy hoặc thất bại
      if (responseCode === "24" || responseCode !== "00") {
        console.log("Giao dịch bị hủy:", {
          transactionID,
          responseCode,
        });
        toast.info("Giao dịch đã bị hủy!");
        // Chuyển về trang ví sau 2 giây
        setTimeout(() => {
          navigate('/wallet');
        }, 2000);
        return; // Thoát luôn, không ghi transaction
      }

      // Chỉ xử lý và ghi transaction khi giao dịch thành công (responseCode === "00")
      try {
        const transactionResponse = {
          vnp_Amount: amount?.toString(),
          vnp_ResponseCode: responseCode,
          vnp_TxnRef: transactionID,
        };

        console.log("Data being sent to API:", transactionResponse);
        const apiResponse = await api.post(
          `/transactions/vnpay/response`,
          transactionResponse
        );
        console.log("API Response:", apiResponse.data);
        toast.success("Nạp tiền thành công!");
        
        // Chuyển về trang ví sau khi thành công
        setTimeout(() => {
          navigate('/wallet');
        }, 2000);
      } catch (error) {
        console.error("Error processing transaction:", error);
        const errorMessage = error.response?.data?.message || "Có lỗi xảy ra.";
        toast.error("Giao dịch thất bại: " + errorMessage);
      }
    };

    handleTransaction();
  }, [transactionID, amount, responseCode, navigate]);

  // UI hiển thị trạng thái
  const isSuccess = responseCode === "00";
  const message = isSuccess 
    ? "Giao dịch hoàn tất" 
    : "Giao dịch đã bị hủy";

  return (
    <div className="payment-success-page">
      <div className="payment-success-container">
        <h2 className="success-title">{message}</h2>
        <p className="success-message">
          {isSuccess ? (
            <>
              Mã giao dịch: {transactionID}<br/>
              Số tiền: {(Number(amount)/100).toLocaleString()} VND<br/>
              <br/>
              Cảm ơn quý khách đã tin tưởng và sử dụng dịch vụ của chúng tôi!
            </>
          ) : (
            <>
              Giao dịch đã bị hủy.<br/>
              Quý khách có thể thử lại giao dịch hoặc chọn phương thức thanh toán khác.
            </>
          )}
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
  );
};
export default VnpayResponsePage;
