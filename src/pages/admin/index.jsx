import "./admin.scss";
import AdminHeader from "../../components/admin-components/admin-headers";
import AdminSideBar from "/src/components/admin-components/admin-sidebar";
import AdminFilter from "../../components/admin-components/admin-filter";
import AdminTable from "../../components/admin-components/admin-table";
const handleSearch = (value) => {
  console.log(value);
};
const userData = [
  {
    id: "1",
    fullName: "Francisco Chang",
    email: "chang@example.com",
    phoneNumber: "123456789",
    address: "Mexico",
    balance: "1000",
  },
  {
    id: "2",
    fullName: "Maria Anders",
    email: "maria.anders@example.com",
    phoneNumber: "987654321",
    address: "Germany",
    balance: "1500",
  },
  {
    id: "3",
    fullName: "John Smith",
    email: "john.smith@example.com",
    phoneNumber: "555123456",
    address: "USA",
    balance: "2000",
  },
];

const columns = [
  "Mã khách hàng",
  "Họ và tên",
  "Email",
  "Số điện thoại",
  "Địa chỉ",
  "Số dư ví",
  "Thao tác",
];
const Admin = () => {
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
        />
      </div>
    </div>
  );
};

export default Admin;
