
import AdminHeader from "../../../components/admin-components/admin-headers";
import AdminSideBar from "../../../components/admin-components/admin-sidebar";
import OrderTable from "../../../components/admin-components/order-table";
const orderData = [
  {
    orderId: "DH001",
    customerId: "KH001",
    totalAmount: "1,500,000 VND",
    orderDate: "2024-09-27",
    status: "Đang chuẩn bị",
  },
  {
    orderId: "DH002",
    customerId: "KH002",
    totalAmount: "2,000,000 VND",
    orderDate: "2024-09-28",
    status: "Đang vận chuyển",
  },
  {
    orderId: "DH003",
    customerId: "KH003",
    totalAmount: "500,000 VND",
    orderDate: "2024-09-29",
    status: "Đã hủy",
  },
  {
    orderId: "DH004",
    customerId: "KH004",
    totalAmount: "1,200,000 VND",
    orderDate: "2024-09-30",
    status: "Chờ xác nhận",
  }
];

const detailData = [
  {
    orderdetailid: 'OD001',
    productid: 'P001',
    orderID: 'DH001', // Liên kết với đơn hàng "DH001"
    productComboID: 'C001',
  },
  {
    orderdetailid: 'OD002',
    productid: 'P002',
    orderID: 'DH001', // Liên kết với đơn hàng "DH001"
    productComboID: 'C002',
  },
  {
    orderdetailid: 'OD003',
    productid: 'P003',
    orderID: 'DH002', // Liên kết với đơn hàng "DH002"
    productComboID: 'C003',
  },
  {
    orderdetailid: 'OD004',
    productid: 'P004',
    orderID: 'DH003', // Liên kết với đơn hàng "DH003"
    productComboID: 'C004',
  },
  {
    orderdetailid: 'OD005',
    productid: 'P005',
    orderID: 'DH004', // Liên kết với đơn hàng "DH004"
    productComboID: 'C005',
  },
  {
    orderdetailid: 'OD006',
    productid: 'P006',
    orderID: 'DH004', // Liên kết với đơn hàng "DH004"
    productComboID: 'C006',
  }
];
const columns = [
  "Mã đơn hàng",
  "Mã khách hàng",
  "Tổng tiền ",
  "Ngày đặt",
  "Trạng thái",
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
        <OrderTable
          orderData={orderData}
          columns={columns}
          title="Quản lý đơn hàng"
          detailData={detailData}
        />
      </div>
    </div>
  );
};

export default ManageOrder;
