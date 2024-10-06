import PropTypes from "prop-types";

function ProductComboTable({ data = [], columns = [] }) {
  console.log(data);

  return (
    <div className="admin-table">
      <div>
        <h2 className="admin-table__title">Quản lý lô cá</h2>
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
          {data.map((item, i) => (
            <tr key={i}>
              <td>{item.productComboID}</td>
              <td>{item.breed}</td>
              <td>{item.size}</td>
              <td>{item.healthStatus}</td>
              <td>{item.quantity}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

ProductComboTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  columns: PropTypes.arrayOf(PropTypes.string),
};

export default ProductComboTable;
