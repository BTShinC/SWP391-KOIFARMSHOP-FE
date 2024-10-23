import { useEffect, useState } from "react";
import AdminHeader from "../../../components/admin-components/admin-headers";
import AdminSideBar from "../../../components/admin-components/admin-sidebar";
import ConsignmentTable from "./Consignment-table";
import { fetchAllConsignment } from "../../../service/userService";
import { Pagination } from "@mui/material";

const columns = [
  "Mã ký gửi",
  "Ngày tạo đơn",
  "Ngày nhận cá",
  "Ngày đáo hạn",
  "Ngày hoàn tất",
  "Mã sản phẩm",
  "Lợi nhuận đơn",
  "Đơn ký gửi loại",
  "Trạng thái đơn ký gửi",
  "Thao tác",
];

function ManageConsignment() {
  const [koiConsignmentData, setKoiConsignmentData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    getAllConsignment();
  }, []);

  const getAllConsignment = async () => {
    try {
      let res = await fetchAllConsignment();
      if (res) {
        console.log("Thành công");
        setKoiConsignmentData(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnchange = () => {
    getAllConsignment();
  };

  // Tính toán chỉ số bắt đầu và kết thúc của dữ liệu trong trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = koiConsignmentData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(koiConsignmentData.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="admin">
      <div className="admin-sidebar">
        <AdminSideBar />
      </div>
      <div className="admin-content">
        <AdminHeader />
        <h1 className="content__title">Trang quản lý</h1>
        <ConsignmentTable
          columns={columns}
          consignmentData={currentItems} 
          onChange={handleOnchange}
        />
        
        <Pagination
          count={totalPages} 
          page={currentPage} 
          onChange={handlePageChange}
          color="primary"
          sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }} 
        />
      </div>
    </div>
  );
}

export default ManageConsignment;
