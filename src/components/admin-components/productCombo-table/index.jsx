
import PropTypes from "prop-types";
import EditProductComboModal from "./editProductCombo";

function ProductComboTable({ data = [], columns = [] , onChange}) {
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
              <td className="btn-container">
                <EditProductComboModal fishData={item} onChange={onChange}></EditProductComboModal>
              </td>
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
  onChange: PropTypes.func,
};

export default ProductComboTable;
