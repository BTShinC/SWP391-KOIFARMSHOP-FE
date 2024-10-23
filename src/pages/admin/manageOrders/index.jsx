import { Select, DatePicker } from "antd";
import AdminHeader from "../../../components/admin-components/admin-headers";
import AdminSideBar from "../../../components/admin-components/admin-sidebar";
import OrderTable from "../../../components/admin-components/order-table";
import { useState } from "react";
const { Option } = Select; // Đảm bảo sử dụng Option từ antd
const { RangePicker } = DatePicker;
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
  },
];

const detailData = [
  {
    orderdetailid: "OD001",
    productid: "P001",
    orderID: "DH001", // Liên kết với đơn hàng "DH001"
    productComboID: "C001",
  },
  {
    orderdetailid: "OD002",
    productid: "P002",
    orderID: "DH001", // Liên kết với đơn hàng "DH001"
    productComboID: "C002",
  },
  {
    orderdetailid: "OD003",
    productid: "P003",
    orderID: "DH002", // Liên kết với đơn hàng "DH002"
    productComboID: "C003",
  },
  {
    orderdetailid: "OD004",
    productid: "P004",
    orderID: "DH003", // Liên kết với đơn hàng "DH003"
    productComboID: "C004",
  },
  {
    orderdetailid: "OD005",
    productid: "P005",
    orderID: "DH004", // Liên kết với đơn hàng "DH004"
    productComboID: "C005",
  },
  {
    orderdetailid: "OD006",
    productid: "P006",
    orderID: "DH004", // Liên kết với đơn hàng "DH004"
    productComboID: "C006",
  },
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
  const [filteredOrders, setFilteredOrders] = useState(orderData); // Dữ liệu đơn hàng đã lọc
  // Xử lý lọc theo trạng thái đơn hàng
  const handleStatusFilter = (status) => {
    if (status === "all") {
      setFilteredOrders(orderData);
    } else {
      const filtered = orderData.filter((order) => order.status === status);
      setFilteredOrders(filtered);
    }
  };

  // Lọc theo ngày đặt trong khoảng thời gian
  const handleDateRangeFilter = (dates) => {
    if (!dates || dates.length === 0) {
      setFilteredOrders(orderData);
    } else {
      const [start, end] = dates;
      const filtered = orderData.filter((order) => {
        const orderDate = new Date(order.orderDate);
        return orderDate >= start && orderDate <= end;
      });
      setFilteredOrders(filtered);
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
        <div className="filter-container">
          <Select
            placeholder="Lọc theo trạng thái"
            style={{ width: 200, marginRight: 10 }}
            onChange={handleStatusFilter}
          >
            <Option value="all">Tất cả</Option> {/* Sử dụng Select.Option */}
            <Option value="Chờ xác nhận">Chờ xác nhận</Option>
            <Option value="Đang chuẩn bị">Đang chuẩn bị</Option>
            <Option value="Đang vận chuyển">Đang vận chuyển</Option>
            <Option value="Đã hủy">Đã hủy</Option>
          </Select>

          {/* Bộ lọc theo khoảng ngày đặt hàng */}
          <RangePicker
            placeholder={["Ngày bắt đầu", "Ngày kết thúc"]} // Tùy chỉnh placeholder
            style={{ marginRight: 10 }}
            onChange={handleDateRangeFilter}
          />
        </div>
        <OrderTable
          orderData={filteredOrders}
          columns={columns}
          title="Quản lý đơn hàng"
          detailData={detailData}
        />
      </div>
    </div>
  );
};

export default ManageOrder;
