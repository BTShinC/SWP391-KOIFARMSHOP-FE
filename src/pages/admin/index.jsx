import "./admin.scss";
import AdminHeader from "../../components/admin-components/admin-headers";
import AdminSideBar from "/src/components/admin-components/admin-sidebar";
import AdminFilter from "../../components/admin-components/admin-filter";
import AdminTable from "../../components/admin-components/admin-table";
import ModalEditUser from "/src/pages/userinfo/EditUserModal/index";
import { useEffect, useState } from "react";
import { fetchAllUser } from "../../service/userService";
const handleSearch = (value) => {
  console.log(value);
};

const columns = [
  "Mã khách hàng",

  "Họ và tên",
  "Địa chỉ",
  "Email",
  "Số điện thoại",
  "Số dư ví",
  "Thao tác",
];
const Admin = () => {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    getAllUser();
  }, []);

  const getAllUser = async () => {
    try {
      let res = await fetchAllUser();
      if (res && res.data) {
        console.log(res);
        setUserData(res.data); // Cập nhật với dữ liệu từ phản hồi
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  console.log(userData);
  return (
    <div className="admin">
      <div className="admin-sidebar">
        <AdminSideBar />
      </div>

      <div className="admin-content">
        <AdminHeader />
        <h1 className="content__title">Trang quản lý</h1>
        <AdminFilter onSearch={handleSearch} buttonText="Thêm mới người dùng" />
        <AdminTable
          data={userData}
          columns={columns}
          title="Hồ sơ khách hàng"
          ModalComponent={ModalEditUser} // Truyền ModalEditUser vào đây
        />
      </div>
    </div>
  );
};

export default Admin;
