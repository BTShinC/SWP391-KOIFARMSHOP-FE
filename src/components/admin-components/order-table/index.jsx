import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "antd";
import ChangeStatus from "../../changeStatus";
import { fetchOrderDetails } from "../../../service/userService"; // Import hàm fetchOrderDetails

OrderTable.propTypes = {
  columns: PropTypes.array.isRequired,
  orderData: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  detailData: PropTypes.array, // Chỉ định là mảng, không bắt buộc
};

function OrderTable({ columns, orderData, title }) { // Khởi tạo detailData với mảng rỗng
  const [showDetail, setShowDetail] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]); // Trạng thái để lưu trữ chi tiết đơn hàng

  const handleViewDetail = async (orderID) => {
    if (showDetail === orderID) {
      setShowDetail(null);
      setOrderDetails([]); // Reset order details khi ẩn
    } else {
      setShowDetail(orderID);
      try {
        const details = await fetchOrderDetails(orderID); // Gọi API để lấy chi tiết đơn hàng
        setOrderDetails(details); // Cập nhật chi tiết đơn hàng
      } catch (error) {
        console.error("Failed to fetch order details:", error);
      }
    }
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
                <td>{order.orderID}</td>
                <td>{order.total.toLocaleString()} VND</td>
                <td>{order.date}</td>
                <td>{order.status}</td>
                <td className="btn-container">
                  <Button onClick={() => handleViewDetail(order.orderID)}>
                    {showDetail === order.orderID ? "Ẩn chi tiết" : "Xem chi tiết"}
                  </Button>
                  <ChangeStatus data={order}/>
                </td>
              </tr>
              {/* Bảng chi tiết nhỏ */}
              {showDetail === order.orderID && (
                <tr className="detail-row">
                  <td colSpan={columns.length}>
                    <div className="detail-table-container">
                      <table className="detail-table">
                        <thead>
                          <tr>
                            <th>Order Detail ID</th>
                            <th>Product ID</th>
                            <th>Product Name</th>
                            <th>Product Price</th>
                            <th>Discounted Price</th>
                            <th>Product Combo ID</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.isArray(orderDetails) && orderDetails.length > 0 // Kiểm tra xem orderDetails có phải là mảng và không rỗng
                            ? orderDetails.map((detail, i) => (
                                <tr key={i}>
                                  <td>{detail.ordersDetailID}</td>
                                  <td>{detail.productID}</td>
                                  <td>{detail.productName}</td>
                                  <td>{detail.productPrice.toLocaleString()} VND</td>
                                  <td>{detail.discountedPrice.toLocaleString()} VND</td>
                                  <td>{detail.productComboID || "N/A"}</td> {/* Hiển thị "N/A" nếu không có combo */}
                                </tr>
                              ))
                            : (
                              <tr>
                                <td colSpan={6}>Không có chi tiết cho đơn hàng này.</td>
                              </tr>
                            )}
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
