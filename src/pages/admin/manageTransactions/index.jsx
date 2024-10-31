import { useEffect, useState } from "react";
import AdminFilter from "../../../components/admin-components/admin-filter";
import AdminHeader from "../../../components/admin-components/admin-headers";
import AdminSideBar from "../../../components/admin-components/admin-sidebar";
import TransactionTable from "../../../components/admin-components/transaction-table"; // Import the new TransactionTable
import { fetchAllTransactions, fetchAllWithdrawals, updateWithdrawalStatus } from "../../../service/userService"; // Adjust the import as necessary

const columns = [
  "Mã giao dịch",
  "Mã Khách hàng",
  "Số tiền",
  "Ngày giao dịch",
  "Chi tiết",


];
const withdrawalColumns = [
  "Mã rút tiền",
  "Mã Khách hàng",
  "Số tiền",
  "Ngày yêu cầu",
  "Trạng thái",
  // "Thông tin ngân hàng",
  // "Thao tác",
];

const handleSearch = (value) => {
  console.log(value);
};

function ManageTransactions() {
  const [transactionData, setTransactionData] = useState([]); // Initialize as an empty array
  const [withdrawalData, setWithdrawalData] = useState([]);

  useEffect(() => {
    getTransactions();
    getWithdrawals();
  }, []);

  const getTransactions = async () => {
    try {
      let res = await fetchAllTransactions();
      console.log("API Response:", res); // Log the response
      if (Array.isArray(res)) { // Check if the response is an array
        setTransactionData(res); // Set the transaction data directly
      } else {
        console.error("Unexpected response structure:", res);
      }
    } catch (error) {
      console.log("Error fetching transactions:", error);
    }
  };
  const getWithdrawals = async () => {
    try {
      let res = await fetchAllWithdrawals();
      if (Array.isArray(res)) {
        setWithdrawalData(res);
      } else {
        console.error("Unexpected response structure:", res);
      }
    } catch (error) {
      console.log("Error fetching withdrawals:", error);
    }
  };
  const handleUpdateWithdrawal = async (accountWithdrawalId) => {
    try {
      await updateWithdrawalStatus(accountWithdrawalId);
      getWithdrawals(); // Refresh the withdrawal data
    } catch (error) {
      console.error("Error updating withdrawal status:", error);
    }
  };
  

  return (
    <div className="admin">
      <div className="admin-sidebar">
        <AdminSideBar />
      </div>
      <div className="admin-content">
        <AdminHeader />
        <h1 className="content__title">Quản lý giao dịch</h1>
        <AdminFilter onSearch={handleSearch} />
        <TransactionTable 
          columns={columns} 
          transactionData={transactionData} 
          title="Giao dịch" 
          ModalComponent={null} 
          onChange={getTransactions} 
        />
        <TransactionTable 
          columns={withdrawalColumns} 
          transactionData={withdrawalData} 
          title="Yêu cầu rút tiền" 
          ModalComponent={null} 
          onChange={getWithdrawals}
          onUpdateStatus={handleUpdateWithdrawal}
        />
      </div>
    </div>
  );
}

export default ManageTransactions;