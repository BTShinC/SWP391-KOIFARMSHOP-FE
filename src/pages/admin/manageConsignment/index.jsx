import { useEffect, useState } from "react";
import AdminHeader from "../../../components/admin-components/admin-headers";
import AdminSideBar from "../../../components/admin-components/admin-sidebar";
import ConsignmentTable from "./Consignment-table";
import { fetchAllConsignment } from "../../../service/userService";
import { Pagination, Select } from "antd";

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
  const [koiConsignmentData, setKoiConsignmentData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Lấy tất cả dữ liệu ký gửi khi component được mount
  useEffect(() => {
    getAllConsignment();
  }, []);

  // Hàm lấy tất cả dữ liệu ký gửi
  const getAllConsignment = async () => {
    try {
      const res = await fetchAllConsignment();
      if (res) {
        console.log("Lấy dữ liệu thành công");

        const statusOrder = [
          "Chưa xác nhận",
          "Chưa hoàn tiền",
          "Đang tiến hành",
          "Đang chăm sóc",
          "Hoàn tất",
          "Đã hủy",
        ];

        const sortedData = res.data.sort((a, b) => {
          // So sánh theo status trước
          const statusComparison =
            statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);

          // Nếu status khác nhau, sắp xếp theo status; nếu giống nhau, sắp xếp theo ngày đặt từ gần nhất đến xa nhất
          if (statusComparison !== 0) {
            return statusComparison;
          }

          // Sắp xếp theo ngày đặt (orderDate) giảm dần
          const dateA = new Date(a.consignmentDate);
          const dateB = new Date(b.consignmentDate);
          return dateB - dateA; // Ngày gần nhất sẽ đứng trước
        });

        setKoiConsignmentData(sortedData);
        setFilteredData(sortedData);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu ký gửi:", error);
    }
  };

  // Áp dụng bộ lọc mỗi khi filterType hoặc statusFilter thay đổi
  useEffect(() => {
    let filtered = koiConsignmentData;

    // Lọc theo loại ký gửi
    if (filterType !== "all") {
      filtered = filtered.filter((item) => item.consignmentType === filterType);
    }

    // Lọc theo trạng thái
    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    setFilteredData(filtered);
  }, [filterType, statusFilter, koiConsignmentData]);

  // Xử lý khi thay đổi loại ký gửi
  const handleTypeChange = (value) => {
    setFilterType(value);
    setStatusFilter("all");
  };

  // Xử lý khi thay đổi trạng thái
  const handleStatusChange = (value) => {
    setStatusFilter(value);
  };

  // Xử lý thay đổi trang cho phân trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalItems = filteredData.length;

  // Danh sách trạng thái động dựa trên loại ký gửi
  const statusOptions =
    filterType === "Ký gửi để bán"
      ? [
          { value: "Đang tiến hành", label: "Đang tiến hành" },
          { value: "Chưa hoàn tiền ", label: "Chưa hoàn tiền " },
          { value: "Hoàn tất ", label: "Hoàn tất" },
        ]
      : [
          { value: "Chờ xác nhận", label: "Chờ xác nhận" },
          { value: "Đang chăm sóc", label: "Đang chăm sóc" },
          { value: "Hoàn tất", label: "Hoàn tất" },
          { value: "Đã hủy", label: "Đã hủy" },
        ];

  return (
    <div className="admin">
      <div className="admin-sidebar">
        <AdminSideBar />
      </div>
      <div className="admin-content">
        <AdminHeader />
        <h1 className="content__title">Quản lý ký gửi</h1>

        {/* Phần lọc */}
        <div
          className="filter-container"
          style={{ display: "flex", gap: "20px", marginBottom: "20px" }}
        >
          {/* Lọc theo loại ký gửi */}
          <Select
            placeholder="Lọc theo hình thức"
            style={{ width: 200 }}
            onChange={handleTypeChange}
            defaultValue="all"
          >
            <Option value="all">Tất cả</Option>
            <Option value="Ký gửi để bán">Ký gửi để bán</Option>
            <Option value="Ký gửi chăm sóc">Ký gửi chăm sóc</Option>
          </Select>

          {/* Lọc theo trạng thái - thay đổi dựa trên loại ký gửi */}
          <Select
            placeholder="Lọc theo trạng thái"
            style={{ width: 200 }}
            onChange={handleStatusChange}
            value={statusFilter}
            defaultValue="all"
          >
            <Option value="all">Tất cả</Option>
            {statusOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </div>

        {/* Bảng ký gửi */}
        <ConsignmentTable
          columns={columns}
          consignmentData={currentItems}
          onChange={getAllConsignment}
        />

        {/* Phân trang */}
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
