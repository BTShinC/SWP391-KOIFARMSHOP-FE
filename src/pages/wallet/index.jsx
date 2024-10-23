import { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import "./index.scss"; // Import styles
import vnNum2Words from "vn-num2words"; // Import the vn-num2words library
import { toast } from "react-toastify"; // Import toast for notifications
import { useSelector } from "react-redux";
import api from '../../config/api'; // Import your API configuration

function WalletPage() {
  const [amount, setAmount] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [transactions, setTransactions] = useState([]); // State for transaction history
  const [accountBalance, setAccountBalance] = useState(0); // State for account balance
  const user = useSelector((state) => state.user);
  console.log("Current user:", user);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  // Function to fetch transaction history
  const fetchTransactionHistory = async () => {
    if (!user || !user.accountID) {
      console.error("User or account information is missing");
      return;
    }

    const apiUrl = `http://103.90.227.69:8080/api/transactions/account/${user.accountID}`;
    try {
      const response = await axios.get(apiUrl, { headers });
      setTransactions(response.data);
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

    const accountID = user.accountID; // Use the correct property for account ID
    console.log("Account ID:", accountID);
    console.log("Total Amount (Price):", totalAmount); // Log the total amount

    const apiUrl = "http://103.90.227.69:8080/api/transactions/create"; // Replace with your actual API endpoint

    // Get the current date in ISO format
    const currentDate = new Date().toISOString();

    try {
      console.log("Data to send:", {
        accountID: accountID,
        price: totalAmount,
        date: currentDate,
      });

      // Direct API call to handle the transaction
      const response = await axios.post(apiUrl, {
        accountID: accountID, // Sử dụng accountID theo yêu cầu của API
        price: totalAmount,    // Sử dụng price thay vì totalAmount
        date: currentDate,     // Thêm ngày hiện tại
        // status: "Chờ xác nhận", // Trạng thái mặc định
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header
          'Content-Type': 'application/json' // Định dạng nội dung
        }
      });

      // Redirect to VNPAY link
      const vnpayLink = response.data; // Assuming response.data contains the VNPAY link
      const transactionId = response.data.vnp_TxnRef; // Get transaction ID from response
      window.location.href = vnpayLink; // Redirect to VNPAY link

      toast.success("Đã xác nhận giao dịch! Vui lòng chờ cập nhật."); // Notify success
      console.log("Response from API:", vnpayLink); // Log the response data

      // Fetch the updated transaction history
      fetchTransactionHistory(); // Refresh the transaction history

      // Post transaction response to the API after successful payment
      const transactionResponse = {
        vnp_TxnRef: transactionId, // Use the actual transaction ID from the response
        vnp_ResponseCode: "00", // Replace with actual response code
        vnp_Amount: totalAmount.toString(), // Convert amount to string
      };

      await axios.post(
        `http://103.90.227.69:8080/api/transactions/vnpay/response`,
        transactionResponse
      );
    } catch (error) {
      console.error("Error adding transaction:", error);
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra."; // Lấy thông báo lỗi từ server
      toast.error("Giao dịch thất bại: " + errorMessage); // Notify failure with error message
    }

    setAmount(""); // Reset amount after confirmation
    setSelectedLevel(null); // Reset selected level
  };

  // Sort transactions by transactionID in descending order
  const sortedTransactions = transactions.sort((a, b) => {
    return b.transactionID.localeCompare(a.transactionID); // Sort by transactionID
  });

  return (
    <div className="wallet-page-wrapper">
      <div className="wallet-page">
        <div className="account-balance">
          <h2 className="balance-number">Số dư tài khoản: <br/>{accountBalance.toLocaleString('vi-VN')} VND</h2>
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
        <button className="confirm-button" onClick={handleTransactionConfirm}>
          Xác nhận
        </button>

        {/* Transaction History Table */}
        <h2>Lịch sử giao dịch</h2>
        <table className="transaction-history-table">
          <thead>
            <tr>
              <th>Mã giao dịch</th>
              <th>Số tiền</th>
              <th>Ngày giao dịch</th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map((transaction) => (
              <tr key={transaction.transactionID}>
                {" "}
                {/* Use transactionID as the key */}
                <td>{transaction.transactionID}</td> {/* Display transactionID */}
                <td>{transaction.price} VND</td> {/* Display price */}
                <td>
                  {transaction.date
                    ? new Date(transaction.date).toLocaleDateString()
                    : "Chưa xác định"}
                </td>{" "}
                {/* Display date or a placeholder */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WalletPage;