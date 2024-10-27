import { useState, useEffect, useCallback } from "react";
import { Select, Button } from "antd";
import AdminFilter from "../../../components/admin-components/admin-filter";
import AdminHeader from "../../../components/admin-components/admin-headers";
import AdminSideBar from "../../../components/admin-components/admin-sidebar";
import FishTable from "../../../components/admin-components/fish-table";
import EditFishModal from "./EditFishModal";
import AddFishModal from "./AddFishModal";
import { Pagination } from "@mui/material";
import {
  fetchAllProduct,
  fetchAllConsignment,
} from "../../../service/userService";
import "./index.scss";

const { Option } = Select;

const columns = [
  "Mã Sản Phẩm",
  "Giống Loài",
  "Kích Thước",
  "Hình thức",
  "Giá",
  "Trạng thái",
  "Thao tác",
];

function ManageFish() {
  const [fishData, setFishData] = useState([]);
  const [filteredFishData, setFilteredFishData] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [sortOrder, setSortOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [consignmentData, setConsignmentData] = useState([]); // Thêm consignmentData

  // Gọi API để lấy consignmentData
  const getConsignmentData = useCallback(async () => {
    try {
      const res = await fetchAllConsignment();
      if (res && res.data) {
        setConsignmentData(res.data);
      }
    } catch (error) {
      console.log("Lỗi khi lấy consignmentData:", error);
    }
  }, []);

  const applyFilters = useCallback(
    (data) => {
      let filtered = data;

      // Lọc theo mã sản phẩm
      if (searchValue.trim() !== "") {
        filtered = filtered.filter((fish) =>
          fish.productID.toLowerCase().includes(searchValue.toLowerCase())
        );
      }

      // Lọc theo giống loài
      if (filterType !== "all") {
        filtered = filtered.filter((fish) =>
          fish.breed.toLowerCase().includes(filterType.toLowerCase())
        );
      }

      // Lọc theo trạng thái
      if (statusFilter !== "all") {
        filtered = filtered.filter(
          (fish) => fish.status.toLowerCase() === statusFilter.toLowerCase()
        );
      }

      // Sắp xếp theo giá
      if (sortOrder) {
        filtered = [...filtered].sort((a, b) => {
          return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
        });
      }

      setFilteredFishData(filtered);
    },
    [searchValue, filterType, statusFilter, sortOrder]
  );
  useEffect(() => {
    applyFilters(fishData);
  }, [
    fishData,
    searchValue,
    filterType,
    statusFilter,
    sortOrder,
    applyFilters,
  ]);

  const getAllProduct = useCallback(async () => {
    try {
      let res = await fetchAllProduct();
      if (res && res.data) {
        setFishData(res.data);
        applyFilters(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, [applyFilters]);

  useEffect(() => {
    getAllProduct();
    getConsignmentData();
  }, [getAllProduct, getConsignmentData]);

  const handleSearch = (value) => {
    setSearchValue(value);
  };

  const handleBreedFilter = (value) => {
    setFilterType(value);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
  };

  const handlePriceFilter = (order) => {
    setSortOrder(order);
  };

  const handleDataChange = () => {
    getAllProduct();
  };

  const paginatedData = useCallback(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredFishData.slice(startIndex, endIndex);
  }, [filteredFishData, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="manage-fish">
      <div className="admin-sidebar">
        <AdminSideBar />
      </div>
      <div className="admin-content">
        <AdminHeader />
        <h1 className="admin-content__title">Trang quản lý</h1>
        <AdminFilter
          onSearch={handleSearch}
          ModalComponent={AddFishModal}
          onChange={handleDataChange}
        />

        <div className="filter-container">
          <Select
            placeholder="Lọc theo giống loài"
            style={{ width: 200, marginRight: 10 }}
            onChange={handleBreedFilter}
          >
            <Option value="all">Tất cả</Option>
            <Option value="Kohaku">Kohaku</Option>
            <Option value="Showa">Showa</Option>
            <Option value="Snake">Snake</Option>
            <Option value="Tancho">Tancho</Option>
            <Option value="Karashi">Karashi</Option>
          </Select>

          <Select
            placeholder="Lọc theo trạng thái"
            style={{ width: 200, marginRight: 10 }}
            onChange={handleStatusFilter}
          >
            <Option value="all">Tất cả</Option>
            <Option value="Chờ xác nhận">Chờ xác nhận</Option>
            <Option value="Đang chăm sóc">Đang chăm sóc</Option>
            <Option value="Hoàn tất chăm sóc">Hoàn tất chăm sóc</Option>
            <Option value="Còn hàng">Còn hàng</Option>
            <Option value="Hết hàng">Hết hàng</Option>
          </Select>

          <Button
            className={
              sortOrder === "asc" ? "button-active" : "button-inactive"
            }
            onClick={() => handlePriceFilter("asc")}
          >
            Giá tăng dần
          </Button>
          <Button
            className={
              sortOrder === "desc" ? "button-active" : "button-inactive"
            }
            onClick={() => handlePriceFilter("desc")}
            style={{ marginLeft: 10 }}
          >
            Giá giảm dần
          </Button>
        </div>

        <FishTable
          fishData={paginatedData()} // Dữ liệu đã phân trang
          columns={columns}
          title="Quản lý giống cá"
          ModalComponent={EditFishModal}
          onChange={handleDataChange}
          consignmentData={consignmentData} // Truyền consignmentData vào FishTable
        />

        {/* Phân trang */}
        <Pagination
          count={Math.ceil(filteredFishData.length / itemsPerPage)}
          page={currentPage}
          onChange={(event, value) => handlePageChange(value)}
          color="primary"
          style={{ textAlign: "center", marginTop: "20px" }}
        />
      </div>
    </div>
  );
}

export default ManageFish;
