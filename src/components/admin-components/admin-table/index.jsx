import React from "react";
import PropTypes from "prop-types";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./index.scss";

AdminTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  detailData: PropTypes.arrayOf(PropTypes.object),
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired,
  ModalComponent: PropTypes.elementType,
  renderAction: PropTypes.func,
};

function AdminTable({
  data,
  columns,
  title,
  ModalComponent,
  detailData,
  renderAction,
}) {
  // Trạng thái để quản lý hàng được mở rộng
  const [expandedRow, setExpandedRow] = useState(null);

  // Hàm xử lý khi nhấn vào biểu tượng mắt
  const toggleDetailTable = (orderId) => {
    setExpandedRow((prev) => (prev === orderId ? null : orderId)); // Mở hoặc đóng hàng chi tiết
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
          {data.map((row) => {
            // Kiểm tra nếu có detailData cho orderId hiện tại
            const hasDetailData =
              detailData &&
              detailData.some((detail) => detail.orderID === row.orderId);
            return (
              <React.Fragment key={row.orderId}>
                <tr key={row.orderId}>
                  {Object.values(row).map((val, i) => (
                    <td key={`${row.orderId}-${i}`}>{val}</td>
                  ))}
                  <td
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "1rem",
                    }}
                  >
                    {renderAction
                      ? renderAction(row)
                      : ModalComponent && (
                          <ModalComponent
                            userData={row}
                            title="Chỉnh sửa"
                            className="modal-edit-user-button"
                          />
                        )}
                    {/* Chỉ hiển thị biểu tượng mắt nếu có dữ liệu chi tiết */}
                    {hasDetailData &&
                      (expandedRow === row.orderId ? (
                        <FaEyeSlash
                          onClick={() => toggleDetailTable(row.orderId)}
                          style={{ cursor: "pointer" }}
                          title="Ẩn chi tiết"
                        />
                      ) : (
                        <FaEye
                          onClick={() => toggleDetailTable(row.orderId)}
                          style={{ cursor: "pointer" }}
                          title="Xem chi tiết"
                        />
                      ))}
                  </td>
                </tr>
                {/* Hiển thị hàng chi tiết nếu `expandedRow` trùng với `orderId` */}
                {expandedRow === row.orderId && hasDetailData && (
                  <tr className="detail-row" key={`${row.orderId}-details`}>
                    <td colSpan={columns.length + 1}>
                      <table className="detail-table">
                        <thead>
                          <tr>
                            {Object.keys(detailData[0]).map((key, index) => (
                              <th key={index}>{key}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {detailData
                            .filter((detail) => detail.orderID === row.orderId)
                            .map((detailRow, index) => (
                              <tr key={`${detailRow.orderdetailid}-${index}`}>
                                {Object.values(detailRow).map((val, i) => (
                                  <td key={`${detailRow.orderdetailid}-${i}`}>
                                    {val}
                                  </td>
                                ))}
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default AdminTable;
