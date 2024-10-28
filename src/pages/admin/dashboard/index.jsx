import React, { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, Spin, DatePicker } from "antd";
import { XFilled } from "@ant-design/icons";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import "./index.scss";

import api from "../../../config/api";
import AdminSideBar from "../../../components/admin-components/admin-sidebar";
import AdminHeader from "../../../components/admin-components/admin-headers";
import { toast } from "react-toastify";
import moment from "moment";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalProductCombos, setTotalProductCombos] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [topBreeds, setTopBreeds] = useState([]);
  const [productData, setProductData] = useState([]);
  const [productComboData, setProductComboData] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [revenueData, setRevenueData] = useState({
    totalRevenueID: "",
    startDate: "",
    endDate: "",
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await api.get("/product/getall");
        const productComboResponse = await api.get("/productcombo/getall");
        const accountCustomerResponse = await api.get(
          "/report/accountcustomer"
        );
        const accountAllResponse = await api.get("report/accountall");
        const topBreedsResponse = await api.get("report/top5-breeds");
        const orderResponse = await api.get("/report/orders"); //khi nao api order song thi chinh lai
                                                                //nhet cai api order chet vao la bi hu ca page

        const { startDate, endDate } = getCurrentMonthDates();
        const revenueResponse = await api.get("revenue/calculate", {
          params: { startDate, endDate },
        });
        console.log(revenueResponse.data);
        setRevenueData(revenueResponse.data);
        setDateRange([moment(startDate), moment(endDate)]);

        setTotalProducts(productResponse.data.length);
        setTotalProductCombos(productComboResponse.data.length);
        setTotalCustomers(accountCustomerResponse.data);
        setTotalAccounts(accountAllResponse.data);
        setTopBreeds(topBreedsResponse.data);

        setProductData(productResponse.data);
        setProductComboData(productComboResponse.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const productConsignmentTypeData = {
    labels: ["Trang trại đăng bán", "Ký gửi để bán", "Ký gửi chăm sóc"],
    datasets: [
      {
        label: "Sản phẩm",
        data: [
          productData.filter(
            (product) => product.consignmentType === "Trang trại đăng bán"
          ).length,
          productData.filter(
            (product) => product.consignmentType === "Ký gửi để bán"
          ).length,
          productData.filter(
            (product) => product.consignmentType === "Ký gửi chăm sóc"
          ).length,
        ],
        backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
      },
    ],
  };

  const productComboConsignmentTypeData = {
    labels: ["Trang trại đăng bán", "Ký gửi để bán", "Ký gửi chăm sóc"],
    datasets: [
      {
        label: "Combo sản phẩm",
        data: [
          productComboData.filter(
            (combo) => combo.consignmentType === "Trang trại đăng bán"
          ).length,
          productComboData.filter(
            (combo) => combo.consignmentType === "Ký gửi để bán"
          ).length,
          productComboData.filter(
            (combo) => combo.consignmentType === "Ký gửi chăm sóc"
          ).length,
        ],
        backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
      },
    ],
  };

  const accountRoleData = {
    labels: ["Khách hàng", "Admin"],
    datasets: [
      {
        label: "Tài khoản",
        data: [totalCustomers, totalAccounts - totalCustomers],
        backgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };
  const getCurrentMonthDates = () => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    };
  };

  const handleDateRangeChange = async (dates) => {
    if (dates && dates.length === 2) {
      setDateRange(dates);
      const startDate = dates[0].format("YYYY-MM-DD");
      const endDate = dates[1].format("YYYY-MM-DD");
      try {
        const revenueResponse = await api.get("revenue/calculate", {
          params: { startDate, endDate },
        });
        setRevenueData(revenueResponse.data);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
        toast.error("Không thể lấy dữ liệu doanh thu");
      }
    }
  };

  return (
    <div className="admin">
      <AdminSideBar />
      <div className="admin-content">
        <AdminHeader />
        <h1 className="content__title">Báo cáo và thống kê</h1>
        <div className="dashboard-page">
          {loading ? (
            <Spin size="large" />
          ) : (
            <>
              <Row gutter={16}>
                <Col span={6}>
                  <Card>
                    <Statistic title="Tổng số sản phẩm" value={totalProducts} />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Tổng số combo sản phẩm"
                      value={totalProductCombos}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Số lượng khách hàng"
                      value={totalCustomers}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Tổng số tài khoản"
                      value={totalAccounts}
                    />
                  </Card>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: 20 }}>
                <Col span={12}>
                  <Card title="Sản phẩm">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Col span={12}>
                        <Pie data={productConsignmentTypeData} />
                      </Col>
                      <Col span={12}>
                        <div style={{ marginLeft: 20 }}>
                          <p style={{ fontWeight: "normal" }}>
                            <XFilled style={{ color: "#36A2EB" }} /> Trang trại
                            đăng bán:{" "}
                            {
                              productData.filter(
                                (product) =>
                                  product.consignmentType ===
                                  "Trang trại đăng bán"
                              ).length
                            }
                          </p>
                          <p style={{ fontWeight: "normal" }}>
                            <XFilled style={{ color: "#FFCE56" }} /> Ký gửi để
                            bán:{" "}
                            {
                              productData.filter(
                                (product) =>
                                  product.consignmentType === "Ký gửi để bán"
                              ).length
                            }
                          </p>
                          <p style={{ fontWeight: "normal" }}>
                            <XFilled style={{ color: "#FF6384" }} /> Ký gửi chăm sóc:{" "}
                            {
                              productData.filter(
                                (product) =>
                                  product.consignmentType === "Ký gửi chăm sóc"
                              ).length
                            }
                          </p>
                        </div>
                      </Col>
                    </div>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="Combo sản phẩm">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Col span={12}>
                        <Pie data={productComboConsignmentTypeData} />
                      </Col>
                      <Col span={12}>
                        <div style={{ marginLeft: 20 }}>
                          <p style={{ fontWeight: "normal" }}>
                            <XFilled style={{ color: "#36A2EB" }} /> Trang trại
                            đăng bán:{" "}
                            {
                              productComboData.filter(
                                (combo) =>
                                  combo.consignmentType ===
                                  "Trang trại đăng bán"
                              ).length
                            }
                          </p>
                          <p style={{ fontWeight: "normal" }}>
                            <XFilled style={{ color: "#FFCE56" }} /> Ký gửi để
                            bán:{" "}
                            {
                              productComboData.filter(
                                (combo) =>
                                  combo.consignmentType === "Ký gửi để bán"
                              ).length
                            }
                          </p>
                          <p style={{ fontWeight: "normal" }}>
                            <XFilled style={{ color: "#FF6384" }} /> Ký gửi chăm
                            sóc:{" "}
                            {
                              productComboData.filter(
                                (combo) => combo.consignmentType === "Ký gửi chăm sóc"
                              ).length
                            }
                          </p>
                        </div>
                      </Col>
                    </div>
                  </Card>
                </Col>
              </Row>


              <Row gutter={16} style={{ marginTop: 20 }}>
                <Col span={12}>
                  <Card title="Doanh thu">
                    <h4 style={{ marginBottom: "20px", color:"#1C4ED8"}}>Chọn khoảng thời gian</h4>
                    <DatePicker.RangePicker
                      onChange={handleDateRangeChange}
                      style={{ width: "100%", marginBottom: "20px" }}
                    />
                    <Statistic
                      value={revenueData.totalRevenue}
                      suffix="VNĐ"
                      precision={0}
                      formatter={(value) => `${value.toLocaleString("vi-VN")}`}
                      valueStyle={{ color: "#3f8600", fontSize: "24px" }}
                    />
                    <p style={{ marginTop: "10px" }}>
                      Từ {moment(revenueData.startDate).format("DD/MM/YYYY")}{" "}
                      đến {moment(revenueData.endDate).format("DD/MM/YYYY")}
                    </p>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="Top 5 giống cá bán chạy nhất">
                    <ul>
                      <li>
                        <Statistic value={topBreeds} />
                      </li>
                    </ul>
                  </Card>
                </Col>

                {/* ... các biểu đồ khác ... */}
              </Row>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
