import AdminFilter from "../../../components/admin-components/admin-filter";
import AdminHeader from "../../../components/admin-components/admin-headers";
import AdminSideBar from "../../../components/admin-components/admin-sidebar";
import AdminTable from "../../../components/admin-components/admin-table";

const handleSearch = (value) => {
  console.log(value);
};
const orderData = [
  {
    id: "1",
    fullName: "Francisco Chang",
    email: "chang@example.com",
    phoneNumber: "123456789",
    address: "Mexico",
  },
];

const columns = [
  "Mã đơn hàng",
  "Mã khách hàng",
  "Trạng thái",
  "Tổng tiền ",
  "Ngày đặt",
  "Thao tác",
];
const ManageOrder = () => {
  return (
    <div className="admin">
      <div className="admin-sidebar">
        <AdminSideBar />
      </div>

      <div className="admin-content">
        <AdminHeader />
        <h1 className="content__title">Trang quản lý</h1>
        <AdminFilter onSearch={handleSearch} buttonText="Thêm mới đơn hàng" />
        <AdminTable
          data={orderData}
          columns={columns}
          title="Quản lý đơn hàng"
        />
      </div>
    </div>
  );
};

export default ManageOrder;
