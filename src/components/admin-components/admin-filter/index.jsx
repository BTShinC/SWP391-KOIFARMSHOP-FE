import PropTypes from "prop-types";
import { Input, Space, Button } from "antd"; // Import Button từ Ant Design
const { Search } = Input;
import { useState } from "react";
import "./index.scss";

function AdminFilter({ onSearch, ModalComponent, onChange }) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Hàm mở modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Hàm đóng modal
  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="content__filter">
      <Space direction="vertical">
        <Search
          placeholder="Nhập ID cần tìm kiếm"
          onSearch={onSearch}
          style={{ width: 400 }}
          enterButton
        />
      </Space>
      {/* Hiển thị ModalComponent nếu tồn tại */}
      {ModalComponent && (
        <>
          <Button
            type="primary"
            onClick={showModal}
            style={{ marginLeft: "10px" }}
          >
            Thêm cá
          </Button>
          <ModalComponent
            title="Thêm cá"
            visible={isModalVisible} // Truyền trạng thái visible
            onClose={closeModal} // Truyền hàm đóng modal
            onChange={onChange}
          />
        </>
      )}
    </div>
  );
}

AdminFilter.propTypes = {
  onSearch: PropTypes.func.isRequired,
  ModalComponent: PropTypes.elementType,
  onChange : PropTypes.func,
};

export default AdminFilter;
