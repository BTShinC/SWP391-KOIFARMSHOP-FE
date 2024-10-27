import { useEffect, useState, useCallback } from "react";
import AdminHeader from "../../../components/admin-components/admin-headers";
import AdminSideBar from "../../../components/admin-components/admin-sidebar";
import ConsignmentTable from "./Consignment-table";
import { fetchAllConsignment } from "../../../service/userService";
import { Pagination, Select, DatePicker } from "antd";
import moment from "moment";

const { Option } = Select;

const columns = [
  "Mã ký gửi",
  "Ngày tạo đơn",
  "Ngày nhận cá",
  "Ngày đáo hạn",
  "Ngày hoàn tất",
  "Mã sản phẩm",
  "Lợi nhuận đơn",
  "Hình thức",
  "Trạng thái đơn ký gửi",
  "Thao tác",
];

function ManageConsignment() {
  const [koiConsignmentData, setKoiConsignmentData] = useState([]); // Raw data from API
  const [filteredData, setFilteredData] = useState([]); // Filtered data for display
  const [filterType, setFilterType] = useState("all"); // Consignment type filter
  const [expiryDateFilter, setExpiryDateFilter] = useState(null); // Expiry date filter
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const itemsPerPage = 8; // Items per page

  // Fetch all consignment data once on component mount
  useEffect(() => {
    getAllConsignment();
  }, []);

  // Fetch all consignment data
  const getAllConsignment = async () => {
    try {
      const res = await fetchAllConsignment();
      if (res) {
        console.log("Data fetched successfully");
        setKoiConsignmentData(res.data); // Set raw data
        setFilteredData(res.data); // Initialize filtered data
      }
    } catch (error) {
      console.error("Error fetching consignment data:", error);
    }
  };

  // Apply filtering based on consignment type and expiry date
  const applyFilters = useCallback(() => {
    let filtered = koiConsignmentData;

    // Filter by consignment type
    if (filterType !== "all") {
      filtered = filtered.filter((item) => item.consignmentType === filterType);
    }

    // Filter by expiry date
    if (expiryDateFilter) {
      filtered = filtered.filter((item) =>
        moment(item.dateExpiration).isSame(expiryDateFilter, "day")
      );
    }

    setFilteredData(filtered); // Update the filtered data
  }, [filterType, expiryDateFilter, koiConsignmentData]); // Add dependencies

  // Handle consignment type change
  const handleTypeChange = (value) => {
    setFilterType(value);
  };

  // Handle expiry date change
  const handleExpiryDateChange = (date) => {
    setExpiryDateFilter(date);
  };

  // Handle page change for pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  // Reapply filters whenever filter type or expiry date changes
  useEffect(() => {
    applyFilters();
  }, [filterType, expiryDateFilter, applyFilters]); // Add dependencies

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalItems = filteredData.length;

  return (
    <div className="admin">
      <div className="admin-sidebar">
        <AdminSideBar />
      </div>
      <div className="admin-content">
        <AdminHeader />
        <h1 className="content__title">Quản lý ký gửi</h1>

        {/* Filter section */}
        <div
          className="filter-container"
          style={{ display: "flex", gap: "20px", marginBottom: "20px" }}
        >
          <Select
            placeholder="Lọc theo hình thức"
            style={{ width: 200 }}
            onChange={handleTypeChange}
            defaultValue="all"
          >
            <Option value="all">Tất cả</Option>
            <Option value="Ký gửi để bán">Ký gửi để bán</Option>
            <Option value="chăm sóc">Chăm sóc</Option>
          </Select>

          <DatePicker
            placeholder="Lọc theo ngày đáo hạn"
            onChange={handleExpiryDateChange}
          />
        </div>

        {/* Consignment table */}
        <ConsignmentTable
          columns={columns}
          consignmentData={currentItems}
          onChange={getAllConsignment}
        />

        {/* Pagination */}
        <Pagination
          total={totalItems}
          current={currentPage}
          pageSize={itemsPerPage}
          onChange={handlePageChange}
          showSizeChanger={false}
          style={{ display: "flex", justifyContent: "center", marginTop: 20 }}
        />
      </div>
    </div>
  );
}

export default ManageConsignment;
