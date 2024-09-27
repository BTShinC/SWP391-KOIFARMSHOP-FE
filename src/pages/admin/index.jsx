import "./admin.scss";

import SideBar from "../../components/sidebar";


import AdminHeader from "../../components/admin-components/admin-headers";
import AdminFilter from "../../components/admin-components/admin-filter";
import AdminTable from "../../components/admin-components/admin-table";

const handleSearch = (value) => {
  console.log(value);
};
const userData = [
  {
    name: "Francisco Chang",
    email: "chang@example.com",
    phone: "123456789",
    address: "Mexico",
    balance: "1000"
  },
];

const columns = ["Họ và tên", "Email", "Số điện thoại", "Địa chỉ", "Số dư ví", "Thao tác"];
const Admin = () => {
  return (
    <div className="admin">
      <SideBar/>
      <div className="content">
        <AdminHeader/>
        <h1 className="content__title">Trang quản lý</h1>
        <AdminFilter onSearch={handleSearch} buttonText="Thêm mới người dùng" />
        <AdminTable data={userData} columns={columns} title="Hồ sơ khách hàng" />
      </div>
    </div>
  );
};

export default Admin;
