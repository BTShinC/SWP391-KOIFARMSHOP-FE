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
  "Số dư ví",
  "Thao tác",
];

const Admin = () => {
  // State lưu trữ dữ liệu người dùng
  const [userData, setUserData] = useState([]);
  // State lưu trữ dữ liệu người dùng đã lọc
  const [filteredUserData, setFilteredUserData] = useState([]);
  //Hàm render ra mỗi khi chạy page
  useEffect(() => {
    // Gọi API lấy toàn bộ dữ liệu người dùng
    getAllUser();
  }, []);
  //Gọi api lấy dữ liệu người dùng
  const getAllUser = async () => {
    try {
      let res = await fetchAllUser();
      if (res && res.data) {
        console.log(res);
        // Lọc ra những người dùng có role là "Customer"
        const customers = res.data.filter(
          (user) => user.roleName === "Customer"
        );
        setUserData(customers); // Cập nhật dữ liệu gốc
        setFilteredUserData(customers); // Cập nhật dữ liệu lọc ban đầu
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
  return (
    <div className="admin">
      <div className="admin-sidebar">
        <AdminSideBar />
      </div>
      <div className="admin-content">
        <AdminHeader />
        <h1 className="content__title">Trang quản lý</h1>
        {/* Component lọc và tìm kiếm */}
        <AdminFilter onSearch={handleSearch} buttonText="Thêm mới người dùng" />
        {/* Bảng hiển thị danh sách người dùng */}
        <AdminTable
          data={filteredUserData} // Truyền dữ liệu người dùng đã lọc vào bảng
          columns={columns}
          title="Hồ sơ khách hàng"
          ModalComponent={ModalEditUser} // Modal chỉnh sửa thông tin người dùng
        />
      </div>
    </div>
  );
};

export default Admin;
