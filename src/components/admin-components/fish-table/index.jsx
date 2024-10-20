import React, { useState } from "react";
import { Button, Checkbox, Modal } from "antd";
import PropTypes from "prop-types";
import "./index.scss";
import { editFishInfo } from "../../../service/userService";

FishTable.propTypes = {
  columns: PropTypes.array.isRequired,
  fishData: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  ModalComponent: PropTypes.elementType.isRequired,
  onChange: PropTypes.func.isRequired,
};

function FishTable({ columns, fishData, title, ModalComponent, onChange }) {
  const [showDetail, setShowDetail] = useState(null);
  const [selectedFish, setSelectedFish] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleViewDetail = (id) => {
    setShowDetail((prev) => (prev === id ? null : id));
  };

  const handleChangeStatus = (fish) => {
    setSelectedFish(fish);
    setIsModalVisible(true); // Hiển thị modal xác nhận
  };

  const handleConfirmStatusChange = async () => {
    // Cập nhật trạng thái thành "Hết hàng"
    if (selectedFish) {
      const updatedFish = {
        ...selectedFish,
        status: "Hết hàng",
      };
      console.log(updatedFish);

      try {
        // Gọi thay đổi thuộc tính, đợi kết quả từ changeFishStatus
        await changeFishStatus(updatedFish);

        // Sau khi cập nhật thành công, gọi hàm onChange để cập nhật dữ liệu
        onChange();

        // Đóng modal sau khi xác nhận
        setIsModalVisible(false);
        setSelectedFish(null);
      } catch (error) {
        console.error("Cập nhật thất bại:", error);
      }
    }
  };

  const handleConfirmAvailable = async (fish) => {
    // Cập nhật trạng thái thành "Còn hàng"
    const updatedFish = {
      ...fish,
      status: "Còn hàng",
    };
    try {
      await changeFishStatus(updatedFish);
      onChange(); // Cập nhật giao diện sau khi thay đổi
      console.log("Trạng thái đã cập nhật thành Còn hàng");
    } catch (error) {
      console.error("Cập nhật thất bại:", error);
    }
  };

  const changeFishStatus = async (data) => {
    try {
      let res = await editFishInfo(data);
      if (res) {
        console.log("Cập nhật thành công");
      }
    } catch (error) {
      console.log("Lỗi khi cập nhật:", error);
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
                <td>{fish.price} VND</td>
                <td>{fish.status}</td>
                <td className="btn-container">
                  {/* Checkbox để đánh dấu hết hàng */}
                  {fish.status != "Chờ xác nhận" && (
                    <Checkbox
                      checked={fish.status === "Hết hàng"}
                      onChange={() => handleChangeStatus(fish)}
                    >
                      Đánh dấu hết hàng
                    </Checkbox>
                  )}
                  {/* Nút xác nhận khi trạng thái là "Đang chờ xác nhận" */}
                  {fish.status === "Chờ xác nhận" && (
                    <Button onClick={() => handleConfirmAvailable(fish)}>
                      Xác nhận Còn hàng
                    </Button>
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
