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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [filteredData, setFilteredData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [priceSortOrder, setPriceSortOrder] = useState(null);

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
    console.log("Status Filter selected:", value);
    setStatusFilter(value);
  };

  const handlePriceSort = (value) => {
    console.log("Price Sort selected:", value);
    setPriceSortOrder(value);
  };

  const applyFiltersAndSorting = useCallback(() => {
    let updatedData = [...data];
  
    // Filter by status
    if (statusFilter) {
      updatedData = updatedData.filter((item) => item.status === statusFilter);
    }
  
    
    const statusOrder = [
      "Chờ xác nhận",
      "Còn hàng",      
      "Đã bán",
      "Đang tiến hành",
      "Đang chăm sóc", 
      "Hết hàng", 
      "Đã hủy",    
    ];
  
    // Sort by status
    updatedData.sort((a, b) => {
      return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
    });
  
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
    const searchTerm = value.trim().toLowerCase();
    if (searchTerm === "") {
      setFilteredData(data);
    } else {
      const result = data.filter((fish) =>
        fish.productComboID.toLowerCase().includes(searchTerm)
      );
      setFilteredData(result);
    }
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
        <div
          className="pagination-container"
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredData.length}
            onChange={handlePaginationChange}
            showSizeChanger={false}
          />
        </div>
      </div>
    </div>
  );
}

export default ManageProductCombo;
