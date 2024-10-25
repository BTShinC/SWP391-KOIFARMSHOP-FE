import PropTypes from "prop-types";
import EditProductComboModal from "../../../pages/admin/manageProductCombo/editProductCombo";
import { useState } from "react";
import { Modal, Button } from "antd";

function ProductComboTable({ data = [], columns = [], onChange }) {
  const [visible, setVisible] = useState(false); // State quản lý hiển thị modal
  const [selectedCombo, setSelectedCombo] = useState(null); // State lưu trữ combo đang chọn

  // Hàm để mở modal hiển thị chi tiết combo
  const showDetailModal = (combo) => {
    setSelectedCombo(combo); // Cập nhật combo được chọn
    setVisible(true); // Mở modal
  };

  // Hàm để đóng modal
  const handleCloseModal = () => {
    setVisible(false);
    setSelectedCombo(null); // Xóa combo đã chọn khi đóng modal
  };

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
              <td>{item.consignmentType}</td>
              <td>{item.quantity}</td>
              <td>{new Intl.NumberFormat("vi-VN").format(item.price)} VNĐ</td>
              <td>{item.status}</td>
              <td className="btn-container">
                {/* Nút mở modal Edit */}
                <EditProductComboModal fishData={item} onChange={onChange} />
                {/* Nút mở modal xem chi tiết */}
                <Button
                  onClick={() => showDetailModal(item)}
                  style={{ marginLeft: "10px" }}
                >
                  Xem chi tiết
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal hiển thị chi tiết */}
      <Modal
        title={`Chi tiết lô cá: ${selectedCombo?.productComboID}`}
        visible={visible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Đóng
          </Button>,
        ]}
      >
        {selectedCombo && (
          <div>
            {selectedCombo.image ? (
              <img
                src={selectedCombo.image}
                alt="Hình ảnh lô cá"
                style={{
                  width: "100%",
                  maxWidth: "300px",
                  height: "auto",
                  borderRadius: "8px",
                }}
              />
            ) : (
              <p>Không có hình ảnh</p>
            )}
            <p>
              <strong>Tên lô:</strong> {selectedCombo.comboName}
            </p>
            <p>
              <strong>Sức khỏe:</strong> {selectedCombo.healthStatus}
            </p>
            <p>
              <strong>Mô tả:</strong> {selectedCombo.description}
            </p>
            <p>
              <strong>Hình thức:</strong> {selectedCombo.type}
            </p>
            <p>
              <strong>Hình thức ký gửi:</strong> {selectedCombo.consignmentType}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

ProductComboTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  columns: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
};

export default ProductComboTable;
