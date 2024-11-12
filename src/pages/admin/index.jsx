import "./admin.scss";
import AdminHeader from "../../components/admin-components/admin-headers";
import AdminSideBar from "/src/components/admin-components/admin-sidebar";
import AdminFilter from "../../components/admin-components/admin-filter";
import AdminTable from "../../components/admin-components/admin-table";
import ModalEditUser from "/src/pages/userinfo/EditUserModal/index";
import { useEffect, useState } from "react";
import { fetchAllUser } from "../../service/userService";

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

const Admin = () => {
  // State lưu trữ dữ liệu người dùng
  const [userData, setUserData] = useState([]);
  // State lưu trữ dữ liệu người dùng đã lọc
  const [filteredUserData, setFilteredUserData] = useState([]);

  // Hàm gọi API lấy toàn bộ dữ liệu người dùng
  const getAllUser = async () => {
    try {
      let res = await fetchAllUser();
      if (res && res.data) {
        const customers = res.data.filter(
          (user) => user.roleName === "Customer"
        );
        setUserData(customers);
        setFilteredUserData(customers);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Hàm xử lý tiếng việt
  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  // Hàm search theo tên người dùng
  const handleSearch = (value) => {
    if (value.trim() === "") {
      setFilteredUserData(userData);
    } else {
      const normalizedValue = removeAccents(value.toLowerCase());
      const filtered = userData.filter((user) => {
        const normalizedName = removeAccents(user.fullName.toLowerCase());
        return normalizedName.includes(normalizedValue);
      });
      setFilteredUserData(filtered);
    }
  };

  // Hàm render lại dữ liệu khi có thay đổi thông tin người dùng
  const handleUserChange = (data) => {
    console.log(data)
    getAllUser(); 
  };

  useEffect(() => {
    getAllUser();
  }, []);

  return (
    <div className="admin">
      <div className="admin-sidebar">
        <AdminSideBar />
      </div>
      <div className="admin-content">
        <AdminHeader />
        <h1 className="content__title">Trang quản lý</h1>
        <AdminFilter onSearch={handleSearch}/>
        <AdminTable
          data={filteredUserData}
          columns={columns}
          title="Hồ sơ khách hàng"
          ModalComponent={ModalEditUser}
          onChange={handleUserChange}
        />
      </div>
    </div>
  );
};

export default Admin;
