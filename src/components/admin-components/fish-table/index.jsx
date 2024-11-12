import React, { useState } from "react";
import { Button, Modal, message } from "antd";
import PropTypes from "prop-types";
import "./index.scss";
import {
  editFishInfo,
  updateConsignmentByID,
} from "../../../service/userService"; // Import API update consignment

FishTable.propTypes = {
  columns: PropTypes.array.isRequired,
  fishData: PropTypes.array.isRequired,
  consignmentData: PropTypes.array.isRequired, // Dữ liệu consignment
  title: PropTypes.string.isRequired,
  ModalComponent: PropTypes.elementType.isRequired,
  onChange: PropTypes.func.isRequired,
};

function FishTable({
  columns,
  fishData,
  consignmentData,
  title,
  ModalComponent,
  onChange,
}) {
  const [selectedFish, setSelectedFish] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  // Hàm để tìm consignment dựa trên productID
  const getConsignmentID = (productID) => {
    const consignment = consignmentData.find(
      (consign) => consign.productID === productID
    );
    return consignment || null;
  };

  const handleViewDetail = (fish) => {
    setSelectedFish(fish);
    setIsDetailModalVisible(true); // Mở modal khi nhấn "Xem chi tiết"
  };

  const handleConfirmStatusChange = async () => {
    if (selectedFish) {
      const updatedFish = {
        ...selectedFish,
        status: "Hết hàng",
      };

      try {
        // Lấy consignment từ productID
        const consignment = getConsignmentID(selectedFish.productID);
        if (!consignment) {
          await changeFishStatus(updatedFish);
          message.success("Cập nhật trạng thái cá thành công");
          onChange();
          return;
        }
        const saleDate = new Date().toISOString();
        const updatedConsignmentStatus = {
          ...consignment,
          consignmentID: consignment.consignmentID,
          status: "Hoàn tất",
          saleDate: saleDate,
        };
        // Thực hiện cả hai tác vụ cập nhật trạng thái cá và consignment song song
        await Promise.all([
          changeFishStatus(updatedFish),
          updateConsignmentByID(updatedConsignmentStatus),
        ]);
        message.success(
          "Cập nhật trạng thái thành công cho cả cá và đơn ký gửi"
        );
        onChange(); // Cập nhật dữ liệu sau khi thay đổi
        setIsModalVisible(false);
        setSelectedFish(null);
      } catch (error) {
        console.error("Cập nhật thất bại:", error);
        message.error("Có lỗi xảy ra khi cập nhật trạng thái.");
      }
    }
  };

  const changeFishStatus = async (data) => {
    try {
      let res = await editFishInfo(data);
      if (res) {
        console.log("Cập nhật trạng thái cá thành công");
      }
    } catch (error) {
      console.log("Lỗi khi cập nhật trạng thái cá:", error);
    }
  };

  return (
    <div className="fish-table">
      <div>
        <h2 className="fish-table__title">{title}</h2>
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
          {fishData.map((fish, index) => (
            <React.Fragment key={fish.productID || index}>
              <tr>
                <td>{fish.productID}</td>
                <td>
                  <img
                    src={fish.image}
                    alt="Fish"
                    style={{
                      maxWidth: "100px",
                      borderRadius: "8px",
                      marginRight: "20px",
                    }}
                  />
                </td>
                <td>{fish.breed}</td>
                <td>{fish.size}</td>
                <td>{fish.consignmentType}</td>
                <td>{new Intl.NumberFormat("vi-VN").format(fish.price)} VNĐ</td>
                <td>{fish.status}</td>
                <td className="btn-container">
                  <div className="button-group">
                    <div>
                      <Button onClick={() => handleViewDetail(fish)}>
                        Xem chi tiết
                      </Button>
                    </div>
                    {ModalComponent && (
                      <div>
                        <ModalComponent onChange={onChange} fishData={fish} />
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Modal xác nhận trạng thái Hết hàng */}
      <Modal
        title="Xác nhận thay đổi trạng thái"
        open={isModalVisible}
        onOk={handleConfirmStatusChange}
        onCancel={() => setIsModalVisible(false)}
        okText="Đồng ý"
        cancelText="Hủy"
      >
        <p>
          Bạn có chắc chắn muốn thay đổi trạng thái sản phẩm thành Hết hàng?
        </p>
      </Modal>

      {/* Modal hiển thị chi tiết sản phẩm */}
      {selectedFish && (
        <Modal
          title={`Chi tiết sản phẩm: ${selectedFish.productID}`}
          open={isDetailModalVisible}
          onCancel={() => setIsDetailModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
              Đóng
            </Button>,
          ]}
        >
          <div className="fish-detail">
            {/* Phần hiển thị 2 ảnh */}
            <div className="fish-detail__image-container">
              <div>
                <strong>Ảnh cá:</strong>
                <img
                  src={selectedFish.image}
                  alt="Fish"
                  style={{
                    maxWidth: "200px",
                    borderRadius: "8px",
                    marginRight: "20px",
                  }}
                />
              </div>
              <div>
                <strong>Ảnh chứng nhận:</strong>
                <img
                  src={selectedFish.certificate}
                  alt="Certificate"
                  style={{ maxWidth: "200px", borderRadius: "8px" }}
                />
              </div>
            </div>

            {/* Phần thông tin chi tiết sản phẩm */}
            <p>
              <strong>Tên sản phẩm:</strong> {selectedFish.productName}
            </p>
            <p>
              <strong>Giống loài:</strong> {selectedFish.breed}
            </p>
            <p>
              <strong>Kích thước:</strong> {selectedFish.size} cm
            </p>
            <p>
              <strong>Giới tính:</strong> {selectedFish.sex}
            </p>
            <p>
              <strong>Giá:</strong>
              {new Intl.NumberFormat("vi-VN").format(selectedFish.price)} VNĐ
            </p>
            <p>
              <strong>Trạng thái:</strong> {selectedFish.status}
            </p>
            <p>
              <strong>Trạng thái sức khỏe:</strong> {selectedFish.healthStatus}
            </p>
            <p>
              <strong>Tính cách:</strong> {selectedFish.personalityTrait}
            </p>
            <p>
              <strong>Nguồn gốc:</strong> {selectedFish.origin}
            </p>
            <p>
              <strong>Mô tả:</strong> {selectedFish.description}
            </p>
            <p>
              <strong>Chứng nhận:</strong>
              {selectedFish.certificate ? "Có" : "Không"}
            </p>
            {getConsignmentID(selectedFish.productID) && (
              <p>
                <strong>Đơn ký gửi ID:</strong>
                {getConsignmentID(selectedFish.productID).consignmentID}
              </p>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

export default FishTable;
