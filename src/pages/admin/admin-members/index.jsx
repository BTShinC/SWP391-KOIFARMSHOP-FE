
import AdminFilter from "../../../components/admin-components/admin-filter";
import AdminHeader from "../../../components/admin-components/admin-headers";
import AdminSideBar from "../../../components/admin-components/admin-sidebar";
import AdminTable from "/src/components/admin-components/admin-table/index";
AdminMembers.propTypes = {};
const users = [
  {
    accountID: 1,
    fullName: "John Doe",
    email: "john.doe@example.com",
    phoneNumber: "123-456-7890",
    address: "123 Main Street, New York, USA",
    roleID: 1, // Giả sử 1 là 'admin'
    accountBalance: 5000.0,
  },
  {
    accountID: 2,
    fullName: "Jane Smith",
    email: "jane.smith@example.com",
    phoneNumber: "987-654-3210",
    address: "456 Maple Avenue, Los Angeles, USA",
    roleID: 2, // Giả sử 2 là 'user'
    accountBalance: 3000.0,
  },
  {
    accountID: 3,
    fullName: "Alice Johnson",
    email: "alice.johnson@example.com",
    phoneNumber: "555-123-4567",
    address: "789 Oak Street, Chicago, USA",
    roleID: 1, // Giả sử 1 là 'admin'
    accountBalance: 7500.0,
  },
  {
    accountID: 4,
    userName: "bob_brown",
    password: "bobSecret!",
    fullName: "Bob Brown",
    address: "321 Pine Road, Houston, USA",
    email: "bob.brown@example.com",
    phoneNumber: "111-222-3333",
    roleID: 2, // Giả sử 2 là 'user'
    accountBalance: 1200.0,
  },
  {
    accountID: 5,
    fullName: "Linda White",
    email: "linda.white@example.com",
    phoneNumber: "444-555-6666",
    address: "987 Cedar Avenue, Miami, USA",
    roleID: 3, // Giả sử 3 là 'manager'
    accountBalance: 6200.0,
  },
];
const columns = [
  "Mã khách hàng",
  "Họ và tên",
  "Email",
  "Số điện thoại",
  "Địa chỉ",
  "Role",
  "Số dư ví",
];
const handleSearch = (value) => {
  console.log(value);
};

function AdminMembers() {
  const adminUsers = users
    .filter((user) => user.roleID === 1)
    .map((user) => ({
      ...user, // Sao chép tất cả các thuộc tính của user
      roleID: "Admin", // Thay đổi giá trị roleID thành "admin"
    }));

  return (
    <div className="admin">
      <div className="admin-sidebar">
        <AdminSideBar />
      </div>
      <div className="admin-content">
        <AdminHeader />
        <h1 className="content__title">Trang quản lý</h1>
        <AdminFilter onSearch={handleSearch} />
        <AdminTable columns={columns} data={adminUsers} title="Thành viên" />
      </div>
    </div>
  );
}
export default AdminMembers;
