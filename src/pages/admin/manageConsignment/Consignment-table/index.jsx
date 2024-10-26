import { Button, Spin, Modal, message, Input, Upload } from "antd";
import PropTypes from "prop-types";
import { format } from "date-fns";
import React, { useState } from "react";
import "./index.scss";
import {
  createCareDetail,
  fetchProductById,
  fetchProductComboById,
} from "../../../../service/userService";
import ChangeStatusConsignment from "../../../../components/changeStatusConsignment";
import { PlusOutlined } from "@ant-design/icons";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "/src/firebase.js"; // Đảm bảo cấu hình Firebase

ConsignmentTable.propTypes = {
  consignmentData: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func,
};

function ConsignmentTable({ consignmentData, columns, onChange }) {
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [consignmentStatus, setConsignmentStatus] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]); // Quản lý fileList
  const [careUpdate, setCareUpdate] = useState({
    description: "",
    updateDate: new Date().toISOString(),
    images: "",
    consignmentID: "",
  });

  // Hàm để hiển thị modal với chi tiết sản phẩm
  const handleViewDetail = async (consignment, productID, productComboID) => {
    setIsModalVisible(true);
    setModalData(consignment);

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

  // Cập nhật fileList và upload ảnh lên Firebase
  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList); // Cập nhật fileList
    if (newFileList.length > 0) {
      const file = newFileList[0].originFileObj;
      const storageRef = ref(storage, `uploads/${file.name}`);

      uploadBytes(storageRef, file)
        .then(() => getDownloadURL(storageRef))
        .then((url) => {
          // Cập nhật URL ảnh vào careUpdate
          setCareUpdate((prevCareUpdate) => ({
            ...prevCareUpdate,
            images: url, // Lưu URL của ảnh vào careUpdate.images
          }));
          message.success("Ảnh đã được upload thành công!");
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
          message.error("Lỗi khi upload ảnh!");
        });
    }
  };

  const handleCareUpdateChange = (e) => {
    const { name, value } = e.target;
    setCareUpdate((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Gửi cập nhật tình hình chăm sóc
  const handleUpdateCare = async () => {
    // Kiểm tra nếu có description và images
    if (careUpdate.description && careUpdate.images) {
      console.log("Dữ liệu careUpdate:", careUpdate);
      try {
        // Gọi API để tạo chi tiết chăm sóc
        let res = await createCareDetail(careUpdate);

        if (res) {
          message.success(
            `Tình hình chăm sóc của ${modalData.consignmentID} đã được cập nhật.`
          );
          setIsUpdateModalVisible(false); // Đóng modal sau khi cập nhật thành công
        } else {
          message.error(
            `Tình hình chăm sóc của ${modalData.consignmentID} không được cập nhật.`
          );
        }
      } catch (error) {
        console.error("Error updating care details:", error);
        message.error(
          "Đã xảy ra lỗi khi cập nhật tình hình chăm sóc. Vui lòng thử lại."
        );
      }
    } else {
      message.error("Vui lòng nhập mô tả và upload ảnh!");
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

  // Đóng modal cập nhật
  const handleCloseUpdateModal = () => {
    setIsUpdateModalVisible(false);
    setFileList([]); // Reset fileList khi đóng modal
    setCareUpdate({
      description: "",
      updateDate: new Date().toISOString(),
      images: "",
      consignmentID: "",
    });
  };

  const handleOpenUpdateModal = (consignment) => {
    setIsUpdateModalVisible(true);
    setModalData(consignment);
    setCareUpdate((prevState) => ({
      ...prevState,
      consignmentID: consignment.consignmentID, // Gán consignmentID
    }));
  };

  // Đóng modal chi tiết
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setProductDetails(null);
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
                  {consignment.consignmentType === "chăm sóc" && (
                    <Button
                      onClick={() => handleOpenUpdateModal(consignment)}
                      style={{ marginLeft: "10px" }}
                    >
                      Cập nhật tình hình
                    </Button>
                  )}
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

      {/* Modal để cập nhật tình hình chăm sóc */}
      <Modal
        title="Cập nhật tình hình chăm sóc"
        visible={isUpdateModalVisible}
        onCancel={handleCloseUpdateModal}
        onOk={handleUpdateCare}
      >
        <Upload
          name="image"
          listType="picture-card"
          className="image-uploader"
          fileList={fileList} // Đảm bảo quản lý fileList đúng cách
          onChange={handleUploadChange}
          beforeUpload={() => false}
          style={{
            width: "100%",
            maxWidth: "400px",
            marginBottom: "16px",
          }}
        >
          {fileList.length >= 1 ? null : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          )}
        </Upload>

        <Input.TextArea
          rows={4}
          name="description"
          value={careUpdate.description}
          onChange={handleCareUpdateChange}
          placeholder="Nhập mô tả tình hình chăm sóc"
          style={{
            marginTop: "16px",
          }}
        />
      </Modal>

      {/* Modal để hiển thị chi tiết */}
      <Modal
        title={`Chi tiết ký gửi ${modalData?.consignmentID || ""}`}
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
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
                  <strong>Tên sản phẩm:</strong>
                  {productDetails.productName || productDetails.comboName}
                </p>
                <p>
                  <strong>Mô tả:</strong> {productDetails.description || "N/A"}
                </p>
                <p>
                  <strong>Gói chăm sóc:</strong>
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
                      <strong>Tình hình chăm sóc:</strong>
                      {productDetails.reason || "N/A"}
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
