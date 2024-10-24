import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, Spin, message, Collapse, Table, Tabs } from "antd";
import api from '../../config/api';
import './index.scss';
import { render } from "react-dom";
import { blue } from "@mui/material/colors";

const { Panel } = Collapse;
const { TabPane } = Tabs;

function OrderTracking() {
  const [orders, setOrders] = useState([]);
  const [orderDetailsMap, setOrderDetailsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user);
  console.log("Current user:", user);

  useEffect(() => {
    if (user && user.accountID) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user || !user.accountID) {
      console.error("User or account information is missing");
      return;
    }

    try {
      const response = await api.get(`/orders/account/${user.accountID}`);
      setOrders(response.data);
    } catch (error) {
      if (error.response) {
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);
      }
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderID) => {
    try {
      console.log(`Fetching details for order: ${orderID}`);
      const response = await api.get(`/orders-details/order/${orderID}`);
      const orderDetails = response.data;
      console.log('Order details received:', orderDetails);

      if (!orderDetails || !Array.isArray(orderDetails)) {
        console.error('Invalid order details format:', orderDetails);
        return [];
      }

      const updatedOrderDetails = await Promise.all(
        orderDetails.map(async (detail, index) => {
          console.log(`Processing detail item ${index}:`, detail);

          try {
            if (detail.productID) {
              console.log(`Fetching product with ID: ${detail.productID}`);
              const productResponse = await api.get(`/product/${detail.productID}`);
              console.log(`Product data received for ${detail.productID}:`, productResponse.data);

              if (!productResponse.data) {
                throw new Error(`Empty response for product ${detail.productID}`);
              }

              const updatedDetail = {
                ...detail,
                image: productResponse.data.image,
                price: productResponse.data.price,
                name: productResponse.data.name,
                type: 'product'
              };
              console.log(`Updated product detail:`, updatedDetail);
              return updatedDetail;
            } else if (detail.productComboID) {
              console.log(`Fetching combo with ID: ${detail.productComboID}`);
              const comboResponse = await api.get(`/productcombo/${detail.productComboID}`);
              console.log(`Combo data received for ${detail.productComboID}:`, comboResponse.data);

              if (!comboResponse.data) {
                throw new Error(`Empty response for combo ${detail.productComboID}`);
              }

              const updatedDetail = {
                ...detail,
                image: comboResponse.data.image,
                price: comboResponse.data.price,
                name: comboResponse.data.name,
                type: 'combo'
              };
              console.log(`Updated combo detail:`, updatedDetail);
              return updatedDetail;
            }

            console.warn('Detail has neither productID nor productComboID:', detail);
            return detail;
          } catch (innerError) {
            console.error(`Error processing detail item ${index}:`, innerError);
            console.error('Failed detail:', detail);
            console.error('Error details:', {
              message: innerError.message,
              stack: innerError.stack,
              response: innerError.response?.data
            });

            return {
              ...detail,
              error: true,
              errorMessage: innerError.message
            };
          }
        })
      );

      console.log(`Final updated details for order ${orderID}:`, updatedOrderDetails);
      return updatedOrderDetails;

    } catch (error) {
      console.error(`Failed to fetch order details for ${orderID}:`, {
        message: error.message,
        stack: error.stack,
        response: error.response?.data
      });
      return [];
    }
  };

  useEffect(() => {
    const fetchAllDetails = async () => {
      const detailsPromises = orders.map(async (order) => {
        const orderDetails = await fetchOrderDetails(order.orderID);
        return {
          ...order,
          details: orderDetails,
        };
      });

      const allDetails = await Promise.all(detailsPromises);
      const newOrderDetailsMap = {};
      orders.forEach((order, index) => {
        newOrderDetailsMap[order.orderID] = allDetails[index].details;
      });
      setOrderDetailsMap(newOrderDetailsMap);
    };

    if (orders.length > 0) {
      fetchAllDetails();
    }
  }, [orders]);

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (image) => image ? <img src={image} alt="Product" style={{ width: '10vw', height: '30vh' }} /> : null
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'productID',
      key: 'productID',
      render: (text, record) => record.productID || record.productComboID
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => price ? `${price.toLocaleString('vi-VN')} VND` : 'N/A'
    },
    
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type) => type === 'product' ? 'Sản phẩm' : 'Combo'
    }
  ];

  return (
    <div className="order-tracking-page-wrapper">
      <div className="order-tracking-page">
        <h1>Theo Dõi Đơn Hàng</h1>
        {loading ? (
          <Spin size="large" />
        ) : (
          <Collapse accordion>
            {orders.map((order) => {
              const orderDetails = orderDetailsMap[order.orderID] || [];
              const detailsLoading = !orderDetailsMap[order.orderID];

                return (
                <Panel
                  key={order.orderID}
                  header={
                  <div className="order-header" >
                    <span>Mã đơn hàng: {order.orderID}</span>
                    <span>Tổng cộng: {order.total.toLocaleString('vi-VN')} VND</span>
                    <span>Ngày đặt hàng: {new Date(order.date).toLocaleDateString()}</span>
                    <span style={{ color: blue[400] }} className={`status ${order.status.toLowerCase()}`}>{order.status}</span>
                  </div>
                  }
                >
                  <Card className="order-details">
                  <h3>Chi tiết đơn hàng:</h3>
                  {detailsLoading ? (
                    <Spin />
                  ) : (
                    <Table
                    columns={columns}
                    dataSource={orderDetails}
                    rowKey={(record) => record.productID || record.productComboID}
                    pagination={false} // Remove pagination
                    />
                  )}
                  </Card>
                </Panel>
                );
            })}
          </Collapse>
        )}
      </div>
    </div>
  );
}

export default OrderTracking;