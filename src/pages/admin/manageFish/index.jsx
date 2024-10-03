import AdminFilter from "../../../components/admin-components/admin-filter";
import AdminHeader from "../../../components/admin-components/admin-headers";
import AdminSideBar from "../../../components/admin-components/admin-sidebar";
import FishTable from "../../../components/admin-components/fish-table";
import EditFishModal from "./EditFishModal";
import AddFishModal from "./AddFishModal"
import "./index.scss";
import { fetchAllProduct } from "../../../service/userService";
import { useEffect, useState } from "react";
const handleSearch = (value) => {
  console.log(value);
};

// const fishData1= [
//   {
//     productID: 2,
//     imageUrl:"https://firebasestorage.googleapis.com/v0/b/fir-221c7.appspot.com/o/uploads%2Fcakoi1.webp?alt=media&token=7f22e22c-9fdc-4db6-b36e-2aeee3ee8b54",
//     certificateUrl:"https://firebasestorage.googleapis.com/v0/b/fir-221c7.appspot.com/o/uploads%2Fcertificates%2Fcakoi2.webp?alt=media&token=427e2d66-8726-4292-95a5-ad0117ed69a0",
//     breed: "Sanke",
//     size: "40cm",
//     sex: "Cái",
//     healthStatus: "Khỏe mạnh",
//     personalityTrait: "Năng động",
//     origin: "Nhật Bản",
//     description: "Màu đỏ, đen và trắng đặc trưng",
//     image: "sanke.jpg",
//     price: "2000",
//     certificate: "Không",
//     type: "Ký gửi",
//     quality: "Trung bình",
//     consignmentType: 'true',
//     status: "Còn hàng",
//     koiConsignmentID: 102,
//   }
// ];

const columns = [
  "Mã Sản Phẩm",
  "Giống Loài",
  "Kích Thước",
  "Giới Tính",
  "Giá",
  "Trạng thái",
  "Thao tác"
];


function ManageFish() {
  const [fishData, setFishData] = useState([]);

  useEffect (() => {
    getAllProduct();
  }, []);

  const getAllProduct = async () => {
    try {
      let res = await fetchAllProduct();
      if (res && res.data) {
        console.log(res);
        setFishData(res.data); // Cập nhật với dữ liệu từ phản hồi
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDataChange =() =>{
    getAllProduct();
  }

  return (
    <div className="manage-fish">
      <div className="admin-sidebar">
        <AdminSideBar />
      </div>
      <div className="admin-content">
        <AdminHeader />
        <h1 className="admin-content__title">Trang quản lý</h1>
        <AdminFilter onSearch={handleSearch} ModalComponent={AddFishModal} onChange={handleDataChange}  />
        <FishTable fishData={fishData} columns={columns} title="Quản lý giống cá" ModalComponent={EditFishModal}  onChange={handleDataChange}/>
      </div>
    </div>
  );
}

export default ManageFish;
