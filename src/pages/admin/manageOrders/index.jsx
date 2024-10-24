import { Select, DatePicker } from "antd";
import AdminHeader from "../../../components/admin-components/admin-headers";
import AdminSideBar from "../../../components/admin-components/admin-sidebar";
import OrderTable from "../../../components/admin-components/order-table";
import { useEffect, useState } from "react";
import { fetchOrderDetails, fetchOrders } from "../../../service/userService";
const { Option } = Select; // Đảm bảo sử dụng Option từ antd
const { RangePicker } = DatePicker;

const columns = [
  "Mã đơn hàng",
  // "Mã khách hàng",
  "Tổng tiền ",
  "Ngày đặt",
  "Trạng thái",
  "Thao tác",
];
const ManageOrder = () => {
  const [filteredOrders, setFilteredOrders] = useState([]); // Dữ liệu đơn hàng đã lọc
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [orders, setOrders] = useState([]); // Dữ liệu đơn hàng từ API
  const [orderDetails, setOrderDetails] = useState(null); // Trạng thái để lưu chi tiết đơn hàng
  // const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái hiển thị modal
  useEffect(() => {
    const getOrders = async () => {
      try {
        const ordersData = await fetchOrders(); // Gọi hàm fetchOrders
        console.log(ordersData);
        setOrders(ordersData); // Cập nhật dữ liệu đơn hàng
        setFilteredOrders(ordersData); // Cập nhật dữ liệu đã lọc
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false); // Đặt loading thành false sau khi hoàn thành
      }
    };

    getOrders();
  }, []);

  // Hàm để lấy chi tiết đơn hàng
  const handleViewOrderDetails = async (orderID) => {
    try {
      const details = await fetchOrderDetails(orderID); // Gọi hàm fetchOrderDetails
      setOrderDetails(details); // Cập nhật chi tiết đơn hàng
      // Có thể hiển thị chi tiết đơn hàng trong một modal hoặc một phần khác của UI
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    }
  };

  // Xử lý lọc theo trạng thái đơn hàng
  const handleStatusFilter = (status) => {
    if (status === "all") {
      setFilteredOrders(orders); // Sử dụng dữ liệu từ API
    } else {
      const filtered = orders.filter((order) => order.status === status); // Lọc từ dữ liệu API
      setFilteredOrders(filtered);
    }
  };

  // Lọc theo ngày đặt trong khoảng thời gian
  const handleDateRangeFilter = (dates) => {
    if (!dates || dates.length === 0) {
      setFilteredOrders(orders); // Sử dụng dữ liệu từ API
    } else {
      const [start, end] = dates;
      const filtered = orders.filter((order) => {
        const orderDate = new Date(order.date); // Sử dụng trường 'date' từ API
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
            <Option value="Đã giao hàng">Đã giao hàng</Option>
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
          detailData={orderDetails}
          onViewDetails={handleViewOrderDetails} // Truyền hàm vào OrderTable
        />
      </div>
    </div>
  );
};

export default ManageOrder;
