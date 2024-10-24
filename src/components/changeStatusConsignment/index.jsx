import { Button, Modal, message } from "antd";
import PropTypes from "prop-types";
import { useState } from "react";
import {
  updateConsignmentStatus,
  fetchProductComboById,
  fetchProductById,
  editFishInfo,
  editComboInfo,
  updateConsignmentByID,
  refundConsignmentSell,
} from "../../service/userService";

ChangeStatusConsignment.propTypes = {
  data: PropTypes.object.isRequired,
  productID: PropTypes.string,
  productComboID: PropTypes.string,
  consignmentID: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};

function ChangeStatusConsignment({
  data,
  productID,
  productComboID,
  consignmentID,
  onChange,
}) {
  const [isShowButton, setIsShowButton] = useState(false);
  const [formValue, setFormValue] = useState({
    ...data,
    productID,
    productComboID,
    consignmentID,
  });
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  // Cập nhật trạng thái ở  sản phẩm
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
  console.log(formValue);

  const handleChangeStatus = async (newStatus) => {
    try {
      const currentDate = new Date().toISOString();
      let updatedConsignmentStatus = newStatus;
      let {
        dateReceived,
        dateExpiration,
        consignmentType,
        duration,
        saleDate,
      } = formValue;

      // Xác định trạng thái cập nhật của consignment
      if (newStatus === "Đang tiến hành") {
        updatedConsignmentStatus =
          consignmentType === "chăm sóc" ? "Đang chăm sóc" : "Đang tiến hành";

        // Cập nhật ngày nhận và ngày đáo hạn
        dateReceived = currentDate;
        const receivedDate = new Date(dateReceived);
        receivedDate.setDate(receivedDate.getDate() + duration);
        dateExpiration = receivedDate.toISOString();
      } else if (
        newStatus === "Hoàn tiền" &&
        consignmentType === "Ký gửi để bán"
      ) {
        updatedConsignmentStatus = "Đã hoàn tiền";
      }

      // Giữ lại các giá trị khác khi cập nhật trạng thái
      const updatedFormValue = {
        ...formValue,
        status: updatedConsignmentStatus,
        saleDate:
          updatedConsignmentStatus === "Hoàn tất" ? currentDate : saleDate,
        dateReceived,
        dateExpiration,
      };

      // Cập nhật trạng thái consignment
      console.log(updatedFormValue)
      const consignmentRes = await updateConsignmentByID(updatedFormValue);
      console.log(consignmentRes)
      if (!consignmentRes) {
        message.error("Cập nhật trạng thái đơn ký gửi thất bại.");
        return;
      }

      message.success(
        `Trạng thái của đơn ký gửi đã được cập nhật thành ${updatedConsignmentStatus}`
      );

      // Xác định trạng thái của sản phẩm
      const updatedProductStatus = getUpdatedProductStatus(
        updatedConsignmentStatus,
        consignmentType
      );

      // Lấy dữ liệu sản phẩm
      const productData = productID
        ? await fetchProductById(productID)
        : productComboID
        ? await fetchProductComboById(productComboID)
        : null;

      if (!productData) {
        message.error("Không tìm thấy dữ liệu sản phẩm.");
        return;
      }

      // Cập nhật trạng thái của sản phẩm
      const isCombo = !!productComboID;
      const productRes = await updateProductStatus(
        productData,
        isCombo,
        updatedProductStatus
      );

      if (productRes) {
        message.success(
          `Trạng thái sản phẩm đã được cập nhật thành ${updatedProductStatus}.`
        );
      } else {
        message.error("Cập nhật trạng thái sản phẩm thất bại.");
      }

      // Xử lý trạng thái "Hoàn tiền"
      if (updatedConsignmentStatus === "Hoàn tiền") {
        const refundRes = await refundConsignmentSell(updatedFormValue);
        if (refundRes) {
          message.success("Hoàn tiền thành công.");
          const saleDateUpdateRes = await updateConsignmentByID(
            updatedFormValue
          );
          if (saleDateUpdateRes) {
            message.success(`Ngày đã hoàn tiền là ${currentDate}`);
          } else {
            message.error("Không thể cập nhật ngày đã hoàn tiền.");
          }
        } else {
          message.error("Hoàn tiền thất bại.");
        }
      }

      // Cập nhật trạng thái trong formValue
      setFormValue(updatedFormValue);

      // Gọi lại onChange nếu có
      if (onChange) {
        onChange();
      }
    } catch (error) {
      console.error(
        "Lỗi khi cập nhật trạng thái:",
        error.response || error.message
      );
      message.error("Có lỗi xảy ra khi cập nhật trạng thái.");
    }
  };

  // Hàm phụ để xác định trạng thái sản phẩm
  const getUpdatedProductStatus = (consignmentStatus, consignmentType) => {
    if (consignmentStatus === "Đang chăm sóc") {
      return "Đang chăm sóc";
    } else if (consignmentStatus === "Đang tiến hành") {
      return "Còn hàng";
    } else if (
      consignmentStatus === "Hoàn tất" &&
      consignmentType === "chăm sóc"
    ) {
      return "Hoàn tất chăm sóc";
    }
    return "Hết hàng";
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
                <Button
                  className="custom-button__transport"
                  onClick={() => handleChangeStatus("Đang tiến hành")}
                >
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
            {(formValue.status === "Đang tiến hành" ||
              formValue.status === "Đang chăm sóc") && (
              <Button
                className="custom-button"
                onClick={() => handleChangeStatus("Hoàn tất")}
              >
                Hoàn tất
              </Button>
            )}

            {formValue.status === "Hoàn tất" &&
              formValue.consignmentType === "Ký gửi để bán" && (
                <>
                  <Button
                    className="custom-button__transport"
                    onClick={() => handleChangeStatus("Hoàn tiền")}
                  >
                    Hoàn tiền
                  </Button>
                </>
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
