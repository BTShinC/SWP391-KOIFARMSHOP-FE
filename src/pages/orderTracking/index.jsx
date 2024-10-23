// src/pages/orderTracking/OrderTracking.jsx
import React, { useEffect, useState } from "react";
import axios from "axios"; // Import axios
import { useSelector } from "react-redux"; // Import useSelector for accessing Redux state
import { Card, Spin, message } from "antd"; // Import necessary components from Ant Design
import './index.scss'; // Import styles

function OrderTracking() {
    const [orderData, setOrderData] = useState(null); // State for order data
    const [loading, setLoading] = useState(false); // State for loading indicator
    const user = useSelector((state) => state.user); // Get user data from Redux store

    // Function to fetch order data
    const fetchOrderData = async () => {
        const accountId = user.account.accountID; // Get account ID from user data
        if (!accountId) {
            message.error("Account ID not found.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(`http://103.90.227.69:8080/api/orders/${accountId}`);
            setOrderData(response.data); // Set order data from API response
        } catch (error) {
            console.error("Error fetching order data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderData(); // Fetch order data when the component mounts
    }, [user.account.accountID]); // Fetch again if accountID changes

    return (
        <div className="order-tracking-page">
            {loading ? (
                <Spin size="large" /> // Show loading spinner while fetching data
            ) : orderData ? (
                <Card style={{ marginTop: 20 }}>
                    <h2>Order Details</h2>
                    <p><strong>Mã đơn hàng:</strong> {orderData.orderID}</p>
                    <p><strong>Tổng cộng:</strong> {orderData.total} VND</p>
                    <p><strong>Ngày đặt hàng:</strong> {new Date(orderData.date).toLocaleString()}</p>
                    <p><strong>Trạng thái:</strong> {orderData.status}</p>
                </Card>
            ) : (
                <p>Tài khoản này hiện chưa có đơn hàng nào.</p> // Message if no order data is found
            )}
        </div>
    );
}

export default OrderTracking;