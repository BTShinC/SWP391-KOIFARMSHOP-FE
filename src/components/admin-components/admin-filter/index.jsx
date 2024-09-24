import PropTypes from "prop-types";
import { Input, Space, Button } from "antd";
const { Search } = Input;
import './index.scss'
function AdminFilter({ onSearch, buttonText }) {
  return (
    <div className="content__filter">
      <Space direction="vertical">
        <Search
          placeholder="Nhập từ khóa tìm kiếm"
          onSearch={onSearch}
          style={{ width: 400 }}
          enterButton
        />
      </Space>
      <Button type="primary">{buttonText}</Button>
    </div>
  );
}

AdminFilter.propTypes = {
  onSearch: PropTypes.func.isRequired,
  buttonText: PropTypes.string.isRequired, 
};

export default AdminFilter;
