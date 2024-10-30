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
    // Bước 1: Lấy chi tiết đơn hàng để có total
    const orderDetailsResponse = await api.get(`orders-details/order/${feedback.orderID}`);
    console.log("Order Details Response:", orderDetailsResponse.data);
    
    // Tính tổng tiền từ chi tiết đơn hàng
    const orderTotal = orderDetailsResponse.data.reduce((sum, item) => {
      return sum + (item.discountedPrice);
    }, 0);

    // Bước 2: Lấy thông tin đơn hàng để có accountID
    const orderResponse = await api.get(`feedback/order/${feedback.orderID}`);
    console.log("Order Response:", orderResponse.data);
    const order = orderResponse.data;

    if (!order || !order.accountID) {
      message.error('Không tìm thấy thông tin đơn hàng!');
      return;
    }

    // Bước 3: Lấy thông tin tài khoản để kiểm tra
    const accountResponse = await api.get(`/account/${order.accountID}`);
    const account = accountResponse.data;

    if (!account) {
      message.error('Không tìm thấy thông tin tài khoản!');
      return;
    }

    // Bước 4: Tính toán số tiền hoàn
    const refundAmount = orderTotal + 200000; // total từ order details + phí ship

    console.log("Refund Info:", {
      orderID: feedback.orderID,
      accountID: order.accountID,
      currentBalance: account.accountBalance,
      orderTotal: orderTotal,
      refundAmount: refundAmount
    });

    if (isNaN(refundAmount) || refundAmount <= 0) {
      message.error('Số tiền hoàn không hợp lệ!');
      return;
    }

   
    await updateAccountBalance(order.accountID, refundAmount);
    // console.log(updateResult);
    // if (!updateResult) {
    //   throw new Error("Cập nhật số dư thất bại");
    // }

    // Tạo transaction ghi nhận hoàn tiền
    const transactionResponse = await api.post("/transactions/create", {
      accountID: order.accountID,
      price: refundAmount,
      date: new Date().toISOString(),
      description: `Hoàn tiền đơn hàng ${feedback.orderID} (Xử lý phản hồi)`
    });

    console.log("Transaction Response:", transactionResponse.data);

    // // Cập nhật trạng thái feedback
    // await api.put(`/feedback/${feedback.feedbackID}`, {
    //   feedbackID: feedback.feedbackID,
    //   description: feedback.description,
    //   image: feedback.image,
    //   orderID: feedback.orderID,
    //   accountID: order.accountID,
    // //   status: 'Đã xử lý'
    // });

    message.success(`Đã hoàn trả ${refundAmount.toLocaleString()} VND cho khách hàng`);
    fetchFeedbacks(); // Refresh danh sách
    setIsModalVisible(false);

  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
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
      title: 'Khách hàng',
      dataIndex: 'accountID',
      key: 'accountID',
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
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="primary"
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
              <p><strong>Khách hàng:</strong> {selectedFeedback.accountID}</p>
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