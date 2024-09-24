import "./admin.scss";
import AdminHeader from "../../components/admin-headers";
import SideBar from "../../components/sidebar";
import AdminFilter from "../../components/admin-filter";
import AdminTable from "../../components/admin-table";

const handleSearch = (value) => {
  console.log(value);
};
const fishData = [
  {
    name: "Francisco Chang",
    email: "chang@example.com",
    phone: "123456789",
    address: "Mexico",
    balance: "1000"
  },
];

const columns = [""];
const Admin = () => {
  return (
    <div className="admin">
      <SideBar/>
      <div className="content">
        <AdminHeader/>
        <h1 className="content__title">Trang quản lý</h1>
        <AdminFilter onSearch={handleSearch} buttonText="Thêm mới người dùng" />
        <AdminTable data={fishData} columns={columns} title="Hồ sơ khách hàng" />
      </div>
    </div>
  );
};

export default Admin;
