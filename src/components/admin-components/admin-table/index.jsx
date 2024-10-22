import PropTypes from "prop-types";
import "./index.scss";
import { Pagination } from "@mui/material";
import { useState } from "react";

const AdminTable = ({ columns, data, title, ModalComponent, onChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const handleChangePage = (event, page) => {
    setCurrentPage(page);
  };
  // Tính toán dữ liệu cần hiển thị
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  
  return (
    <div className="admin-table">
      <div>
        <h2 className="admin-table__title">{title}</h2>
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
          {currentItems.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td>{row.accountID}</td>
              <td>{row.fullName}</td>
              <td>{row.address}</td>
              <td>{row.email}</td>
              <td>{row.phoneNumber}</td>
              <td>{row.accountBalance}</td>
              <td>
                {ModalComponent && (
                  <ModalComponent
                    userData={row}
                    title="Chỉnh sửa thông tin"
                    className="modal-edit-user-button"
                    onChange={onChange} 
                  />
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
          margin: "3rem 0", // Thêm margin
        }}
        count={Math.ceil(data.length / itemsPerPage)} // Tổng số trang
        page={currentPage} // Trang hiện tại
        onChange={handleChangePage} // Hàm xử lý khi thay đổi trang
        color="primary" // Màu sắc của pagination (có thể tùy chỉnh)
        shape="rounded" // Hình dạng của pagination
      />
    </div>
  );
};

AdminTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired,
  ModalComponent: PropTypes.elementType,
  onChange: PropTypes.func.isRequired, 
};

export default AdminTable;
