import React, { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, Spin } from "antd";
import { XFilled } from "@ant-design/icons";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import "./index.scss";
import api from "../../../config/api";
import AdminSideBar from "../../../components/admin-components/admin-sidebar";
import AdminHeader from "../../../components/admin-components/admin-headers";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const DashboardPage = () => {
    const [loading, setLoading] = useState(true);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalProductCombos, setTotalProductCombos] = useState(0);
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [productData, setProductData] = useState([]);
    const [productComboData, setProductComboData] = useState([]);
    const [accountData, setAccountData] = useState([]);
    const [totalOrders, setTotalOrders] = useState(0);
    const [orderData, setOrderData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productResponse = await api.get("/product/getall");
                const productComboResponse = await api.get("/productcombo/getall");
                const accountResponse = await api.get("/account");
                const orderResponse = await api.get("/orders");

                setTotalProducts(productResponse.data.length);
                setTotalProductCombos(productComboResponse.data.length);
                setTotalCustomers(accountResponse.data.filter(account => account.role === "Customer").length);
                setTotalOrders(orderResponse.data.length);

                setProductData(productResponse.data);
                setProductComboData(productComboResponse.data);
                setAccountData(accountResponse.data);
                setOrderData(orderResponse.data);

                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const productConsignmentTypeData = {
        labels: ["Trang trại đăng bán", "Ký gửi để bán", "chăm sóc"],
        datasets: [
            {
                label: "Sản phẩm",
                data: [
                    productData.filter(product => product.consignmentType === "Trang trại đăng bán").length,
                    productData.filter(product => product.consignmentType === "Ký gửi để bán").length,
                    productData.filter(product => product.consignmentType === "chăm sóc").length
                ],
                backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"]
            }
        ]
    };

    const productComboConsignmentTypeData = {
        labels: ["Trang trại đăng bán", "Ký gửi để bán", "chăm sóc"],
        datasets: [
            {
                label: "Combo sản phẩm",
                data: [
                    productComboData.filter(combo => combo.consignmentType === "Trang trại đăng bán").length,
                    productComboData.filter(combo => combo.consignmentType === "Ký gửi để bán").length,
                    productComboData.filter(combo => combo.consignmentType === "chăm sóc").length
                ],
                backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"]
            }
        ]
    };

    const accountRoleData = {
        labels: ["Customer", "Admin"],
        datasets: [
            {
                label: "Tài khoản",
                data: [
                    accountData.filter(account => account.role === "customer").length,
                    accountData.filter(account => account.role === "admin").length
                ],
                backgroundColor: ["#36A2EB", "#FF6384"]
            }
        ]
    };
    const orderStatusData = {
        labels: ["Đang xử lý", "Đang chuẩn bị", "Đang vận chuyển", "Đã giao hàng", "Hoàn tất", "Đã hủy"],
        datasets: [
            {
                label: "Đơn hàng",
                data: [
                    orderData.filter(order => order.status === "Đang xử lý").length,
                    orderData.filter(order => order.status === "Đang chuẩn bị").length,
                    orderData.filter(order => order.status === "Đang vận chuyển").length,
                    orderData.filter(order => order.status === "Đã giao hàng").length,
                    orderData.filter(order => order.status === "Hoàn tất").length,
                    orderData.filter(order => order.status === "Đã hủy").length
                ],
                backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384", "#FF9F40", "#4BC0C0", "#9966FF"]
            }
        ]
    };

    const completedOrders = orderData.filter(order => order.status === "Hoàn tất");
    const priceRanges = {
        "< 1TR": completedOrders.filter(order => order.discountedTotal < 1000000).length,
        "1TR - 2TR": completedOrders.filter(order => order.discountedTotal >= 1000000 && order.discountedTotal < 2000000).length,
        "2TR - 3TR": completedOrders.filter(order => order.discountedTotal >= 2000000 && order.discountedTotal < 3000000).length,
        "3TR - 4TR": completedOrders.filter(order => order.discountedTotal >= 3000000 && order.discountedTotal < 4000000).length,
        "4TR - 5TR": completedOrders.filter(order => order.discountedTotal >= 4000000 && order.discountedTotal < 5000000).length,
        "5TR - 6TR": completedOrders.filter(order => order.discountedTotal >= 5000000 && order.discountedTotal < 6000000).length,
        "6TR - 7TR": completedOrders.filter(order => order.discountedTotal >= 6000000 && order.discountedTotal < 7000000).length,
        "7TR - 8TR": completedOrders.filter(order => order.discountedTotal >= 7000000 && order.discountedTotal < 8000000).length,
        "8TR - 9TR": completedOrders.filter(order => order.discountedTotal >= 8000000 && order.discountedTotal < 9000000).length,
        "9TR - 10TR": completedOrders.filter(order => order.discountedTotal >= 9000000 && order.discountedTotal < 10000000).length,
        "> 10TR": completedOrders.filter(order => order.discountedTotal >= 10000000).length
    };

    const priceRangeData = {
        labels: Object.keys(priceRanges),
        datasets: [
            {
                label: "Phân bố giá trị đơn hàng",
                data: Object.values(priceRanges),
                backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384", "#FF9F40", "#4BC0C0", "#9966FF", "#FF9F40", "#FF6384", "#FFCE56", "#36A2EB", "#4BC0C0"]
            }
        ]
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
                                <Col span={12}>
                                    <Card>
                                        <Statistic title="Tổng số sản phẩm" value={totalProducts} />
                                    </Card>
                                </Col>
                                <Col span={12}>
                                    <Card>
                                        <Statistic title="Tổng số combo sản phẩm" value={totalProductCombos} />
                                    </Card>
                                </Col>
                            </Row>
                            <Row gutter={16} style={{ marginTop: 20 }}>
                                <Col span={12}>
                                    <Card title="Sản phẩm">
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <Col span={12}>
                                                <Pie data={productConsignmentTypeData} />
                                            </Col>
                                            <Col span={12}>
                                                <div style={{ marginLeft: 20 }}>
                                                    <p style={{ fontWeight: "normal" }}><XFilled style={{ color: "#36A2EB" }} /> Trang trại đăng bán: {productData.filter(product => product.consignmentType === "Trang trại đăng bán").length}</p>
                                                    <p style={{ fontWeight: "normal" }}><XFilled style={{ color: "#FFCE56" }} /> Ký gửi để bán: {productData.filter(product => product.consignmentType === "Ký gửi để bán").length}</p>
                                                    <p style={{ fontWeight: "normal" }}><XFilled style={{ color: "#FF6384" }} /> Ký gửi chăm sóc:  {productData.filter(product => product.consignmentType === "chăm sóc").length}</p>
                                                </div>
                                            </Col>
                                        </div>
                                    </Card>
                                </Col>
                                <Col span={12}>
                                    <Card title="Combo sản phẩm">
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <Col span={12}>
                                                <Pie data={productComboConsignmentTypeData} />
                                            </Col>
                                            <Col span={12}>
                                                <div style={{ marginLeft: 20 }}>
                                                    <p style={{ fontWeight: "normal" }}><XFilled style={{ color: "#36A2EB" }} /> Trang trại đăng bán: {productComboData.filter(combo => combo.consignmentType === "Trang trại đăng bán").length}</p>
                                                    <p style={{ fontWeight: "normal" }}><XFilled style={{ color: "#FFCE56" }} /> Ký gửi để bán: {productComboData.filter(combo => combo.consignmentType === "Ký gửi để bán").length}</p>
                                                    <p style={{ fontWeight: "normal" }}><XFilled style={{ color: "#FF6384" }} /> Ký gửi chăm sóc: {productComboData.filter(combo => combo.consignmentType === "chăm sóc").length}</p>
                                                </div>
                                            </Col>
                                        </div>
                                    </Card>
                                </Col>

                            </Row>
                            <Row gutter={16} style={{ marginTop: 20 }}>
                                <Col span={24}>
                                    <Card title="Đơn hàng">
                                        <div style={{ display: 'flex' }}>
                                            <Col span={8}>

                                                <h3 style={{ color: "#1d4ed8", paddingTop: 50, fontWeight: 500 }}>Tổng số đơn hàng: {totalOrders}</h3>

                                            </Col>
                                            <Col span={8}>
                                                <Pie data={orderStatusData} />
                                            </Col>
                                            <Col span={8}>
                                                <div style={{ marginLeft: 20 }}>
                                                    <p style={{ fontWeight: "normal" }}><XFilled style={{ color: "#36A2EB" }} /> Đang xử lý: {orderData.filter(order => order.status === "Đang xử lý").length}</p>
                                                    <p style={{ fontWeight: "normal" }}><XFilled style={{ color: "#FFCE56" }} /> Đang chuẩn bị: {orderData.filter(order => order.status === "Đang chuẩn bị").length}</p>
                                                    <p style={{ fontWeight: "normal" }}><XFilled style={{ color: "#FF6384" }} /> Đang vận chuyển: {orderData.filter(order => order.status === "Đang vận chuyển").length}</p>
                                                    <p style={{ fontWeight: "normal" }}><XFilled style={{ color: "#FF9F40" }} /> Đã giao hàng: {orderData.filter(order => order.status === "Đã giao hàng").length}</p>
                                                    <p style={{ fontWeight: "normal" }}><XFilled style={{ color: "#4BC0C0" }} /> Hoàn tất: {orderData.filter(order => order.status === "Hoàn tất").length}</p>
                                                    <p style={{ fontWeight: "normal" }}><XFilled style={{ color: "#9966FF" }} /> Đã hủy: {orderData.filter(order => order.status === "Đã hủy").length}</p>
                                                </div>
                                            </Col>
                                        </div>
                                    </Card>
                                </Col>



                            </Row>
                            <Row gutter={16} style={{ marginTop: 20 }}>
                                <Col span={24}>
                                    <Card title="Phân bố giá trị đơn hàng (Hoàn tất)">
                                        <Bar data={priceRangeData} options={{ scales: { x: { barThickness: 1 } } }} />
                                    </Card>
                                </Col>
                            </Row>

                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;