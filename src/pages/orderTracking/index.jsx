import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, Spin, message, Collapse, Table, Pagination, Modal, Button, Select, Input, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import api from '../../config/api';
import './index.scss';
import { blue, green, red } from "@mui/material/colors";
import { storage } from "/src/firebase.js";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";


const { Panel } = Collapse;
const { Option } = Select;
const { TextArea } = Input;


function OrderTracking() {
  const [orders, setOrders] = useState([]);
  const [orderDetailsMap, setOrderDetailsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5); // Number of orders per page
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  const [feedbackDescription, setFeedbackDescription] = useState("");
  const [feedbackImage, setFeedbackImage] = useState(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isViewFeedbackModalVisible, setIsViewFeedbackModalVisible] = useState(false);
  const [viewFeedback, setViewFeedback] = useState(null);


  const user = useSelector((state) => state.user);
  console.log("Current user:", user);
  const initFeedbackFormValue = {
    accountID: user?.accountID || "",
    description: "",
    image: "",
    orderID: "" // Thêm orderID vào đây
  };

  const [feedbackFormValue, setFeedbackFormValue] = useState(initFeedbackFormValue);
  const [feedbackFileList, setFeedbackFileList] = useState([]);


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
      const sortedOrders = response.data.sort((a, b) => {
        const aNumber = parseInt(a.orderID.replace('O', ''), 10);
        const bNumber = parseInt(b.orderID.replace('O', ''), 10);
        return bNumber - aNumber; // Sort in descending order
      });

      // Check for feedback for each order
      const ordersWithFeedback = await Promise.all(sortedOrders.map(async (order) => {
        try {
          const feedbackResponse = await api.get(`/feedback/order/${order.orderID}`);
          return {
            ...order,
            feedbackSubmitted: feedbackResponse.data ? true : false,
          };
        } catch (error) {
          console.error(`Error fetching feedback for order ${order.orderID}:`, error);
          return {
            ...order,
            feedbackSubmitted: false,
          };
        }
      }));

      setOrders(ordersWithFeedback);
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

  const updateAccountBalance = async (accountID, amount) => {
    const apiUrl = `/account/updateBalance/${user.accountID}?amount=${amount}`;
    try {
      const response = await api.put(apiUrl); // Use api.put for PUT requests

      if (!response.ok) {
        throw new Error("Failed to update account balance");
      }
    } catch (error) {
      console.error("Error updating account balance:", error);
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
              const productResponse = await api.get(`/product/get/${detail.productID}`);
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
              const comboResponse = await api.get(`/productcombo/get/${detail.productComboID}`);
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
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      render: (text, record) => record.productName || record.comboName
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

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const showModal = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  const handleConfirm = async () => {
    if (!selectedOrder) return;

    try {
      const updatedOrder = {
        ...selectedOrder,
        status: "Hoàn tất",
        ordersDetails: null // Assuming ordersDetails is not required for the update
      };

      await api.put(`/orders/${selectedOrder.orderID}`, updatedOrder);
      // Update the status of all products and product combos in the order details back to "Còn hàng"
      const orderDetails = orderDetailsMap[selectedOrder.orderID];
      if (orderDetails) {
        await Promise.all(orderDetails.map(async (detail) => {
          if (detail.productID) {
            const productResponse = await api.get(`/product/get/${detail.productID}`);
            const updatedProduct = {
              ...productResponse.data,
              status: "Hết hàng"
            };
            await api.put(`/product/${detail.productID}`, updatedProduct);
            // Check consignmentType and update consignment if needed
            if (productResponse.data.consignmentType === "Ký gửi để bán") {
              const consignmentResponse = await api.get(`/consignments`);
              const consignments = consignmentResponse.data;
              const consignment = consignments.find(c => c.productID === detail.productID);

              if (consignment) {
                const updatedConsignment = {
                  ...consignment,
                  status: "Chưa hoàn tiền",
                  saleDate: new Date().toISOString(), // Add the current date
                };
                await api.put(`/consignments/${consignment.consignmentID}`, updatedConsignment);
              }
            }
          } else if (detail.productComboID) {
            const comboResponse = await api.get(`/productcombo/get/${detail.productComboID}`);
            const updatedCombo = {
              ...comboResponse.data,
              status: "Hết hàng"
            };
            await api.put(`/productcombo/${detail.productComboID}`, updatedCombo);
            // Check consignmentType and update consignment if needed
            if (comboResponse.data.consignmentType === "Ký gửi để bán") {
              const consignmentResponse = await api.get(`/consignments`);
              const consignments = consignmentResponse.data;
              const consignment = consignments.find(c => c.productComboID === detail.productComboID);

              if (consignment) {
                const updatedConsignment = {
                  ...consignment,
                  status: "Hoàn tất",
                  saleDate: new Date().toISOString(), // Add the current date
                };
                await api.put(`/consignments/${consignment.consignmentID}`, updatedConsignment);
              }
            }
          }
        }));
      }
      message.success("Đã hoàn tất đơn hàng!");

      // Update the order status locally
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderID === selectedOrder.orderID ? { ...order, status: "Hoàn tất" } : order
        )
      );

      setIsModalVisible(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error updating order status:", error);
      message.error("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng!");
    }
  };

  const handleConfirmCancel = async () => {
    if (!selectedOrder) return;

    try {
      const updatedOrder = {
        ...selectedOrder,
        status: "Đã hủy",
        ordersDetails: null // Assuming ordersDetails is not required for the update
      };

      await api.put(`/orders/${selectedOrder.orderID}`, updatedOrder);

      // Update the status of all products and product combos in the order details back to "Còn hàng"
      const orderDetails = orderDetailsMap[selectedOrder.orderID];
      if (orderDetails) {
        await Promise.all(orderDetails.map(async (detail) => {
          if (detail.productID) {
            const productResponse = await api.get(`/product/get/${detail.productID}`);
            const updatedProduct = {
              ...productResponse.data,
              status: "Còn hàng"
            };
            await api.put(`/product/${detail.productID}`, updatedProduct);
          } else if (detail.productComboID) {
            const comboResponse = await api.get(`/productcombo/get/${detail.productComboID}`);
            const updatedCombo = {
              ...comboResponse.data,
              status: "Còn hàng"
            };
            await api.put(`/productcombo/${detail.productComboID}`, updatedCombo);
          }
        }));
      }

      message.success("Đã hủy đơn hàng!");
      const refundAmount = selectedOrder.discountedTotal + 200000; // Refund the total amount + 200,000 VND shipping fee
      await updateAccountBalance(user.accountID, refundAmount);//refund to user account
      await api.post(
        "/transactions/create",
        {
          // Use the api instance
          accountID: user.accountID,
          price: refundAmount,
          date: new Date().toISOString(), // Add the current date
          description: `Hoàn tiền đơn hàng ${selectedOrder.orderID} (Hủy đơn) `, // Add a description
        },

      );
      message.success(`Đã hoàn trả ${refundAmount} VND cho bạn!`);

      // Update the order status locally
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderID === selectedOrder.orderID ? { ...order, status: "Đã hủy" } : order
        )
      );

      setIsModalVisible(false);
      setSelectedOrder(null);
      setCancelReason("");
    } catch (error) {
      console.error("Error updating order status:", error);
      message.error("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng!");
    }
  };

  const showFeedbackModal = (order) => {
    setSelectedOrder(order);
    setFeedbackFormValue(prev => ({
      ...prev,
      orderID: order.orderID
    }));
    setIsFeedbackModalVisible(true);
  };

  const showViewFeedbackModal = async (order) => {
    try {
      const response = await api.get(`/feedback/order/${order.orderID}`);
      console.log("Feedback response:", response.data); // Log the response
      setViewFeedback(response.data);
      setIsViewFeedbackModalVisible(true);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      message.error("Có lỗi xảy ra khi lấy phản hồi!");
    }
  };

  const handleFeedbackCancel = () => {
    setIsFeedbackModalVisible(false);
    setFeedbackDescription("");
    setFeedbackImage(null);
  };

  const handleFeedbackChange = (event) => {
    const { value, name } = event.target;
    setFeedbackFormValue((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  const handleFeedbackUploadChange = ({ fileList: newFileList }) => {
    setFeedbackFileList(newFileList);

    if (newFileList.length > 0) {
      const file = newFileList[0].originFileObj;
      const storageRef = ref(storage, `feedback/${file.name}`);
      uploadBytes(storageRef, file)
        .then(() => getDownloadURL(storageRef))
        .then((url) => {
          setFeedbackFormValue((prevFormValue) => ({
            ...prevFormValue,
            image: url,
          }));
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!feedbackFormValue.description || !feedbackFormValue.image) {
      console.log("Feedback form value:", feedbackFormValue);
      message.error("Vui lòng điền đầy đủ thông tin và tải lên hình ảnh!");
      return;
    }

    try {
      await api.post("feedback", feedbackFormValue);
      message.success("Cảm ơn bạn đã phản hồi!");
      setIsFeedbackModalVisible(false);
      setFeedbackFormValue(initFeedbackFormValue);
      setFeedbackFileList([]);
      setFeedbackSubmitted(true);

      // Update the order status locally to indicate feedback submitted
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderID === selectedOrder.orderID ? { ...order, feedbackSubmitted: true } : order
        )
      );
    } catch (error) {
      console.error("Error submitting feedback:", error);
      message.error("Có lỗi xảy ra khi gửi phản hồi!");
    }
  };
  return (
    <div className="order-tracking-page-wrapper" style={{ margin: 50 }}>
      <div className="order-tracking-page">
        {/* <h1 style={{marginTop:50, marginBottom: 50}}>Đơn Hàng Của Bạn</h1> */}
        {loading ? (
          <Spin size="large" />
        ) : (
          <>
            <Collapse accordion>
              {currentOrders.map((order) => {
                const orderDetails = orderDetailsMap[order.orderID] || [];
                const detailsLoading = !orderDetailsMap[order.orderID];

                return (
                  <Panel
                    key={order.orderID}
                    header={
                      <div className="order-header">
                        <span style={{ textAlign: "left" }}>Mã đơn hàng: {order.orderID}</span>
                        <span style={{ textAlign: "left" }}>Tổng cộng: {order.discountedTotal.toLocaleString('vi-VN')} VND</span>
                        <span style={{ textAlign: "left" }}>Ngày đặt hàng: {new Date(order.date).toLocaleDateString()}</span>
                        <span style={{ color: blue[400], textAlign: "left" }} className={`status ${order.status?.toLowerCase()}`}>{order.status}</span>
                      </div>
                    }
                  >
                    <Card className="order-details">
                      <div className="order-details-header">
                        <h3>Chi tiết đơn hàng:</h3>
                        {order.status === "Đã giao hàng" && (
                          <Button
                            type="primary"
                            onClick={() => showModal(order)}
                            style={{ marginLeft: 'auto' }}
                          >
                            Đã nhận hàng
                          </Button>
                        )}
                        {order.status === "Hoàn tất" && (
                          <>
                            <Button
                              type="primary"
                              style={{ marginLeft: 'auto', backgroundColor: green[400], borderColor: green[400] }}
                              disabled
                            >
                              Đã nhận hàng
                            </Button>
                            {order.feedbackSubmitted ? (
                              <Button
                                type="primary"
                                onClick={() => showViewFeedbackModal(order)}
                                style={{ marginLeft: '10px' }}
                              >
                                Đã phản hồi
                              </Button>
                            ) : (
                              <Button
                                type="primary"
                                onClick={() => showFeedbackModal(order)}
                                style={{ marginLeft: '10px' }}
                              >
                                Phản hồi
                              </Button>
                            )}
                          </>
                        )}
                        {order.status === "Đang xử lý" && (
                          <Button
                            type="primary"
                            onClick={() => showModal(order)}
                            style={{ marginLeft: 'auto' }}
                          >
                            Hủy đơn
                          </Button>
                        )}
                        {order.status === "Đã hủy" && (
                          <Button
                            type="primary"

                            style={{ marginLeft: 'auto', backgroundColor: red[400], borderColor: red[400] }}
                            disabled
                          >
                            Đã hủy
                          </Button>
                        )}
                      </div>
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
            <Pagination
              current={currentPage}
              pageSize={ordersPerPage}
              total={orders.length}
              onChange={handlePageChange}
              style={{ marginTop: '20px', textAlign: 'center', justifyContent: 'center' }}
            />
          </>
        )}
        <Modal
          className="custom-modal"
          title={selectedOrder?.status === "Đang xử lý" ? "Xác nhận hủy đơn" : "Xác nhận nhận hàng"}
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={[
            <Button
              key="confirm"
              type="primary"
              onClick={selectedOrder?.status === "Đang xử lý" ? handleConfirmCancel : handleConfirm}
              disabled={selectedOrder?.status === "Đang xử lý" && !cancelReason} // Disable if no reason selected
            >
              {selectedOrder?.status === "Đang xử lý" ? "Xác nhận hủy" : "Xác nhận"}
            </Button>
          ]}
        >
          {selectedOrder?.status === "Đang xử lý" ? (
            <>
              <p>Bạn có chắc chắn muốn hủy đơn hàng này không?<br />
                <p>Việc hủy đơn hàng sẽ đồng nghĩa với việc sản phẩm sẽ không được giao đến bạn, và nếu có bất kỳ ưu đãi hoặc khuyến mãi nào trong đơn hàng này, chúng sẽ không thể được áp dụng lại.</p>

                <p>Nếu bạn vẫn quyết định tiếp tục, vui lòng chọn lý do hủy đơn và nhấn "Xác nhận hủy". Chúng tôi luôn sẵn sàng hỗ trợ bạn trong quá trình mua sắm và rất mong được phục vụ bạn trong tương lai.</p>

                Lưu ý: Nếu có bất kỳ thắc mắc hay cần hỗ trợ, xin đừng ngần ngại liên hệ với chúng tôi, đội ngũ chăm sóc khách hàng của chúng tôi luôn sẵn sàng hỗ trợ bạn.</p>
              <p>Vui lòng chọn lý do hủy đơn:</p>
              <Select
                style={{ width: '100%', marginBottom: '10px' }}
                onChange={(value) => setCancelReason(value)}
                placeholder="Chọn lý do hủy đơn"
                value={cancelReason}
              >
                <Option value="Thay đổi ý định">Thay đổi ý định</Option>
                <Option value="Đặt nhầm sản phẩm">Đặt nhầm sản phẩm</Option>
                <Option value="Không cần nữa">Không cần nữa</Option>
                <Option value="Lý do khác">Lý do khác</Option>
              </Select>
              {cancelReason === "Lý do khác" && (
                <TextArea
                  rows={4}
                  placeholder="Nhập lý do khác"
                  onChange={(e) => setCancelReason(e.target.value)}
                />
              )}
            </>
          ) : (
            <>
              <p>
                Cảm ơn bạn đã tin tưởng và đặt mua sản phẩm tại Koifish!<br />
                Chúng tôi rất vui khi biết rằng đơn hàng của bạn đã được giao thành công. Xin vui lòng xác nhận rằng bạn đã nhận được hàng theo đúng thời gian và tình trạng đã cam kết bằng cách nhấn vào nút "Xác nhận" dưới đây.<br />
                Chúng tôi mong rằng sản phẩm đã đáp ứng sự mong đợi của bạn!
                Nếu có bất kỳ thắc mắc hay cần hỗ trợ, xin đừng ngần ngại liên hệ với chúng tôi, đội ngũ chăm sóc khách hàng của chúng tôi luôn sẵn sàng hỗ trợ bạn.<br />
                Một lần nữa, xin chân thành cảm ơn và chúc bạn có những trải nghiệm tuyệt vời cùng Koifish!
              </p>

            </>
          )}
        </Modal>

        <Modal
          className="custom-modal"
          title="Phản hồi đơn hàng"
          visible={isFeedbackModalVisible}
          onCancel={handleFeedbackCancel}
          footer={[
            <Button key="cancel" onClick={handleFeedbackCancel}>
              Hủy
            </Button>,
            <Button key="submit" type="primary" onClick={handleFeedbackSubmit}>
              Gửi phản hồi
            </Button>,
          ]}
        >
          <p>Vui lòng nhập phản hồi của bạn:</p>

          <p>Phản hồi của bạn là rất quan trọng đối với chúng tôi</p>

          <p>Chúng tôi luôn mong muốn mang lại trải nghiệm tốt nhất cho khách hàng. Nếu có bất kỳ khó khăn, vấn đề, hoặc đề xuất nào trong quá trình sử dụng dịch vụ, bạn vui lòng chia sẻ chi tiết tại đây.</p>

          <p>Hãy cho chúng tôi biết về trải nghiệm của bạn. Đội ngũ chăm sóc khách hàng sẽ xem xét kỹ lưỡng từng phản hồi và liên hệ lại để hỗ trợ khi cần.</p>

          <p>Bạn có thể trình bày về bất kỳ vấn đề nào, từ chất lượng sản phẩm, quá trình giao hàng, đến các dịch vụ khác mà bạn đã sử dụng. Mọi ý kiến đều được ghi nhận và đóng góp vào sự cải thiện của chúng tôi!</p>

          <p>Cảm ơn bạn vì đã giúp chúng tôi phục vụ tốt hơn!</p>
          <TextArea
            rows={4}
            name="description"
            placeholder="Nhập phản hồi"
            value={feedbackFormValue.description}
            onChange={handleFeedbackChange}
          />
          <p>Vui lòng tải lên hình ảnh:</p>
          <Upload
            name="feedbackImage"
            listType="picture-card"
            className="image-uploader"
            fileList={feedbackFileList}
            onChange={handleFeedbackUploadChange}
            beforeUpload={() => false}
          >
            {feedbackFileList.length >= 1 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
              </div>
            )}
          </Upload>
        </Modal>
        <Modal
          className="custom-modal"
          title="Xem phản hồi"
          visible={isViewFeedbackModalVisible}
          onCancel={() => setIsViewFeedbackModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setIsViewFeedbackModalVisible(false)}>
              Đóng
            </Button>,
          ]}
        >
          {viewFeedback ? (
            <>
              
              <p><strong>Hình ảnh:</strong></p>
              <img src={viewFeedback.image} alt="Feedback" style={{ width: '20%'}} />
              <p style={{paddingTop: 20}}><strong>Mô tả:</strong> {viewFeedback.description}</p>
            </>
          ) : (
            <Spin />
          )}
        </Modal>
      </div>
    </div>
  );
}

export default OrderTracking;