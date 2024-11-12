import { Table, Button, Modal, message } from 'antd';
import { useState, useEffect } from 'react';
import AdminHeader from "../../../components/admin-components/admin-headers";
import AdminSideBar from "../../../components/admin-components/admin-sidebar";
import api from '../../../config/api';

function ManageFeedback({data}) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processingFeedbacks, setProcessingFeedbacks] = useState(new Set());
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await api.get('/feedback/all');
      setFeedbacks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      message.error('Không thể tải danh sách phản hồi');
      setLoading(false);
    }
  };

  // Tách riêng hàm update balance như trong ChangeStatus
  const updateAccountBalance = async (accountID, amount) => {
    const apiUrl = `account/updateBalance/${accountID}?amount=${amount}`;
    try {
      const response = await api.put(apiUrl);
      if (!response.ok) {
        throw new Error("Failed to update account balance");
      }
      return true;
    } catch (error) {
      console.error("Error updating account balance:", error);
      return false;
    }
  };

  const handleRefund = async (feedback) => {
  try {
    setProcessingFeedbacks(prev => new Set(prev).add(feedback.feedbackID));
    
    // Get order details for total
    const orderDetailsResponse = await api.get(`orders-details/order/${feedback.orderID}`);
    const orderTotal = orderDetailsResponse.data.reduce((sum, item) => sum + (item.discountedPrice), 0);

    // Get all orders and find matching order - MODIFIED
    const ordersResponse = await api.get('/orders');
    const order = ordersResponse.data.find(order => order.orderID === feedback.orderID);
    
    if (!order || !order.accountID) {
      message.error('Không tìm thấy thông tin đơn hàng!');
      return;
    }

    // Update order status to "Đã hủy"
    const updatedOrder = {
      ...order,
      status: "Đã hủy",
    };
    await api.put(`/orders/${feedback.orderID}`, updatedOrder);

    // Process refund
    const refundAmount = orderTotal + 200000;
    await updateAccountBalance(order.accountID, refundAmount);

    await api.post("/transactions/create", {
      accountID: order.accountID,
      price: refundAmount,
      date: new Date().toISOString(),
      description: `Hoàn tiền đơn hàng ${feedback.orderID} (Xử lý phản hồi)`
    });

    message.success(`Đã hoàn trả ${refundAmount.toLocaleString()} VND cho khách hàng`);
    fetchFeedbacks();
    setIsModalVisible(false);

  } catch (error) {
    console.error('Error:', error);
    message.error('Có lỗi xảy ra khi xử lý hoàn tiền');
  }
};

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderID',
      key: 'orderID',
    },
    
    {
      title: 'Nội dung phản hồi',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (image) => (
        <img 
          src={image} 
          alt="Feedback" 
          style={{ width: '100px', cursor: 'pointer' }}
          onClick={() => window.open(image, '_blank')}
        />
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Button 
          style={{
            backgroundColor: "#c3ae86",
            color: "white",
          }}
          onClick={() => {
            setSelectedFeedback(record);
            setIsModalVisible(true);
          }}
          disabled={record.status === 'Đã xử lý'}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="admin">
      <div className="admin-sidebar">
        <AdminSideBar />
      </div>
      <div className="admin-content">
        <AdminHeader />
        <h1 className="content__title">Quản lý phản hồi</h1>
        
        <Table 
          columns={columns} 
          dataSource={feedbacks}
          loading={loading}
          rowKey="feedbackID"
        />

        <Modal
          title="Chi tiết phản hồi"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Đóng
          </Button>,
          <Button
            key="refund"
            type="primary"
            onClick={() => handleRefund(selectedFeedback)}
            disabled={processingFeedbacks.has(selectedFeedback?.feedbackID)}
            loading={processingFeedbacks.has(selectedFeedback?.feedbackID)}
          >
            {processingFeedbacks.has(selectedFeedback?.feedbackID) 
              ? 'Đã hoàn tiền' 
              : 'Hoàn tiền'}
          </Button>,
          ]}
        >
          {selectedFeedback && (
            <div>
              <p><strong>Mã đơn hàng:</strong> {selectedFeedback.orderID}</p>
              <p><strong>Nội dung:</strong> {selectedFeedback.description}</p>
              <p><strong>Hình ảnh:</strong></p>
              <img 
                src={selectedFeedback.image} 
                alt="Feedback"
                style={{ maxWidth: '100%' }}
              />
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}

export default ManageFeedback;