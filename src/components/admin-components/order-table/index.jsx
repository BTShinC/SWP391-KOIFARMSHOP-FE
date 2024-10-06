import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "antd";
import ChangeStatus from "../../changeStatus";
OrderTable.propTypes = {
  columns: PropTypes.array.isRequired,
  orderData: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  detailData: PropTypes.array.isRequired,
};

function OrderTable({ columns, orderData, title, detailData }) {
  const [showDetail, setShowDetail] = useState(null);

  const handleViewDetail = (id) => {
    setShowDetail((prev) => (prev === id ? null : id));
  };

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
          {orderData.map((order, index) => (
            <React.Fragment key={order.productID || index}>
              <tr>
                <td>{order.orderId}</td>
                <td>{order.customerId}</td>
                <td>{order.totalAmount} VND</td>
                <td>{order.orderDate}</td>
                <td>{order.status}</td>
                <td className="btn-container">
                  <Button onClick={() => handleViewDetail(order.orderId)}>
                    {showDetail === order.orderId ? "Ẩn chi tiết" : "Xem chi tiết"}
                  </Button>
                 <ChangeStatus data = {order}></ChangeStatus>
                </td>
              </tr>
              {/* Bảng chi tiết nhỏ */}
              {showDetail === order.orderId && (
                <tr className="detail-row">
                  <td colSpan={columns.length}>
                    <div className="detail-table-container">
                      <table className="detail-table">
                        <thead>
                          <tr>
                            <th>Order Detail ID</th>
                            <th>Product ID</th>
                            <th>Quantity</th>
                            <th>Product Combo ID</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detailData
                            .filter((detail) => detail.orderID === order.orderId)
                            .map((detail, i) => (
                              <tr key={i}>
                                <td>{detail.orderdetailid}</td>
                                <td>{detail.productid}</td>
                                <td>1</td>
                                <td>{detail.productComboID}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderTable;
