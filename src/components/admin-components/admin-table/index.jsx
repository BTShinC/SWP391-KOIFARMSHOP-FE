import PropTypes from "prop-types";
import "./index.scss";
import ModalEditUser from "/src/pages/userinfo/EditUserModal/index";

AdminTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired,
};

function AdminTable({ data, columns, title }) {
  return (
    <div className="admin-table">
      <div>
        <h3 className="admin-table__title">{title}</h3>
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
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.id}</td>
              <td>{row.fullName}</td>
              <td>{row.email}</td>
              <td>{row.phoneNumber}</td>
              <td>{row.address}</td>
              <td>{row.balance}</td>
              <td>
                <ModalEditUser userData={row} title="Chỉnh sửa" className = 'modal-edit-user-button' />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminTable;
