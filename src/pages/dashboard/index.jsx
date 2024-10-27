import React, { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, Spin } from "antd";
import { XFilled } from "@ant-design/icons";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import "./index.scss";
import api from "../../config/api";
import AdminSideBar from "../../components/admin-components/admin-sidebar";
import AdminHeader from "../../components/admin-components/admin-headers";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const DashboardPage = () => {
    const [loading, setLoading] = useState(true);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalProductCombos, setTotalProductCombos] = useState(0);
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [productData, setProductData] = useState([]);
    const [productComboData, setProductComboData] = useState([]);
    const [accountData, setAccountData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productResponse = await api.get("/product/getall");
                const productComboResponse = await api.get("/productcombo/getall");
                const accountResponse = await api.get("/account");

                setTotalProducts(productResponse.data.length);
                setTotalProductCombos(productComboResponse.data.length);
                setTotalCustomers(accountResponse.data.filter(account => account.role === "Customer").length);

                setProductData(productResponse.data);
                setProductComboData(productComboResponse.data);
                setAccountData(accountResponse.data);

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
                                        <div style={{ display: 'flex' , alignItems: 'center'}}>
                                            <Col span={12}>
                                                <Pie data={productConsignmentTypeData} />
                                            </Col>
                                            <Col span={12}>
                                                <div style={{ marginLeft: 20 }}>
                                                    <p style={{ fontWeight: "normal" }}><XFilled style={{ color: "#36A2EB" }} /> Trang trại đăng bán: {productData.filter(product => product.consignmentType === "Trang trại đăng bán").length}</p>
                                                    <p style={{ fontWeight: "normal" }}><XFilled style={{ color: "#FFCE56" }} /> Ký gửi để bán: {productData.filter(product => product.consignmentType === "Ký gửi để bán").length}</p>
                                                    <p style={{ fontWeight: "normal" }}><XFilled style={{ color: "#FF6384" }} /> chăm sóc: {productData.filter(product => product.consignmentType === "chăm sóc").length}</p>
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

                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;