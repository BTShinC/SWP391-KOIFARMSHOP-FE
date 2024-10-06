import AdminFilter from "../../../components/admin-components/admin-filter";
import AdminHeader from "../../../components/admin-components/admin-headers";
import AdminSideBar from "../../../components/admin-components/admin-sidebar";
import FishTable from "../../../components/admin-components/fish-table";
import AddFishModal from "./addfish-modal";
import { useState } from "react";
import "./index.scss";

const handleSearch = (value) => {
  console.log(value);
};

const fishData = [
  {
    productID: 1,
    breed: "Kohaku",
    size: "30cm",
    sex: "Đực",
    healthStatus: "Khỏe mạnh",
    personalityTrait: "Hiền lành",
    origin: "Nhật Bản",
    description: "Màu đỏ tươi và trắng nổi bật",
    image: "kohaku.jpg",
    price: "1500",
    certificate: "Có",
    type: "Trang trại",
    quality: "Cao",
    status: "Hết hàng",
    koiConsignmentID: 101,
  },
  {
    productID: 2,
    breed: "Sanke",
    size: "40cm",
    sex: "Cái",
    healthStatus: "Khỏe mạnh",
    personalityTrait: "Năng động",
    origin: "Nhật Bản",
    description: "Màu đỏ, đen và trắng đặc trưng",
    image: "sanke.jpg",
    price: "2000",
    certificate: "Không",
    type: "Ký gửi",
    quality: "Trung bình",
    status: "Còn hàng",
    koiConsignmentID: 102,
  }
];

const columns = [
  "Mã Sản Phẩm",
  "Giống Loài",
  "Kích Thước",
  "Giới Tính",
  "Giá",
  "Chất Lượng",
  "Trạng thái",
  "Thao tác"
];

function ManageFish() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="manage-fish">
      <div className="admin-sidebar">
        <AdminSideBar />
      </div>
      <div className="admin-content">
        <AdminHeader />
        <h1 className="admin-content__title">Trang quản lý</h1>
        <AdminFilter onSearch={handleSearch} buttonText="Thêm cá Koi" />
        <button onClick={showModal} className="add-fish-button">Thêm cá</button>
        <FishTable fishData={fishData} columns={columns} title="Quản lý giống cá" />
        <AddFishModal title="Thêm cá Koi" visible={isModalVisible} onClose={handleModalClose} />
      </div>
    </div>
  );
}

export default ManageFish;
