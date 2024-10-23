import { useEffect, useState } from "react";
import AdminHeader from "../../../components/admin-components/admin-headers";
import AdminSideBar from "../../../components/admin-components/admin-sidebar";
import ConsignmentTable from "./Consignment-table";
import { fetchAllConsignment } from "../../../service/userService";

const columns = [
  "Mã ký gửi",
  "Ngày tạo đơn",
  "Ngày nhận cá",
  "Ngày đáo hạn",
  "Ngày hoàn tất",
  "Mã sản phẩm",
  "Khách hàng",
  "Đơn ký gửi loại",
  "Trạng thái đơn ký gửi",
  "Thao tác",
];

function ManageConsignment() {
  const [koiConsignmentData, setKoiConsignmentData] = useState([]);

  useEffect(() => {
    // Gọi API chỉ một lần khi component mount
    getAllConsignment();
  }, []); // Thêm dependency array rỗng để chỉ gọi một lần

  const getAllConsignment = async () => {
    try {
      let res = await fetchAllConsignment();
      if (res) {
        console.log("Thành công");
        setKoiConsignmentData(res.data); // Lưu dữ liệu vào state
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnchange = () => {
    getAllConsignment();
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
          consignmentData={koiConsignmentData}
          onChange={handleOnchange}
        />
      </div>
    </div>
  );
}

export default ManageConsignment;
