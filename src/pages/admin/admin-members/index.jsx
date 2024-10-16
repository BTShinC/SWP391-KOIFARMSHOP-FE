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
function AdminMembers() {
  useEffect(() => {
    getAllUser();
  }, []);
  const [userData, setUserData] = useState([]);
  const getAllUser = async () => {
    try {
      let res = await fetchAllUser();
      if (res && res.data) {
        console.log(res);
        const customers = res.data.filter(
          (user) => user.roleName === "Admin"
        );
        setUserData(customers);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (value) => {
    if (value.trim() === "") {
      getAllUser();
    } else {
      // Lọc người dùng dựa trên tên
      const filtered = userData.filter((user) =>
        user.fullName.toLowerCase().includes(value.toLowerCase())
      );
      setUserData(filtered);
    }
  };

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
          data={userData}
          title="Thành viên"
          ModalComponent={ModalEditUser}
        />
      </div>
    </div>
  );
}
export default AdminMembers;
