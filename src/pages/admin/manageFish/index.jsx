import { Select, Button } from "antd";
import AdminFilter from "../../../components/admin-components/admin-filter";
import AdminHeader from "../../../components/admin-components/admin-headers";
import AdminSideBar from "../../../components/admin-components/admin-sidebar";
import FishTable from "../../../components/admin-components/fish-table";
import EditFishModal from "./EditFishModal";
import AddFishModal from "./AddFishModal";
import "./index.scss";
import { fetchAllProduct } from "../../../service/userService";
import { useEffect, useState, useCallback } from "react";

const { Option } = Select;

const columns = [
  "Mã Sản Phẩm",
  "Giống Loài",
  "Kích Thước",
  "Giới Tính",
  "Giá",
  "Trạng thái",
  "Thao tác",
];

function ManageFish() {
  const [fishData, setFishData] = useState([]); // Dữ liệu gốc
  const [filteredFishData, setFilteredFishData] = useState([]); // Dữ liệu đã lọc
  const [filterType, setFilterType] = useState("all"); // Giống loài
  const [statusFilter, setStatusFilter] = useState("all"); // Trạng thái
  const [searchValue, setSearchValue] = useState(""); // Giá trị tìm kiếm
  const [sortOrder, setSortOrder] = useState(null); // Sắp xếp giá

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

      setFilteredFishData(filtered); // Cập nhật dữ liệu đã lọc
    },
    [searchValue, filterType, statusFilter, sortOrder]
  );

  const getAllProduct = useCallback(async () => {
    try {
      let res = await fetchAllProduct();
      if (res && res.data) {
        setFishData(res.data); // Cập nhật dữ liệu gốc
        applyFilters(res.data); // Áp dụng các bộ lọc ngay khi có dữ liệu
      }
    } catch (error) {
      console.log(error);
    }
  }, [applyFilters]);

  useEffect(() => {
    getAllProduct();
  }, [getAllProduct]);

  const handleSearch = (value) => {
    setSearchValue(value);
    applyFilters(fishData);
  };

  const handleBreedFilter = (value) => {
    setFilterType(value);
    applyFilters(fishData);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    applyFilters(fishData);
  };

  const handlePriceFilter = (order) => {
    setSortOrder(order);
    applyFilters(fishData);
  };

  const handleDataChange = () => {
    getAllProduct();
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
            <Option value="Koi">Koi</Option>
            <Option value="Betta">Betta</Option>
            <Option value="Goldfish">Goldfish</Option>
          </Select>

          <Select
            placeholder="Lọc theo trạng thái"
            style={{ width: 200, marginRight: 10 }}
            onChange={handleStatusFilter}
          >
            <Option value="all">Tất cả</Option>
            <Option value="Còn hàng">Còn hàng</Option>
            <Option value="Hết hàng">Hết hàng</Option>
          </Select>

          {/* Nút giá tăng dần và giảm dần với class active */}
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
          fishData={filteredFishData}
          columns={columns}
          title="Quản lý giống cá"
          ModalComponent={EditFishModal}
          onChange={handleDataChange}
        />
      </div>
    </div>
  );
}

export default ManageFish;
