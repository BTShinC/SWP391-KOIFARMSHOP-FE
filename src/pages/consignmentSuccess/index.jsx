import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.scss'; 


const ConsignmentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="consignment-success-page">
      <div className="consignment-success-container">
     
        <h2 className="success-title">Đã tiếp nhận yêu cầu ký gửi!</h2>
        <p className="success-message">
          Yêu cầu ký gửi của bạn đã được tiếp nhận.<br/> 
          Chúng tôi sẽ xử lý yêu cầu ký gửi của bạn trong thời gian sớm nhất.<br/> 
          Cảm ơn quý khách đã tin tưởng và sử dụng dịch vụ của chúng tôi!
        </p>
        <div className="button-group">
          <button className="home-button" onClick={() => navigate('/')}>
            Về trang chủ
          </button>
          <button className="tracking-button" onClick={() => navigate('/consignmentTracking')}>
            Theo dõi ký gửi
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsignmentSuccess;

