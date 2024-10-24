import { Button, Spin, Modal } from "antd";
import PropTypes from "prop-types";
import { format } from "date-fns";
import React, { useState } from "react";
import "./index.scss";
import {
  fetchProductById,
  fetchProductComboById,
} from "../../../../service/userService";
import ChangeStatusConsignment from "../../../../components/changeStatusConsignment";

ConsignmentTable.propTypes = {
  consignmentData: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func,
};

function ConsignmentTable({ consignmentData, columns, onChange }) {
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [consignmentStatus, setConsignmentStatus] = useState({}); // State quản lý trạng thái
  const [isModalVisible, setIsModalVisible] = useState(false); // Quản lý hiển thị modal
  const [modalData, setModalData] = useState(null); // Dữ liệu cho modal

  // Hàm để hiển thị modal với chi tiết sản phẩm
  const handleViewDetail = async (consignment, productID, productComboID) => {
    setIsModalVisible(true); // Mở modal
    setModalData(consignment); // Lưu dữ liệu ký gửi hiện tại vào modal

    const productIdToFetch = productID || productComboID;
    if (productIdToFetch) {
      setLoading(true);
      try {
        let res;
        if (productComboID) {
          res = await fetchProductComboById(productComboID);
        } else {
          res = await fetchProductById(productID);
        }

        setProductDetails(res);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Hàm cập nhật trạng thái consignment
  const handleStatusChange = (consignmentID, newStatus) => {
    setConsignmentStatus((prevState) => ({
      ...prevState,
      [consignmentID]: newStatus,
    }));

    // Sau khi cập nhật, bạn có thể gọi onChange nếu cần thiết
    if (onChange) {
      onChange();
    }
  };

  // Hàm để đóng modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setProductDetails(null); // Xóa chi tiết sản phẩm khi đóng modal
  };

  return (
    <div className="consignment-table">
      <div>
        <h2 className="">Quản lý ký gửi</h2>
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
          {consignmentData.map((consignment, index) => (
            <React.Fragment key={consignment.consignmentID || index}>
              <tr>
                <td>{consignment.consignmentID}</td>
                <td>
                  {consignment.consignmentDate
                    ? format(
                        new Date(consignment.consignmentDate),
                        "dd/MM/yyyy"
                      )
                    : "N/A"}
                </td>
                <td>
                  {consignment.dateReceived
                    ? format(new Date(consignment.dateReceived), "dd/MM/yyyy")
                    : "N/A"}
                </td>
                <td>
                  {consignment.dateExpiration
                    ? format(new Date(consignment.dateExpiration), "dd/MM/yyyy")
                    : "N/A"}
                </td>
                <td>
                  {consignment.saleDate
                    ? format(new Date(consignment.saleDate), "dd/MM/yyyy")
                    : "N/A"}
                </td>
                <td>{consignment.productComboID || consignment.productID}</td>
                <td>
                  {new Intl.NumberFormat("vi-VN").format(
                    consignment?.total || 0
                  )}
                  VNĐ
                </td>
                <td>{consignment.consignmentType}</td>
                <td>
                  {consignmentStatus[consignment.consignmentID] ||
                    consignment.status ||
                    "N/A"}
                </td>
                <td className="btn-container">
                  <Button
                    onClick={() =>
                      handleViewDetail(
                        consignment,
                        consignment.productID,
                        consignment.productComboID
                      )
                    }
                  >
                    Xem chi tiết
                  </Button>
                  {/* Truyền trạng thái vào ChangeStatusConsignment */}
                  <ChangeStatusConsignment
                    data={consignment}
                    consignmentID={consignment.consignmentID}
                    productID={consignment.productID}
                    productComboID={consignment.productComboID}
                    onChangeStatus={(newStatus) =>
                      handleStatusChange(consignment.consignmentID, newStatus)
                    }
                    onChange={onChange}
                  />
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Modal để hiển thị chi tiết */}
      <Modal
        title={`Chi tiết ký gửi ${modalData?.consignmentID || ""}`}
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={null} // Tắt footer nếu không cần nút
      >
        {loading ? (
          <Spin />
        ) : productDetails ? (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <div>
              <div>
                {!productDetails.carePackageID && modalData?.farmName && (
                  <a
                    href={modalData.farmName}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <strong>Link dẫn tới trang trại của bạn: </strong>
                    {modalData.farmName}
                  </a>
                )}

                <p>
                  <strong>Tên sản phẩm:</strong>{" "}
                  {productDetails.productName || productDetails.comboName}
                </p>
                <p>
                  <strong>Mô tả:</strong> {productDetails.description || "N/A"}
                </p>
                <p>
                  <strong>Gói chăm sóc:</strong>{" "}
                  {productDetails.carePackageID || "N/A"}
                </p>
                {!productDetails.carePackageID && (
                  <>
                    <p>
                      <strong>Giá bán: </strong>
                      {productDetails.price
                        ? `${new Intl.NumberFormat("vi-VN").format(
                            productDetails.price
                          )} VNĐ`
                        : "Không có giá"}
                    </p>
                    <p>
                      <strong>Giá bán khách mong đợi: </strong>
                      {productDetails.desiredPrice
                        ? `${new Intl.NumberFormat("vi-VN").format(
                            productDetails.desiredPrice
                          )} VNĐ`
                        : "Không có giá"}
                    </p>
                  </>
                )}
              </div>
            </div>
            <div style={{ flexShrink: 0, display: "flex", gap: "1rem" }}>
              <img
                src={productDetails.image}
                alt="Fish"
                style={{ maxWidth: "200px", borderRadius: "8px" }}
              />
            </div>
          </div>
        ) : (
          <p>Không tìm thấy chi tiết sản phẩm</p>
        )}
      </Modal>
    </div>
  );
}

export default ConsignmentTable;
