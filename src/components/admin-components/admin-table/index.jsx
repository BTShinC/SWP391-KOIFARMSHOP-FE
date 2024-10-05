import PropTypes from "prop-types";
import "./index.scss";

const AdminTable = ({ columns, data, title, ModalComponent }) => {
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
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td>{row.accountID}</td>
              <td>{row.fullName}</td>
              <td>{row.address}</td>
              <td>{row.email}</td>
              <td>{row.phoneNumber}</td>
              <td>{row.accountBalance}</td>
              <td>
                {ModalComponent && <ModalComponent userData={row} title="Chỉnh sửa" className = "modal-edit-user-button"/>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

AdminTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired,
  ModalComponent: PropTypes.elementType,
};

export default AdminTable;
