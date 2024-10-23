import React, { useState } from "react";
import { Button, Checkbox, Modal, message } from "antd";
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
  const [showDetail, setShowDetail] = useState(null);
  const [selectedFish, setSelectedFish] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Hàm để tìm consignment dựa trên productID
  const getConsignmentID = (productID) => {
    const consignment = consignmentData.find(
      (consign) => consign.productID === productID
    );
    console.log("consignment =>", consignment);
    return consignment || null;
  };

  const handleViewDetail = (id) => {
    setShowDetail((prev) => (prev === id ? null : id));
  };

  const handleChangeStatus = (fish) => {
    setSelectedFish(fish);
    setIsModalVisible(true); // Hiển thị modal xác nhận
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
                <td>{fish.breed}</td>
                <td>{fish.size}</td>
                <td>{fish.sex}</td>
                <td>{new Intl.NumberFormat("vi-VN").format(fish.price)} VNĐ</td>

                <td>{fish.status}</td>
                <td className="btn-container">
                  {fish.status === "Còn hàng" && (
                    <>
                      <Checkbox
                        checked={fish.status === "Hết hàng"}
                        onChange={() => handleChangeStatus(fish)}
                      >
                        Đánh dấu hết hàng
                      </Checkbox>
                    </>
                  )}
                  <Button onClick={() => handleViewDetail(fish.productID)}>
                    {showDetail === fish.productID
                      ? "Ẩn chi tiết"
                      : "Xem chi tiết"}
                  </Button>
                  {ModalComponent && (
                    <ModalComponent onChange={onChange} fishData={fish} />
                  )}
                </td>
              </tr>
              {showDetail === fish.productID && (
                <tr>
                  <td colSpan={7}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: "1rem",
                      }}
                    >
                      <div>
                        <p>
                          <strong>Trạng thái sức khỏe:</strong>{" "}
                          {fish.healthStatus}
                        </p>
                        <p>
                          <strong>Tính cách:</strong> {fish.personalityTrait}
                        </p>
                        <p>
                          <strong>Nguồn gốc:</strong> {fish.origin}
                        </p>
                        <p>
                          <strong>Mô tả:</strong> {fish.description}
                        </p>
                        <p>
                          <strong>Chứng nhận:</strong>{" "}
                          {fish.certificate ? "Có" : "Không"}
                        </p>
                        <p>
                          <strong>Loại:</strong> {fish.type}
                        </p>
                        <p>
                          <strong>Gói chăm sóc:</strong> {fish.carePackageID}
                        </p>
                        {getConsignmentID(fish.productID) && (
                          <p>
                            <strong>Đơn ký gửi ID:</strong>{" "}
                            {getConsignmentID(fish.productID).consignmentID}
                          </p>
                        )}
                      </div>

                      <div
                        style={{ flexShrink: 0, display: "flex", gap: "1rem" }}
                      >
                        <p>
                          <strong>Ảnh cá:</strong>
                        </p>
                        <img
                          src={fish.image}
                          alt="Fish"
                          style={{ maxWidth: "200px", borderRadius: "8px" }}
                        />
                      </div>
                      <div
                        style={{ flexShrink: 0, display: "flex", gap: "1rem" }}
                      >
                        <p>
                          <strong>Ảnh chứng nhận:</strong>
                        </p>
                        <img
                          src={fish.certificate}
                          alt="Certificate"
                          style={{ maxWidth: "200px", borderRadius: "8px" }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              )}
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
    </div>
  );
}

export default FishTable;
