import AdminFilter from "../../../components/admin-components/admin-filter";
import AdminHeader from "../../../components/admin-components/admin-headers";
import AdminSideBar from "/src/components/admin-components/admin-sidebar";
import ProductComboTable from "../../../components/admin-components/productCombo-table";
import { useCallback, useEffect, useState } from "react";
import { fetchAllProductCombo } from "../../../service/userService";

import { Pagination, Select } from "antd"; // Import Select from antd
import AddFishComboModal from "../manageProductCombo/AddFishComboModal";

const { Option } = Select;

ManageProductCombo.propTypes = {};

function ManageProductCombo() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [pageSize, setPageSize] = useState(8); // Items per page
  const [filteredData, setFilteredData] = useState([]); // Data after applying filters
  const [statusFilter, setStatusFilter] = useState(""); // Status filter state
  const [priceSortOrder, setPriceSortOrder] = useState(null); // Price sorting order state

  useEffect(() => {
    getProductCombo();
  }, []);

  const getProductCombo = async () => {
    try {
      let res = await fetchAllProductCombo();
      console.log("API Response:", res);
      if (res) {
        setData(res);
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Function to handle status filtering
  const handleStatusFilter = (value) => {
    console.log("Status Filter selected:", value); // Debugging log
    setStatusFilter(value);
  };

  // Function to handle price sorting
  const handlePriceSort = (value) => {
    console.log("Price Sort selected:", value); // Debugging log
    setPriceSortOrder(value);
  };

  // Apply status filtering and price sorting
  const applyFiltersAndSorting = useCallback(() => {
    let updatedData = [...data];

    // Filter by status
    if (statusFilter) {
      updatedData = updatedData.filter((item) => item.status === statusFilter);
    }

    // Sort by price
    if (priceSortOrder === "ascend") {
      updatedData.sort((a, b) => a.price - b.price);
    } else if (priceSortOrder === "descend") {
      updatedData.sort((a, b) => b.price - a.price);
    }

    setFilteredData(updatedData);
  }, [data, statusFilter, priceSortOrder]);

  useEffect(() => {
    applyFiltersAndSorting();
  }, [data, statusFilter, priceSortOrder, applyFiltersAndSorting]);

  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const handleSearch = (value) => {
    console.log(value);
  };

  const handleOnChange = () => {
    getProductCombo();
  };

  const columns = [
    "Mã lô cá",
    "Các giống cá",
    "Kích thước trung bình",
    "Hình thức",
    "Số lượng",
    "Giá bán",
    "Trạng thái",
    "Thao tác",
  ];

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="admin">
      <div className="admin-sidebar">
        <AdminSideBar />
      </div>
      <div className="admin-content">
        <AdminHeader />
        <h1 className="content__title">Trang quản lý</h1>
        <div className="filter-section">
          {/* Status Filter */}
          <AdminFilter
            onSearch={handleSearch}
            ModalComponent={AddFishComboModal}
            onChange={handleOnChange}
          />
          <Select
            style={{ width: 200, marginRight: 16 }}
            placeholder="Chọn trạng thái"
            onChange={handleStatusFilter}
            allowClear
          >
            <Option value="Còn hàng">Còn hàng</Option>
            <Option value="Hết hàng">Hết hàng</Option>
            <Option value="Hoàn tất">Hoàn tất</Option>
            <Option value="Đã hoàn tiền">Đã hoàn tiền</Option>
            <Option value="Đang chăm sóc">Đang chăm sóc</Option>
            <Option value="Hoàn tất chăm sóc">Hoàn tất chăm sóc</Option>
          </Select>

          {/* Price Sort */}
          <Select
            style={{ width: 200 }}
            placeholder="Sắp xếp theo giá"
            onChange={handlePriceSort}
            allowClear
          >
            <Option value="ascend">Giá tăng dần</Option>
            <Option value="descend">Giá giảm dần</Option>
          </Select>
        </div>
        <ProductComboTable
          data={paginatedData}
          columns={columns}
          onChange={handleOnChange}
        />
        {/* Centered Pagination */}
        <div className="pagination-container">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredData.length}
            onChange={handlePaginationChange}
            showSizeChanger={false} // Hide page size changer
          />
        </div>
      </div>
    </div>
  );
}

export default ManageProductCombo;
