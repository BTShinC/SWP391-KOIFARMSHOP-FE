import { useState, useEffect } from "react";
import "./index.scss"; // Import styles
import vnNum2Words from "vn-num2words"; // Import the vn-num2words library
import { toast } from "react-toastify"; // Import toast for notifications
import { useSelector } from "react-redux";

import api from "../../config/api";
import { withdrawMoney } from "../../service/userService";
import { Button, Form, Input, Modal } from "antd";
import CurrencyInput from "../../components/CurrencyInput/CurrencyInput";


function WalletPage() {
  const [amount, setAmount] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [transactions, setTransactions] = useState([]); // State for transaction history
  const [accountBalance, setAccountBalance] = useState(0); // State for account balance
  const user = useSelector((state) => state.user);
  console.log("Current user:", user);
  const [isWithdrawModalVisible, setIsWithdrawModalVisible] = useState(false);
  const [withdrawForm] = Form.useForm();

  const handleWithdrawalClick = () => {
    setIsWithdrawModalVisible(true);
  };

  const handleWithdrawalCancel = () => {
    setIsWithdrawModalVisible(false);
    withdrawForm.resetFields();
  };

  // Function to fetch transaction history
const fetchTransactionHistory = async () => {
  if (!user || !user.accountID) {
    console.error("User or account information is missing");
    return;
  }

  try {
    // Fetch regular transactions (nạp tiền)
    const transactionsResponse = await api.get(
      `/transactions/account/${user.accountID}`
    );

    // Fetch withdrawal history (rút tiền)
    const withdrawalsResponse = await api.get(
      `/AccountWithdrawal/account/${user.accountID}`
    );

    // Combine and sort all transactions
    const allTransactions = [
      // Chỉ lấy các giao dịch nạp tiền
      ...transactionsResponse.data.map(transaction => ({
        ...transaction,
        type: 'deposit',
        description: `Nạp tiền vào ví: ${transaction.price.toLocaleString()} VND`
      })),
      // Lấy các giao dịch rút tiền
      ...withdrawalsResponse.data.map((withdrawal) => ({
        ...withdrawal,
        transactionID: withdrawal.accountWithdrawalId,
        price: -withdrawal.pricesend, // Use negative value for withdrawals
        date: withdrawal.date,
        type: 'withdraw',
        description: `Rút tiền: ${withdrawal.pricesend.toLocaleString()} VND - ${withdrawal.bank_name}`,
      })),
    ];

    // Sort combined transactions by date, most recent first
    const sortedTransactions = allTransactions.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    setTransactions(sortedTransactions);
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    toast.error("Failed to load transaction history.");
  }
};

  // Fetch account balance from API when the component mounts
  useEffect(() => {
    const fetchAccountBalance = async () => {
      if (user.accountID) {
        try {
          const response = await api.get(`/account/${user.accountID}`);
          setAccountBalance(response.data.accountBalance); // Set the fetched balance
        } catch (error) {
          console.error("Error fetching account balance:", error);
        }
      }
    };

    fetchAccountBalance();
  }, [user]);

  useEffect(() => {
    // Fetch transaction history when the component mounts
    fetchTransactionHistory();
  }, [user]); // Fetch again if accountID changes

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value >= 0) {
      setAmount(value);
    }
  };

  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
    setAmount(""); // Clear input when a level is selected
  };

  const handleTransactionConfirm = async () => {
    const totalAmount = amount || selectedLevel;

    const token = localStorage.getItem("token");
    console.log(token);
    if (!token) {
      toast.error("Bạn cần đăng nhập để thực hiện giao dịch.");
      return;
    }

    // Check if the total amount is less than 100,000
    if (totalAmount < 100000) {
      toast.error("Số tiền tối thiểu là 100.000 VND"); // Notify for minimum amount alert
      return;
    }

    // Check if the total amount exceeds the limit of 21,474,836
    if (totalAmount > 21474836) {
      toast.error("Số tiền tối đa là 21.474.836 VND"); // Notify for maximum amount alert
      return;
    }

    const accountId = user.accountID; // Sửa từ accountId thành accountID
    console.log("Account ID:", accountId);

    console.log("Total Amount (Price):", totalAmount); // Log the total amount

    // Get the current date in ISO format
    const currentDate = new Date().toISOString();

    try {
      // Tạo đối tượng transactionData
      const transactionData = {
        accountID: user.accountID,
        price: totalAmount,
        date: new Date(),
        description: `Nạp tiền vào ví: ${totalAmount.toLocaleString()} VND`,
      };
      console.log("Data to send:", {
        accountID: accountId,
        price: totalAmount,
        date: currentDate,
      });


      // const response = await api.post(
      //   "/transactions/create",
      //   {
      //     // Use the api instance
      //     accountID: accountId,
      //     price: totalAmount,
      //     date: new Date().toISOString(), // Add the current date
      //   },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );
      const response = await api.post("/transactions/create", transactionData);

      // Redirect to VNPAY link
      const vnpayLink = response.data; // Assuming response.data contains the VNPAY link
      const transactionId = response.data.vnp_TxnRef; // Lấy ID giao dịch từ phản hồi
      window.location.href = vnpayLink; // Chuyển hướng đến liên kết VNPAY

      toast.success("Đã xác nhận giao dịch! Vui lòng chờ cập nhật."); // Thông báo thành công
      console.log("Response from API:", vnpayLink); // Ghi log dữ liệu phản hồi

      // Lấy lịch sử giao dịch đã cập nhật
      fetchTransactionHistory(); // Làm mới lịch sử giao dịch

      // Gửi phản hồi giao dịch đến API sau khi thanh toán thành công
      const transactionResponse = {
        vnp_TxnRef: transactionId, // Sử dụng ID giao dịch thực tế từ phản hồi
        vnp_ResponseCode: "00", // Thay thế bằng mã phản hồi thực tế
        vnp_Amount: totalAmount.toString(), // Chuyển đổi số tiền thành chuỗi
      };

      // Sử dụng api instance để gửi phản hồi
      const apiResponse = await api.post(
        `/transactions/vnpay/response`,
        transactionResponse
      ); // Sử dụng đường dẫn tương đối với api instance
      console.log("API Response:", apiResponse.data); // Kiểm tra xem có nhận được phản hồi không
    } catch (error) {
      console.error("Error adding transaction:", error);
      // const errorMessage = error.response?.data?.message || "Có lỗi xảy ra."; // Lấy thông báo lỗi từ server
      // toast.error("Giao dịch thất bại: " + errorMessage); // Thông báo thất bại với thông báo lỗi
    }

    setAmount(""); // Đặt lại số tiền sau khi xác nhận
    setSelectedLevel(null); // Đặt lại cấp độ đã chọn
  };

  const handleWithdrawal = async (values) => {
    try {
      const withdrawalAmount = parseFloat(values.amount);

      if (withdrawalAmount <= 0 || withdrawalAmount > accountBalance) {
        toast.error("Số tiền rút không hợp lệ hoặc vượt quá số dư");
        return;
      }
      const description = `Rút tiền: ${withdrawalAmount.toLocaleString()} VND - ${
        values.bankName
      }`;

      const response = await withdrawMoney({
        amount: withdrawalAmount,
        accountID: user.accountID,
        accountNumber: values.accountNumber,
        accountHolderName: values.accountHolderName,
        bankBranch: values.bankBranch,
        bankName: values.bankName,
        description: description,
      });
      console.log(response);

      if (response) {
        toast.success("Yêu cầu rút tiền đã được gửi thành công!");
        fetchTransactionHistory();
        setIsWithdrawModalVisible(false);
        withdrawForm.resetFields();
      }
    } catch (error) {
      console.error("Error withdrawing money:", error);
      toast.error("Có lỗi xảy ra khi rút tiền. Vui lòng thử lại sau.");
    }
  };
  // // Sort transactions by transactionID in descending order
  // const sortedTransactions = transactions.sort((a, b) => {
  //   return b.transactionID.localeCompare(a.transactionID); // Sort by transactionID
  // });

  return (
    <div className="wallet-page-wrapper">
      <div className="wallet-page">
        <div className="account-balance">
          <h2 className="balance-number">
            Số dư tài khoản: <br />
            {accountBalance.toLocaleString("vi-VN")} VND
          </h2>
        </div>
        <div className="amount-selection">
          <h2>Vui lòng chọn số tiền cần nạp</h2>
          
          <div className="button-group">
            <button
              className="fixed-ammount-button"
              onClick={() => handleLevelSelect(1000000)}
            >
              1.000.000 VND
            </button>
            <button
              className="fixed-ammount-button"
              onClick={() => handleLevelSelect(2000000)}
            >
              2.000.000 VND
            </button>
          </div>
          <div className="button-group">
            <button
              className="fixed-ammount-button"
              onClick={() => handleLevelSelect(5000000)}
            >
              5.000.000 VND
            </button>
            <button
              className="fixed-ammount-button"
              onClick={() => handleLevelSelect(10000000)}
            >
              10.000.000 VND
            </button>
          </div>
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Nhập số tiền mong muốn"
          />
          {amount && <p>{vnNum2Words(amount)} VND</p>}{" "}
          {/* Display amount in words using vn-num2words */}
        </div>
        <p>Lưu ý: Số tiền tối đa là 21.474.836 VND vì chính sách của các ngân hàng!</p>
        <button className="confirm-button" onClick={handleTransactionConfirm}>
          Xác nhận
        </button>
        <Button
          onClick={handleWithdrawalClick}
          type="primary"
          className="confirm-button"
        >
          Rút tiền
        </Button>
        <Modal
          title="Rút tiền"
          visible={isWithdrawModalVisible}
          onCancel={handleWithdrawalCancel}
          footer={null}
        >
          <Form
            form={withdrawForm}
            onFinish={handleWithdrawal}
            layout="vertical"
          >
            <Form.Item
              name="amount"
              label="Số tiền rút"
              rules={[{ required: true, message: "Vui lòng nhập số tiền rút" }]}
            >
              <CurrencyInput />
            </Form.Item>
            <Form.Item
              name="accountNumber"
              label="Số tài khoản"
              rules={[
                { required: true, message: "Vui lòng nhập số tài khoản" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="accountHolderName"
              label="Tên chủ tài khoản"
              rules={[
                { required: true, message: "Vui lòng nhập tên chủ tài khoản" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="bankBranch"
              label="Chi nhánh ngân hàng"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập chi nhánh ngân hàng",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="bankName"
              label="Tên ngân hàng"
              rules={[
                { required: true, message: "Vui lòng nhập tên ngân hàng" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Xác nhận rút tiền
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Transaction History Table */}
        <h2>Lịch sử của Ví tiền</h2>
        <table className="transaction-history-table">
          <thead>
            <tr>
              <th>Mã giao dịch</th>
              <th>Số tiền</th>
              <th>Ngày giao dịch</th>
              <th>Nội dung</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr
                key={
                  transaction.transactionID || transaction.accountWithdrawalId
                }
              >
                <td>
                  {transaction.transactionID || transaction.accountWithdrawalId}
                </td>
                <td className={transaction.price < 0 ? "negative" : "positive"}>
                  {transaction.price.toLocaleString()} VND
                </td>
                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                <td>{transaction.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WalletPage;
