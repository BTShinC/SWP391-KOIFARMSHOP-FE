import { Select, DatePicker, Pagination } from "antd";
import AdminHeader from "../../../components/admin-components/admin-headers";
import AdminSideBar from "../../../components/admin-components/admin-sidebar";
import OrderTable from "../../../components/admin-components/order-table";
import { useEffect, useState } from "react";
import { fetchOrderDetails, fetchOrders } from "../../../service/userService";
const { Option } = Select;
const { RangePicker } = DatePicker;

const columns = [
  "Mã đơn hàng",
  "Tổng tiền ",
  "Ngày đặt",
  "Trạng thái",
  "Thao tác",
];

const ManageOrder = () => {
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const ordersData = await fetchOrders();
        const statusOrder = [
          "Đang xử lý",
          "Đang chuẩn bị",
          "Đang vận chuyển",
          "Đã giao hàng",
          "Hoàn tất",
          "Đã hủy",
        ];

        const sorted = ordersData.sort((a, b) => {
          return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
        });
        setOrders(sorted);
        setFilteredOrders(sorted);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, []);

  const handleViewOrderDetails = async (orderID) => {
    try {
      const details = await fetchOrderDetails(orderID);
      setOrderDetails(details);
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    }
  };

  const handleStatusFilter = (status) => {
    if (status === "all") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter((order) => order.status === status);
      setFilteredOrders(filtered);
    }
  };

  const handleDateRangeFilter = (dates) => {
    if (!dates || dates.length === 0) {
      setFilteredOrders(orders);
    } else {
      const [start, end] = dates;
      const filtered = orders.filter((order) => {
        const orderDate = new Date(order.date);
        return orderDate >= start && orderDate <= end;
      });
      setFilteredOrders(filtered);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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
            <Option value="all">Tất cả</Option>
            <Option value="Chờ xác nhận">Chờ xác nhận</Option>
            <Option value="Đang chuẩn bị">Đang chuẩn bị</Option>
            <Option value="Đã giao hàng">Đã giao hàng</Option>
            <Option value="Đang vận chuyển">Đang vận chuyển</Option>
            <Option value="Đã hủy">Đã hủy</Option>
          </Select>

          <RangePicker
            placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
            style={{ marginRight: 10 }}
            onChange={handleDateRangeFilter}
          />
        </div>
        <div className="order-table">
          <OrderTable
            orderData={paginatedOrders}
            columns={columns}
            title="Quản lý đơn hàng"
            detailData={orderDetails}
            onViewDetails={handleViewOrderDetails}
          />
        </div>
        <Pagination
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
          current={currentPage}
          pageSize={pageSize}
          total={filteredOrders.length}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default ManageOrder;
