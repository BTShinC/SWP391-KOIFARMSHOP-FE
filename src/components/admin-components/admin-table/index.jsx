import { Button } from "antd";
import PropTypes from "prop-types";
import "./index.scss";

AdminTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired,
};

function AdminTable({ data, columns, title }) {
  const handleOnClick = (rowData) => {
    console.log("Dữ liệu hàng được chọn:", rowData);

  };

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
              {Object.values(row).map((val, i) => (
                <td key={i}>{val}</td>
              ))}
              <td>
                <Button onClick={() => handleOnClick(row)}>Chỉnh sửa</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminTable;
