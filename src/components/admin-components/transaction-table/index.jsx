import PropTypes from "prop-types";
import "./index.scss";
import { Pagination } from "@mui/material"; // Ensure you have @mui/material installed
import { useState } from "react";
import EditTransactionModal from "../../../pages/admin/manageTransactions/EditTransactionModal";
import { toast } from "react-toastify";

const TransactionTable = ({ columns, transactionData, title, onChange,onUpdateStatus }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const handleChangePage = (event, page) => {
    setCurrentPage(page);
  };

  // const handleEditClick = (transaction) => {
  //   setSelectedTransaction(transaction);
  //   setIsModalVisible(true);
  // };

  const handleUpdate = async (transactionID, updatedData) => {
    // Call your API to update the transaction here
    // After updating, you might want to refresh the transaction data
    await onChange(); // Refresh the data after update
  };

  const handleUpdateStatus = async (id) => {
    if (onUpdateStatus) {
      await onUpdateStatus(id);
    }
    toast.success("Cập nhật trạng thái thành công");
  };

  // Calculate the data to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = transactionData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="transaction-table">
      <div>
        <h2 className="transaction-table__title">{title}</h2>
      </div>
      <table>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
        {currentItems.map((transaction, index) => (
          <tr key={transaction.transactionID || transaction.accountWithdrawalId || index}>
            <td>{transaction.transactionID || transaction.accountWithdrawalId}</td>
            <td>{transaction.accountID}</td>
            <td>{transaction.price || transaction.pricesend} VND</td>
            <td>{new Date(transaction.date).toLocaleDateString()}</td>
            <td>{transaction.description}</td>
            <td> 
              {transaction.status}
            </td>
            <td>
              {transaction.bank_name ? (
                `${transaction.bank_name} - ${transaction.account_number}`
              ) : (   
                transaction.account_number
              )} 
               
            </td>
            <td>
              {onUpdateStatus && transaction.status !== "Hoàn tất" ? (
                <button onClick={() => handleUpdateStatus(transaction.accountWithdrawalId)}>Hoàn tất</button>
              ) : (
                transaction.status
              )}
            </td>
          </tr>
        ))}
      </tbody>
      </table>
      <Pagination
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          margin: "3rem 0",
        }}
        count={Math.ceil(transactionData.length / itemsPerPage)}
        page={currentPage}
        onChange={handleChangePage}
        color="primary"
        shape="rounded"
      />
      {selectedTransaction && (
        <EditTransactionModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          transactionData={selectedTransaction}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

TransactionTable.propTypes = {
  transactionData: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onUpdateStatus: PropTypes.func,  // Thêm dòng này
};

export default TransactionTable;