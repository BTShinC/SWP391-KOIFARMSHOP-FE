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
              <td>
                {row.roleName === "Admin" && <span>Quản trị viên</span>}
                {row.roleName === "Staff" && <span>Nhân viên</span>}
                {row.roleName === "Customer" && <span>Khách hàng</span>}
              </td>
              <td>{new Intl.NumberFormat("vi-VN").format(row.accountBalance)} VNĐ</td>
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
          margin: "3rem 0",
        }}
        count={Math.ceil(data.length / itemsPerPage)} 
        page={currentPage}
        onChange={handleChangePage} 
        color="primary" 
        shape="rounded" 
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
