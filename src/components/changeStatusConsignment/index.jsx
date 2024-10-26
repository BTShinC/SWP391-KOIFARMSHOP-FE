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
import { addDays, format } from "date-fns";
import "./index.scss";

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
  const [cancelReason, setCancelReason] = useState(""); 
  const [isReasonInvalid, setIsReasonInvalid] = useState(false); 
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

  // Hàm cập nhật trạng thái sản phẩm
  const updateProductStatus = async (
    productName,
    productData,
    isCombo = false,
    newStatus
  ) => {
    try {
      productData.status = newStatus;
      let productRes;
      if (isCombo) {
        productData.comboName = productName;
        productRes = await editComboInfo(productData);
      } else {
        productData.productName = productName;
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
      let reasonForm;
      if (formValue.consignmentType === "chăm sóc") {
        reasonForm = "Cá của mấy khách iu đã được chăm sóc đến tận kẽ răng";
      } else {
        reasonForm = "Cá đã bán thành công";
      }

      let updatedConsignmentStatus =
        formValue.consignmentType === "chăm sóc" ? "Đang chăm sóc" : "Đang tiến hành";

      // Lấy thời gian UTC
      const currentDate = new Date().toISOString();
      const dateExpiration = format(
        addDays(new Date(), formValue.duration),
        "yyyy-MM-dd"
      );

      const updatedFormValue = {
        ...formValue,
        dateReceived: currentDate, // Sử dụng thời gian UTC
        reason: reasonForm,
        dateExpiration: dateExpiration,
        status: updatedConsignmentStatus,
      };

      await updateConsignmentAndProduct(updatedFormValue);

      if (onChange) {
        onChange();
      }
    } catch (error) {
      console.error("Error in handleInProgress:", error);
      message.error("Có lỗi xảy ra khi cập nhật trạng thái.");
    }
  };

  const handleComplete = async () => {
    let reasonForm;
    const currentDate = new Date().toISOString(); // Lấy thời gian UTC

    if (formValue.consignmentType === "chăm sóc") {
      reasonForm =
        "Cá của mấy khách iu đã được chăm sóc đến tận kẽ răng. Vui lòng kiểm tra thường xuyên để cập nhật tình hình cá";
    } else {
      reasonForm =
        "Cá đang được đăng để bán. Vui lòng kiểm tra thường xuyên để cập nhật tình hình cá";
    }

    const updatedFormValue = {
      ...formValue,
      status: "Hoàn tất",
      reason: reasonForm,
      saleDate: currentDate,
    };

    await updateConsignmentAndProduct(updatedFormValue);

    if (onChange) {
      onChange();
    }
  };

  const handleRefund = async () => {
    const updatedFormValue = {
      ...formValue,
      status: "Đã hoàn tiền",
    };

    await updateConsignmentAndProduct(updatedFormValue);

    const refundRes = await refundConsignmentSell(updatedFormValue);
    if (refundRes) {
      message.success("Hoàn tiền thành công.");
    } else {
      message.error("Hoàn tiền thất bại.");
    }

    if (onChange) {
      onChange();
    }
  };

  const handleDelete = async () => {
    if (!cancelReason) {
      setIsReasonInvalid(true); 
      return;
    }

    try {
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
        reason: cancelReason, 
      };

      const consignmentUpdateRes = await updateConsignmentByID(updatedFormValue);

      if (consignmentUpdateRes) {
        setFormValue(updatedFormValue); 

        message.success("Cập nhật trạng thái đơn ký gửi thành công.");

        const refund = await refundConsignmentSell(consignmentID);
        if (refund) {
          message.success("Hoàn tiền thành công.");
        }

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
      setIsConfirmModalVisible(false);
    }
  };

  const updateConsignmentAndProduct = async (updatedFormValue) => {
    try {
      const consignmentRes = await updateConsignmentByID(updatedFormValue);
      if (!consignmentRes) {
        message.error("Cập nhật trạng thái đơn ký gửi thất bại.");
        return;
      }
      message.success(`Trạng thái của đơn ký gửi đã được cập nhật thành ${updatedFormValue.status}`);

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
      const productName = productData.breed + "+" + updatedFormValue.consignmentID;

      const productRes = await updateProductStatus(
        productName,
        productData,
        isCombo,
        updatedProductStatus
      );

      if (!productRes) {
        message.error("Cập nhật trạng thái sản phẩm thất bại.");
      }

      setFormValue(updatedFormValue);

      if (onChange) {
        onChange();
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật consignment và sản phẩm:", error);
      message.error("Có lỗi xảy ra khi cập nhật trạng thái.");
    }
  };

  const getUpdatedProductStatus = (consignmentStatus, consignmentType) => {
    if (consignmentStatus === "Đang chăm sóc") {
      return "Đang chăm sóc";
    } else if (consignmentStatus === "Đang tiến hành") {
      return "Còn hàng";
    } else if (consignmentStatus === "Hoàn tất" && consignmentType === "chăm sóc") {
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
                <Button className="custom-button__transport" onClick={handleInProgress}>
                  Xác nhận
                </Button>
                <Button type="primary" danger onClick={() => setIsConfirmModalVisible(true)}>
                  Hủy đơn
                </Button>
              </>
            )}
            {(formValue.status === "Đang tiến hành" || formValue.status === "Đang chăm sóc") && (
              <Button className="custom-button" onClick={handleComplete}>
                Hoàn tất
              </Button>
            )}
            {formValue.status === "Hoàn tất" && formValue.consignmentType === "Ký gửi để bán" && (
              <Button className="custom-button__transport" onClick={handleRefund}>
                Hoàn tiền
              </Button>
            )}
          </div>
        </div>
      )}

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
