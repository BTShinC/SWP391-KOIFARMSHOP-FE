import { Button, Modal, message } from "antd";
import PropTypes from "prop-types";
import { useState } from "react";
import {
  updateConsignmentStatus,
  fetchProductComboById,
  fetchProductById,
  editFishInfo,
  editComboInfo,
} from "../../service/userService";

ChangeStatusConsignment.propTypes = {
  data: PropTypes.object.isRequired,
  productID: PropTypes.string,
  productComboID: PropTypes.string,
  consignmentID: PropTypes.string.isRequired,
  onChange:PropTypes.func
};

function ChangeStatusConsignment({
  data,
  productID,
  productComboID,
  consignmentID,
  onChange
}) {
  const [isShowButton, setIsShowButton] = useState(false);
  const [formValue, setFormValue] = useState({
    ...data,
    productID,
    productComboID,
    consignmentID,
  });
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const updateProductStatus = async (
    productData,
    isCombo = false,
    newStatus
  ) => {
    try {
      productData.status = newStatus;
      let productRes;
      if (isCombo) {
        productRes = await editComboInfo(productData);
      } else {
        productRes = await editFishInfo(productData);
      }
      return productRes;
    } catch (error) {
      console.error("Cập nhật trạng thái sản phẩm thất bại:", error);
      return null;
    }
  };

  const handleChangeStatus = async (newStatus) => {
    try {
      // Cập nhật trạng thái của consignment
      const consignmentRes = await updateConsignmentStatus(
        consignmentID,
        newStatus
      );

      if (consignmentRes) {
        message.success(
          `Trạng thái của đơn ký gửi đã được cập nhật thành ${newStatus}`
        );
        let productData = null;

        if (newStatus === "Đang tiến hành" || newStatus === "Hoàn tất") {
          const updatedStatus =
            newStatus === "Đang tiến hành" ? "Còn hàng" : "Hết hàng";

          if (productID) {
            productData = await fetchProductById(productID);
          } else if (productComboID) {
            productData = await fetchProductComboById(productComboID);
          }

          if (productData) {
            const productRes = await updateProductStatus(
              productData,
              !!productComboID,
              updatedStatus
            );
            if (productRes) {
              message.success(
                `Trạng thái sản phẩm đã được cập nhật thành ${updatedStatus}.`
              );
            } else {
              message.error("Cập nhật trạng thái sản phẩm thất bại.");
            }
          } else {
            message.error("Không tìm thấy dữ liệu sản phẩm.");
          }
        }

        // Cập nhật trạng thái trong formValue
        setFormValue((prevFormValue) => ({
          ...prevFormValue,
          status: newStatus === "Hoàn tất" ? "Hoàn tất" : "Đang tiến hành",
        }));
        onChange();
      } else {
        message.error("Cập nhật trạng thái đơn ký gửi thất bại.");
      }
    } catch (error) {
      console.error(
        "Lỗi khi cập nhật trạng thái:",
        error.response || error.message
      );
      message.error("Có lỗi xảy ra khi cập nhật trạng thái.");
    }
  };

  // Hàm mở modal xác nhận xóa khi nhấn "Đã hủy"
  const handleDeleteConfirmation = () => {
    setIsConfirmModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      let updateRes;

      // Lấy dữ liệu combo nếu có productComboID
      if (productComboID) {
        updateRes = await fetchProductComboById(productComboID);
        console.log("Fetched combo response:", updateRes); // Kiểm tra toàn bộ phản hồi từ API

        if (updateRes) {
          // Cập nhật trạng thái combo
          updateRes.status = "Đã hủy"; // Cập nhật trạng thái
          console.log("Updating combo with status:", updateRes); // Kiểm tra dữ liệu trước khi gọi API cập nhật

          const result = await editComboInfo(updateRes);
          console.log("Update combo response:", result); // Kiểm tra phản hồi từ API cập nhật
        } else {
          console.error("Không lấy được dữ liệu combo từ API.");
        }
      }

      // Sau khi cập nhật sản phẩm/combo, cập nhật trạng thái của consignment
      const consignmentUpdateRes = await updateConsignmentStatus(
        consignmentID,
        "Đã hủy"
      );
      if (consignmentUpdateRes) {
        message.success("Cập nhật trạng thái đơn ký gửi thành công.");
        setFormValue((prevFormValue) => ({
          ...prevFormValue,
          status: "Đã hủy",
        }));
      } else {
        message.error("Cập nhật trạng thái consignment thất bại.");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm và consignment:", error);
      message.error("Có lỗi xảy ra khi cập nhật sản phẩm hoặc consignment.");
    } finally {
      setIsConfirmModalVisible(false); // Đóng modal sau khi xử lý
    }
  };

  const handleShowButton = () => {
    setIsShowButton(true);
  };

  const handleCloseButton = () => {
    setIsShowButton(false);
  };

  return (
    <div>
      {!isShowButton ? (
        <Button onClick={handleShowButton}>Cập nhật trạng thái</Button>
      ) : (
        <div className="change-status-button__container">
          <div className="change-status-button__close">
            <Button onClick={handleCloseButton}>Ẩn trạng thái</Button>
          </div>
          <div className="change-status-button">
            {formValue.status === "Chờ xác nhận" && (
              <>
                <Button className="custom-button__transport" onClick={() => handleChangeStatus("Đang tiến hành")}>
                  Xác nhận
                </Button>
                <Button
                  type="primary"
                  danger
                  onClick={handleDeleteConfirmation}
                >
                  Hủy đơn
                </Button>
              </>
            )}

            {formValue.status === "Đang tiến hành" && (
              <Button className="custom-button" onClick={() => handleChangeStatus("Hoàn tất")}>
                Hoàn tất
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa sản phẩm */}
      <Modal
        title="Xác nhận hủy đơn"
        visible={isConfirmModalVisible}
        onOk={handleDelete}
        onCancel={() => setIsConfirmModalVisible(false)}
        okText="Xác nhận"
        cancelText="Hủy bỏ"
      >
        <p>
          Bạn có chắc chắn muốn hủy đơn và xóa sản phẩm hoặc combo sản phẩm?
        </p>
      </Modal>
    </div>
  );
}

export default ChangeStatusConsignment;
