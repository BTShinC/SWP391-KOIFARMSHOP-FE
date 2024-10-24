import { Button, Input, Modal, message } from "antd";
import PropTypes from "prop-types";
import { useState } from "react";
import {
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
  const [cancelReason, setCancelReason] = useState(""); // Lưu trữ lý do hủy
  const [isReasonInvalid, setIsReasonInvalid] = useState(false); // Kiểm tra xem lý do có hợp lệ không
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

  // Hàm cập nhật trạng thái sản phẩm
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

  const handleInProgress = async () => {
    try {
      const currentDate = new Date().toISOString();
      let { consignmentType, duration } = formValue;

      if (!duration || duration <= 0) {
        message.error("Thời gian không hợp lệ.");
        return;
      }

      let updatedConsignmentStatus =
        consignmentType === "chăm sóc" ? "Đang chăm sóc" : "Đang tiến hành";

      let dateReceived = currentDate;
      const receivedDate = new Date(dateReceived);
      receivedDate.setDate(receivedDate.getDate() + duration);
      let dateExpiration = receivedDate.toISOString();

      const updatedFormValue = {
        ...formValue,
        status: updatedConsignmentStatus,
        dateReceived,
        dateExpiration,
      };

      console.log("Updated Form Value:", updatedFormValue);

      await updateConsignmentAndProduct(updatedFormValue);

      // Gọi lại onChange sau khi trạng thái thay đổi
      if (onChange) {
        onChange();
      }
    } catch (error) {
      console.error("Error in handleInProgress:", error);
      message.error("Có lỗi xảy ra khi cập nhật trạng thái.");
    }
  };

  const handleComplete = async () => {
    const currentDate = new Date().toISOString();
    const updatedFormValue = {
      ...formValue,
      status: "Hoàn tất",
      saleDate: currentDate,
    };

    await updateConsignmentAndProduct(updatedFormValue);

    // Gọi lại onChange sau khi trạng thái thay đổi
    if (onChange) {
      onChange();
    }
  };

  const handleRefund = async () => {
    const currentDate = new Date().toISOString();
    const updatedFormValue = {
      ...formValue,
      status: "Đã hoàn tiền",
      saleDate: currentDate,
    };

    await updateConsignmentAndProduct(updatedFormValue);

    // Thực hiện hoàn tiền
    const refundRes = await refundConsignmentSell(updatedFormValue);
    if (refundRes) {
      message.success("Hoàn tiền thành công.");
    } else {
      message.error("Hoàn tiền thất bại.");
    }

    // Gọi lại onChange sau khi trạng thái thay đổi
    if (onChange) {
      onChange();
    }
  };

  const handleDelete = async () => {
    if (!cancelReason) {
      setIsReasonInvalid(true); // Đánh dấu lỗi nếu lý do bị bỏ trống
      return; // Không cho phép hủy nếu không có lý do
    }

    try {
      // Lấy dữ liệu combo nếu có productComboID
      if (productComboID) {
        const updateRes = await fetchProductComboById(productComboID);
        if (updateRes) {
          updateRes.status = "Đã hủy";
          await editComboInfo(updateRes);
        }
      }

      const updatedFormValue = {
        ...formValue,
        status: "Đã hủy",
        reason: cancelReason, // Cập nhật lý do hủy
      };

      const consignmentUpdateRes = await updateConsignmentByID(
        updatedFormValue
      );

      if (consignmentUpdateRes) {
        // Cập nhật formValue để chứa lý do hủy
        setFormValue(updatedFormValue); // Cập nhật state với trạng thái và lý do hủy mới

        message.success("Cập nhật trạng thái đơn ký gửi thành công.");

        // Thực hiện hoàn tiền (nếu cần thiết)
        const refund = await refundConsignmentSell(consignmentID);
        if (refund) {
          message.success("Hoàn tiền thành công.");
        }

        // Gọi lại onChange sau khi trạng thái thay đổi
        if (onChange) {
          setTimeout(onChange, 0);
        }
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




  // Hàm cập nhật consignment và sản phẩm
  const updateConsignmentAndProduct = async (updatedFormValue) => {
    // Cập nhật trạng thái consignment
    console.log(updatedFormValue)
    const consignmentRes = await updateConsignmentByID(updatedFormValue);
    if (!consignmentRes) {
      message.error("Cập nhật trạng thái đơn ký gửi thất bại.");
      return;
    }
    message.success(
      `Trạng thái của đơn ký gửi đã được cập nhật thành ${updatedFormValue.status}`
    );

    // Cập nhật trạng thái sản phẩm
    const updatedProductStatus = getUpdatedProductStatus(
      updatedFormValue.status,
      updatedFormValue.consignmentType
    );
    const productData = productID
      ? await fetchProductById(productID)
      : productComboID
      ? await fetchProductComboById(productComboID)
      : null;

    if (!productData) {
      message.error("Không tìm thấy dữ liệu sản phẩm.");
      return;
    }

    const isCombo = !!productComboID;
    const productRes = await updateProductStatus(
      productData,
      isCombo,
      updatedProductStatus
    );
    if (!productRes) {
      message.error("Cập nhật trạng thái sản phẩm thất bại.");
    }

    // Cập nhật formValue trong state
    setFormValue(updatedFormValue);

    // Gọi lại onChange nếu được truyền từ props
    if (onChange) {
      onChange();
    }
  };

  // Hàm phụ để xác định trạng thái sản phẩm dựa trên trạng thái consignment
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
                  onClick={handleInProgress}
                >
                  Xác nhận
                </Button>
                <Button
                  type="primary"
                  danger
                  onClick={() => setIsConfirmModalVisible(true)}
                >
                  Hủy đơn
                </Button>
              </>
            )}
            {formValue.status === "Đang tiến hành" ||
              (formValue.status === "Đang chăm sóc" && (
                <Button className="custom-button" onClick={handleComplete}>
                  Hoàn tất
                </Button>
              ))}

            {formValue.status === "Hoàn tất" &&
              formValue.consignmentType === "Ký gửi để bán" && (
                <>
                  <Button
                    className="custom-button__transport"
                    onClick={handleRefund}
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
        <p>Bạn có chắc chắn muốn hủy đơn này?</p>
        <Input
          placeholder="Vui lòng nhập lý do hủy đơn"
          value={cancelReason}
          onChange={(e) => {
            setCancelReason(e.target.value);
            setIsReasonInvalid(false);
          }}
        />
        {isReasonInvalid && (
          <p style={{ color: "red" }}>Lý do hủy đơn không được để trống.</p>
        )}
      </Modal>
    </div>
  );
}

export default ChangeStatusConsignment;
