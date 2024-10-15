import { useEffect, useState } from "react";
import AdminFilter from "../../../components/admin-components/admin-filter";
import AdminHeader from "../../../components/admin-components/admin-headers";
import AdminSideBar from "../../../components/admin-components/admin-sidebar";
import TransactionTable from "../../../components/admin-components/transaction-table"; // Import the new TransactionTable
import { fetchAllTransactions } from "../../../service/userService"; // Adjust the import as necessary

const columns = [
  "Mã giao dịch",
  "Mã Khách hàng",
  "Số tiền",
  "Ngày giao dịch",
  "Trạng thái",
  "Bằng chứng chuyển khoản",
  "Thao tác",
];

const handleSearch = (value) => {
  console.log(value);
};

function ManageTransactions() {
  const [transactionData, setTransactionData] = useState([]); // Initialize as an empty array

  useEffect(() => {
    getTransactions();
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

  return (
    <div className="admin">
      <div className="admin-sidebar">
        <AdminSideBar />
      </div>
      <div className="admin-content">
        <AdminHeader />
        <h1 className="content__title">Quản lý giao dịch</h1>
        <AdminFilter onSearch={handleSearch} />
        <TransactionTable columns={columns} transactionData={transactionData} title="Giao dịch" ModalComponent={null} onChange={getTransactions} />
      </div>
    </div>
  );
}

export default ManageTransactions;