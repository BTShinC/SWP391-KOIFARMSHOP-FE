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
  refundConsignmentTotal,
  createTransaction,
} from "../../service/userService";
import { addDays } from "date-fns";
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
        reasonForm =
          "Cá của mấy khách iu đã được chăm sóc đến tận kẽ răng. Vui lòng kiểm tra thường xuyên để cập nhật tình hình cá";
      } else {
        reasonForm =
          "Cá đang được đăng để bán. Vui lòng kiểm tra thường xuyên để cập nhật tình hình cá";
      }

      let updatedConsignmentStatus =
        formValue.consignmentType === "chăm sóc"
          ? "Đang chăm sóc"
          : "Đang tiến hành";

      // const currentDate = new Date().toISOString();
      // const dateExpiration = addDays(
      //   new Date(),
      //   formValue.duration
      // ).toISOString();

      // Kiểm tra dữ liệu trước khi gửi lên server
      if (!formValue.consignmentID || !formValue.duration) {
        message.error(
          "Thiếu dữ liệu quan trọng như consignmentID hoặc duration."
        );
        return;
      }

      const updatedFormValue = {
        ...formValue,
        reason: reasonForm,
        // dateReceived: currentDate,
        // dateExpiration: dateExpiration,
        status: updatedConsignmentStatus,
      };

      console.log("Cập nhật dữ liệu:", updatedFormValue); // Log để kiểm tra dữ liệu
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
    const currentDate = new Date().toISOString();

    if (formValue.consignmentType === "Ký gửi chăm sóc") {
      reasonForm = "Cá của các khách iu đã được chăm sóc đến từng kẽ răng";
    } else {
      reasonForm =
        "Cá đã được bán thành công tiền sẽ được hoàn lại trong vòng 3 ngày vui lòng kiểm tra lại số dư ví và lịch sử giao dịch";
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
    try {
      // Cập nhật trạng thái consignment
      const updatedFormValue = {
        ...formValue,
        status: "Đã hoàn tiền",
        reason:
          "Tiền đã được hoàn lại vào ví của quý khách vui lòng kiểm tra lại nếu có thắc mắc vui lòng liên hệ hotline của KOIFISH",
      };

      const consignmentRes = await updateConsignmentAndProduct(
        updatedFormValue
      );

      if (consignmentRes) {
        message.success("Cập nhật trạng thái đơn ký thành công.");
      }

      // Thực hiện hoàn tiền
      const refundRes = await refundConsignmentSell(
        updatedFormValue.consignmentID
      );
      if (refundRes) {
        message.success("Hoàn tiền thành công.");
      }

      // Tạo transaction cho lịch sử hoàn tiền
      const transactionData = {
        accountID: updatedFormValue.accountID,
        price: updatedFormValue.salePrice * 0.8,
        date: new Date(),
        description: `Hoàn tiền đơn ${updatedFormValue.consignmentID}`,
      };

      const transactionRes = await createTransaction(transactionData);
      if (transactionRes) {
        message.success("Lưu transaction thành công.");
      }
      // Gọi callback để cập nhật trạng thái nếu có
      if (onChange) {
        onChange();
      }
    } catch (error) {
      console.error("Lỗi trong quá trình hoàn tiền:", error);
      message.error("Có lỗi xảy ra trong quá trình hoàn tiền và cập nhật.");
    }
  };

  const handleDelete = async () => {
    if (!cancelReason) {
      setIsReasonInvalid(true);
      return;
    }

    try {
      // Hoàn tiền trước
      const refund = await refundConsignmentTotal(consignmentID);
      if (!refund) {
        message.error("Hoàn tiền thất bại. Không thể cập nhật trạng thái.");
        return;
      }

      message.success("Hoàn tiền thành công.");

      // Tạo transaction để lưu lại lịch sử hoàn tiền
      const transactionData = {
        accountID: data.accountID,
        price: data.total,
        date: new Date(),
        description: `Hoàn tiền đơn ${consignmentID}`,
      };

      const transactionRes = await createTransaction(transactionData);
      if (transactionRes) {
        message.success("Lưu transaction thành công");
      }
      // Sau khi hoàn tiền thành công, cập nhật trạng thái sản phẩm nếu có productComboID
      if (productComboID) {
        const updateRes = await fetchProductComboById(productComboID);
        if (updateRes) {
          updateRes.status = "Đã hủy";
          await editComboInfo(updateRes);
        } else {
          message.error("Cập nhật trạng thái sản phẩm thất bại.");
          return;
        }
      }
      let currentDate = new Date();
      // Cập nhật lại trạng thái consignment
      const updatedFormValue = {
        ...formValue,
        status: "Đã hủy",
        saleDate: currentDate,
        reason: cancelReason,
        total: 0, // Total về 0 sau khi hoàn tiền
      };

      const consignmentUpdateRes = await updateConsignmentByID(
        updatedFormValue
      );

      if (consignmentUpdateRes) {
        setFormValue(updatedFormValue);
        message.success("Cập nhật trạng thái đơn ký gửi thành công.");

        // Gọi callback onChange nếu có
        if (onChange) {
          setTimeout(onChange, 0);
        }
      } else {
        message.error("Cập nhật trạng thái consignment thất bại.");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm và consignment:", error);
      message.error(
        "Có lỗi xảy ra khi hoàn tiền hoặc cập nhật sản phẩm/consignment."
      );
    } finally {
      setIsConfirmModalVisible(false); // Đóng modal xác nhận
    }
  };

  const updateConsignmentAndProduct = async (updatedFormValue) => {
    try {
      // Gọi API để cập nhật consignment
      const consignmentRes = await updateConsignmentByID(updatedFormValue);
      if (!consignmentRes || consignmentRes.status !== 200) {
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

      const productData = updatedFormValue.productID
        ? await fetchProductById(updatedFormValue.productID)
        : updatedFormValue.productComboID
        ? await fetchProductComboById(updatedFormValue.productComboID)
        : null;

      if (!productData) {
        message.error("Không tìm thấy dữ liệu sản phẩm.");
        return;
      }

      const isCombo = !!updatedFormValue.productComboID;
      const productName =
        productData.breed + "+" + "("+updatedFormValue.consignmentID+")";

      // Cập nhật trạng thái của sản phẩm
      const productRes = await updateProductStatus(
        productName,
        productData,
        isCombo,
        updatedProductStatus
      );

      if (!productRes || productRes.status !== 200) {
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
    } else if (
      consignmentStatus === "Hoàn tất" &&
      consignmentType === "Ký gửi chăm sóc"
    ) {
      return "Hoàn tất chăm sóc";
    } else if (consignmentStatus === "Hoàn trả") {
      return "Cá đã được hoàn trả lại";
    }
    return "Hết hàng";
  };

  const handleShowButton = () => {
    setIsShowButton(true);
  };

  const handleCloseButton = () => {
    setIsShowButton(false);
  };

  const handleReturnFish = async () => {
    let reasonForm =
      "Đã hết thời hạn ký gửi nhưng cá vẫn chưa được bán . Chúng tôi sẽ hoàn trả lại cá cho bạn";
    const currentDate = new Date().toISOString();

    const updatedFormValue = {
      ...formValue,
      status: "Hoàn trả",
      reason: reasonForm,
      saleDate: currentDate,
    };

    await updateConsignmentAndProduct(updatedFormValue);

    if (onChange) {
      onChange();
    }
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
            {formValue.status === "Đang tiến hành" && (
              <>
                <Button className="custom-button" onClick={handleComplete}>
                  Hoàn tất
                </Button>
                <Button className="custom-button" onClick={handleReturnFish}>
                  Hoàn trả
                </Button>
              </>
            )}

            {formValue.status === "Đang chăm sóc" && (
              <Button className="custom-button" onClick={handleComplete}>
                Hoàn tất
              </Button>
            )}
            {formValue.status === "Hoàn tất" &&
              formValue.consignmentType === "Ký gửi để bán" && (
                <Button
                  className="custom-button__transport"
                  onClick={handleRefund}
                >
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
