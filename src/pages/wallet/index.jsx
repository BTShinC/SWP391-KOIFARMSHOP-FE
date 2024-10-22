import  { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import './index.scss'; // Import styles
import vnNum2Words from 'vn-num2words'; // Import the vn-num2words library
import { toast } from 'react-toastify'; // Import toast for notifications
import { useSelector } from "react-redux";

function WalletPage() {
    const [amount, setAmount] = useState('');
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [transactions, setTransactions] = useState([]); // State for transaction history
    const user = useSelector((state) => state?.user);

    // Function to fetch transaction history
    const fetchTransactionHistory = async () => {
        const apiUrl = `http://103.90.227.69:8080/api/transactions/account/${user?.accountID}`; // Use accountID in the URL
        try {
            const response = await axios.get(apiUrl);
            setTransactions(response.data); // Assuming response.data contains the transaction history
        } catch (error) {
            console.error("Error fetching transaction history:", error);
            toast.error("Failed to load transaction history.");
        }
    };

    useEffect(() => {
        // Fetch transaction history when the component mounts
        fetchTransactionHistory();
    }, [user?.accountID]); // Fetch again if accountID changes

    const handleAmountChange = (e) => {
        const value = e.target.value;
        if (value >= 0) {
            setAmount(value);
        }
    };

    const handleLevelSelect = (level) => {
        setSelectedLevel(level);
        setAmount(''); // Clear input when a level is selected
    };

    const handleTransactionConfirm = async () => {
        const totalAmount = amount || selectedLevel;

        // Check if the total amount is less than 100,000
        if (totalAmount < 100000) {
            toast.error('Số tiền tối thiểu là 100.000 VND'); // Notify for minimum amount alert
            return;
        }

        const accountId = user?.accountID; // Use the correct property for account ID
        console.log("Account ID:", accountId);
        console.log("Total Amount (Price):", totalAmount); // Log the total amount

        const apiUrl = 'http://103.90.227.69:8080/api/transactions/create'; // Replace with your actual API endpoint

        // Get the current date in ISO format
        const currentDate = new Date().toISOString();

        try {
            // Direct API call to handle the transaction
            const response = await axios.post(apiUrl, {
                accountID: accountId, // Use accountID as per the API requirement
                price: totalAmount,    // Use price instead of totalAmount
                date: currentDate,     // Add current date
                status: "Chờ xác nhận", // Default status
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
                vnp_Amount: totalAmount.toString() // Convert amount to string
            };

            await axios.post(`http://103.90.227.69:8080/api/transactions/vnpay/response`, transactionResponse);

        } catch (error) {
            console.error("Error adding transaction:", error);
            toast.error("Giao dịch thất bại: " + (error.response?.data || "Có lỗi xảy ra.")); // Notify failure with error message
        }

        setAmount(''); // Reset amount after confirmation
        setSelectedLevel(null); // Reset selected level
    };

    // Sort transactions by transactionID in descending order
    const sortedTransactions = transactions.sort((a, b) => {
        return b.transactionID.localeCompare(a.transactionID); // Sort by transactionID
    });

    return (
        <div className="wallet-page">
            <div className="amount-selection">
                <h2>Vui lòng chọn số tiền cần nạp</h2>
                <div className="button-group">
                    <button className='fixed-ammount-button' onClick={() => handleLevelSelect(1000000)}>1.000.000 VND</button>
                    <button className='fixed-ammount-button' onClick={() => handleLevelSelect(2000000)}>2.000.000 VND</button>
                </div>
                <div className="button-group">
                    <button className='fixed-ammount-button' onClick={() => handleLevelSelect(5000000)}>5.000.000 VND</button>
                    <button className='fixed-ammount-button' onClick={() => handleLevelSelect(10000000)}>10.000.000 VND</button>
                </div>
                <input
                    type="number"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="Nhập số tiền mong muốn"
                />
                {amount && <p>{vnNum2Words(amount)} VND</p>} {/* Display amount in words using vn-num2words */}
            </div>
            {/* {amount || selectedLevel ? (
                <img className='QR'
                    src="/public/images/QR_Koi_bank.jpg" // Replace with the path to your static image
                    alt="QR" 
                />
            ) : null} */}
            <button className="confirm-button" onClick={handleTransactionConfirm}>Xác nhận</button>

            {/* Transaction History Table */}
            <h2>Lịch sử giao dịch</h2>
            <table className="transaction-history-table">
                <thead>
                    <tr>
                        <th>Mã giao dịch</th>
                        <th>Số tiền</th>
                        <th>Ngày giao dịch</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedTransactions.map(transaction => (
                        <tr key={transaction.transactionID}> {/* Use transactionID as the key */}
                            <td>{transaction.transactionID}</td> {/* Display transactionID */}
                            <td>{transaction.price} VND</td> {/* Display price */}
                            <td>{transaction.date ? new Date(transaction.date).toLocaleDateString() : "Chưa xác định"}</td> {/* Display date or a placeholder */}
                            <td>{transaction.status || "Chờ xác nhận"}</td> {/* Display status or default */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default WalletPage;
