import { Button, Modal } from "antd";
import PropTypes from "prop-types";
import { useState } from "react";
ChangeStatusConsignment.propTypes = {
  data: PropTypes.object.isRequired,
};

function ChangeStatusConsignment(data) {
  const initKoiSignment = {
    koiConsignmentID: data.koiConsignmentID,
    breed: data.breed,
    age: data.age,
    size: data.size,
    sex: data.sex,
    healthStatus: data.healthStatus,
    accountID: data.accountID,
    personalityTrait: data.personalityTrait,
    origin: data.origin,
    description: data.description,
    image: data.image,
    certificate: data.certificate,
    carePackageID: data.carePackageID,
    type: data.type,
    desiredPrice: data.desiredPrice,
    status: data.status,
  };

  const [isShowButton, setIsShowButton] = useState(false);
  const [formValue, setFormValue] = useState(initKoiSignment);
  const handleChangeStatus = (newStatus) => {
    if (newStatus === "Đã hủy") {
      // Hiển thị Modal xác nhận hủy
      Modal.confirm({
        title: "Bạn chắc chắn muốn hủy?",
        okText: "Yes",
        cancelText: "No",
        centered: true,
        onOk: () => {
          // Hành động khi người dùng nhấn "Yes"
          setFormValue((prevFormValue) => {
            const updatedForm = {
              ...prevFormValue,
              status: newStatus,
            };
            console.log(updatedForm);
            return updatedForm;
          });
        },
        onCancel: () => {
          // Hành động khi người dùng nhấn "No" (Không cần làm gì nếu chỉ muốn đóng modal)
        },
      });
    } else {
      setFormValue((prevFormValue) => {
        const updatedForm = {
          ...prevFormValue,
          status: newStatus,
        };
        console.log(updatedForm); // Thực hiện hành động với giá trị mới
        return updatedForm;
      });
    }
  };

  const handleShowButton = () => {
    setIsShowButton(true);
  };
  const handleCloseButton = () => {
    setIsShowButton(false);
  };
  if (formValue.status === "Hoàn tất" || formValue.status === "Đã bán") {
    return null;
  }
  return (
    <div>
      {!isShowButton ? (
        <Button onClick={handleShowButton}>Cập nhật trạng thái</Button>
      ) : formValue.type === "chăm sóc" ? (
        <div className="change-status-button__container">
          <div className="change-status-button__close">
            <Button onClick={handleCloseButton}>Ẩn trạng thái</Button>
          </div>
          {formValue.status != "Đã hủy" && formValue.status != "Đã bán" && (
            <div className="change-status-button">
              {formValue.status == "Chờ xác nhận" ? (
                <>
                  <Button
                    className="custom-button__transport"
                    onClick={() => handleChangeStatus("Xác nhận")}
                  >
                    Xác nhận
                  </Button>
                  <Button
                    type="primary"
                    danger
                    onClick={() => handleChangeStatus("Đã hủy")}
                  >
                    Hủy đơn
                  </Button>
                </>
              ) : formValue.status == "Xác nhận" ? (
                <Button
                  className="custom-button__transport"
                  onClick={() => handleChangeStatus("Đang chăm sóc")}
                >
                  Đang chăm sóc
                </Button>
              ) : (
                <Button
                  className="custom-button"
                  onClick={() => handleChangeStatus("Hoàn tất")}
                >
                  Hoàn tất
                </Button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="change-status-button__container">
          <div className="change-status-button__close">
            <Button onClick={handleCloseButton}>Ẩn trạng thái</Button>
          </div>
          {formValue.status !== "Đã hủy" && (
            <div className="change-status-button">
              {formValue.status === "Chờ xác nhận" && (
                <>
                  <Button
                    className="custom-button__transport"
                    onClick={() => handleChangeStatus("Xác nhận")}
                  >
                    Xác nhận
                  </Button>
                  <Button
                    type="primary"
                    danger
                    onClick={() => handleChangeStatus("Đã hủy")}
                  >
                    Hủy đơn
                  </Button>
                </>
              )}
              {formValue.status === "Xác nhận" && (
                <Button
                  className="custom-button__transport"
                  onClick={() => handleChangeStatus("Còn hàng")}
                >
                  Đang quảng bá
                </Button>
              )}
              {formValue.status !== "Chờ xác nhận" &&
                formValue.status !== "Xác nhận" && (
                  <Button
                    className="custom-button"
                    onClick={() => handleChangeStatus("Đã bán")}
                  >
                    Đã bán
                  </Button>
                )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ChangeStatusConsignment;
