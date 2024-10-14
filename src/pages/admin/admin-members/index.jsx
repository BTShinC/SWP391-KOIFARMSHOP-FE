import { useEffect, useState } from "react";
import AdminFilter from "../../../components/admin-components/admin-filter";
import AdminHeader from "../../../components/admin-components/admin-headers";
import AdminSideBar from "../../../components/admin-components/admin-sidebar";
import AdminTable from "/src/components/admin-components/admin-table/index";
import { fetchAllUser } from "../../../service/userService";
import ModalEditUser from "/src/pages/userinfo/EditUserModal/index";
AdminMembers.propTypes = {};

const columns = [
  "Mã khách hàng",
  "Họ và tên",
  "Email",
  "Số điện thoại",
  "Địa chỉ",
  "Số dư ví",
  "Thao tác",
];
const handleSearch = (value) => {
  console.log(value);
};

function AdminMembers() {
  useEffect(() => {
    getUser();
  }, []);
  const [userData, setUserData] = useState([]);
  const getUser = async () => {
    try {
      let res = await fetchAllUser();
      console.log(res);
      if (res) {
        setUserData(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const adminUsers = userData.filter((user) => user.roleName === "Admin");

  return (
    <div className="admin">
      <div className="admin-sidebar">
        <AdminSideBar />
      </div>
      <div className="admin-content">
        <AdminHeader />
        <h1 className="content__title">Trang quản lý</h1>
        <AdminFilter onSearch={handleSearch} />
        <AdminTable
          columns={columns}
          data={adminUsers}
          title="Thành viên"
          ModalComponent={ModalEditUser}
        />
      </div>
    </div>
  );
}
export default AdminMembers;
