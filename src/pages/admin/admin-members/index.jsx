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
  "Địa chỉ",
  "Email",
  "Số điện thoại",
  "Vai trò",
  "Số dư ví",
  "Thao tác",
];

function AdminMembers() {
  const [userData, setUserData] = useState([]);
  
  useEffect(() => {
    getAllUser();
  }, []);

  // Fetch all users
  const getAllUser = async () => {
    try {
      let res = await fetchAllUser();
      if (res && res.data) {
        const customers = res.data
          .filter((user) => user.roleName !== "Customer")
          .sort((a, b) => {
            if (a.roleName === "Staff" && b.roleName === "Admin") return 1;
            if (a.roleName === "Admin" && b.roleName === "Staff") return -1;
            return 0;
          });
        setUserData(customers);
      }
    } catch (error) {
      console.log(error);
    }
  };


  // Search users by name
  const handleSearch = (value) => {
    if (value.trim() === "") {
      getAllUser();
    } else {
      const filtered = userData.filter((user) =>
        user.fullName.toLowerCase().includes(value.toLowerCase())
      );
      setUserData(filtered);
    }
  };

  // Refresh the user data after editing
  const handleUserChange = () => {
    getAllUser(); // Re-fetch the user data after editing
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
          onChange={handleUserChange}
        />
      </div>
    </div>
  );
}

export default AdminMembers;
