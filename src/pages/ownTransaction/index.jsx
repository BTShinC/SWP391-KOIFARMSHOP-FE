import { useEffect, useState, useCallback } from "react";
import { Table, Spin, message } from "antd";
import { fetchTransactionsByID } from "../../service/userService";
import { useSelector } from "react-redux";
import './index.scss'
OwnTransaction.propTypes = {};

function OwnTransaction() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true); 

  const user = useSelector(state => state.user)
    console.log(user?.accountID)
  // Hàm lấy danh sách giao dịch từ API
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchTransactionsByID(user?.accountID);
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      message.error("Lỗi khi tải danh sách giao dịch");
    } finally {
      setLoading(false);
    }
  }, [user?.accountID]); 

  useEffect(() => {
    if (user?.accountID) {
      fetchTransactions();
    } else {
      message.error("Không tìm thấy tài khoản người dùng.");
    }
  }, [user?.accountID, fetchTransactions]);

  // Cấu hình các cột cho bảng giao dịch
  const columns = [
    {
      title: "Mã giao dịch",
      dataIndex: "transactionID",
      key: "transactionID",
    },
    {
      title: "Ngày giao dịch",
      dataIndex: "date",
      key: "date",
      render: (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
      },
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Số tiền",
      dataIndex: "price",
      key: "price",
      render: (amount) => `${amount.toLocaleString()} VND`, // Định dạng tiền tệ
    },
  ];

  return (
    <div className="own-transaction-page">
      <h2>Lịch sử giao dịch của bạn</h2>

      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          columns={columns}
          dataSource={transactions}
          rowKey="transactionID"
          pagination={{ pageSize: 20 }}
        />
      )}
    </div>
  );
}

export default OwnTransaction;
