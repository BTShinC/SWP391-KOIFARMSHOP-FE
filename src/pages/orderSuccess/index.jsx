import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.scss'; 


const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="order-success-page">
      <div className="order-success-container">
     
        <h2 className="success-title">Đặt hàng thành công!</h2>
        <p className="success-message">
          Đơn hàng của bạn đã được đặt thành công.<br/> 
          Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.<br/> 
          Cảm ơn quý khách đã tin tưởng và mua sắm tại cửa hàng chúng tôi!
        </p>
        <div className="button-group">
          <button className="home-button" onClick={() => navigate('/')}>
            Về trang chủ
          </button>
          <button className="tracking-button" onClick={() => navigate('/orderTracking')}>
            Theo dõi đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

