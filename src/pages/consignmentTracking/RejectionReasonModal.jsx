import { useState } from "react";
import { Modal, Button } from "antd";
import PropTypes from "prop-types";

const RejectionReasonModal = ({ reason }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Xem lý do từ chối
      </Button>
      <Modal
        title="Lý do bị từ chối"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>{reason}</p>
      </Modal>
    </>
  );
};
RejectionReasonModal.propTypes = {
  reason: PropTypes.string.isRequired,
};
export default RejectionReasonModal;
