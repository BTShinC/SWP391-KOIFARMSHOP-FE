import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, Spin, message, Collapse, Table, Tabs } from "antd";
import api from "../../config/api";
import "./index.scss";
import {
  fetchProductById,
  fetchProductComboById,
  updateConsignmentByID,
} from "../../service/userService";

const { Panel } = Collapse;
const { TabPane } = Tabs;

function ConsignmentTracking() {
  const [consignments, setConsignments] = useState([]);
  const [consignmentDetailsMap, setConsignmentDetailsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user && (user.accountID || user.accountId)) {
      fetchConsignments();
    }
  }, [user]);

  const fetchConsignments = async () => {
    const accountId = user.accountID || user.accountId;
    if (!accountId) {
      message.error("User account not found.");
      setLoading(false);
      return;
    }
    try {
      const response = await api.get(`/consignments/account/${accountId}`);
      setConsignments(response.data);
    } catch (error) {
      console.error("Error fetching consignments:", error);
      message.error("Error fetching consignments.");
    } finally {
      setLoading(false);
    }
  };

  const fetchConsignmentDetails = async (productId, productComboId) => {
    try {
      let image = null;
      if (productId) {
        const productResponse = await api.get(`/product/${productId}`);
        console.log("Product Response:", productResponse.data); // Log product response
        image = productResponse.data.image;
      } else if (productComboId) {
        const comboResponse = await api.get(`/productcombo/${productComboId}`);
        console.log("Product Combo Response:", comboResponse.data); // Log product combo response
        image = comboResponse.data.image;
      }
      return image;
    } catch (error) {
      console.error("Error fetching consignment details:", error);
      return null; // Or a placeholder image URL
    }
  };

  useEffect(() => {
    const fetchAllDetails = async () => {
      const detailsPromises = consignments.map(async (consignment) => {
        const image = await fetchConsignmentDetails(
          consignment.productID,
          consignment.productComboID
        );
        return {
          ...consignment,
          image: image,
        };
      });

      const allDetails = await Promise.all(detailsPromises);
      const newConsignmentDetailsMap = {};
      consignments.forEach((consignment, index) => {
        newConsignmentDetailsMap[consignment.consignmentID] = allDetails[index];
      });
      setConsignmentDetailsMap(newConsignmentDetailsMap);
    };

    if (consignments.length > 0) {
      fetchAllDetails();
    }
  }, [consignments]);

  const careColumns = [
    { title: "Mã ký gửi", dataIndex: "consignmentID", key: "consignmentID" },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (image) =>
        image ? (
          <img
            src={image}
            alt="Product"
            style={{ width: "10vw", height: "30vh" }}
          />
        ) : null,
    },
    {
      title: "Mã sản phẩm",
      dataIndex: "productId",
      key: "productId",
      render: (text, record) => record.productID || record.productComboID,
    },
    {
      title: "Ngày gửi",
      dataIndex: "consignmentDate",
      key: "consignmentDate",
      render: (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
      },
    },
    {
      title: "Ngày nhận",
      dataIndex: "dateReceived",
      key: "dateReceived",
      render: (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
      },
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "dateExpiration",
      key: "dateExpiration",
      render: (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
      },
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
      render: (text, record) => record.reason ||"",
    },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
    {
      title: "Thao tác",
      key: "action",
      render: () => <button className="btn-edit-consignment">Thao tác</button>,
    }, // Placeholder button
  ];

  const saleColumns = [
    { title: "Mã ký gửi", dataIndex: "consignmentID", key: "consignmentID" },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (image) =>
        image ? (
          <img
            src={image}
            alt="Product"
            style={{ width: "10vw", height: "30vh" }}
          />
        ) : null,
    },
    {
      title: "Mã sản phẩm",
      dataIndex: "productId",
      key: "productId",
      render: (text, record) => record.productID || record.productComboID,
    },
    { title: "Giá bán", dataIndex: "salePrice", key: "salePrice" },
    {
      title: "Ngày bán",
      dataIndex: "saleDate",
      key: "saleDate",
      render: (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
      },
    },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
    {
      title: "Thao tác",
      key: "action",
      render: (text, record) =>
        record.status !== "Hoàn tất" ? ( // Kiểm tra nếu trạng thái không phải "Hoàn tất"
          <button
            className="btn-edit-consignment"
            onClick={() =>
              handleChangeStatus(
                record,
                record.productID,
                record.productComboID
              )
            }
          >
            Rút cá
          </button>
        ) : null, // Ẩn nút nếu trạng thái là "Hoàn tất"
    },
  ];


  const handleChangeStatus = async (consignment, productID, productComboID) => {
    try {
      const newStatus = "Hoàn tất"; // Trạng thái mới là "Hoàn tất"
      const currentDate = new Date().toISOString(); // Ngày hiện tại
      console.log(consignment);
      // Cập nhật đối tượng consignment với trạng thái và ngày hoàn tất
      const updatedConsignment = {
        ...consignment,
        status: newStatus,
        saleDate: currentDate,
      };
      console.log();
      // Gửi yêu cầu cập nhật consignment
      const consignmentRes = await updateConsignmentByID(updatedConsignment);
      if (consignmentRes) {
        message.success(`Cập nhật trạng thái đơn ký gửi thành công.`);

        let updatedProduct = null;

        // Nếu có productID, lấy thông tin sản phẩm
        if (productID) {
          console.log(productID);
          const product = await fetchProductById(productID);
          if (product) {
            updatedProduct = {
              ...product,
              status: "Hết hàng",
            };
          } else {
            message.error("Không thể lấy thông tin sản phẩm.");
            return;
          }
        }
        // Nếu có productComboID, lấy thông tin combo sản phẩm
        else if (productComboID) {
          console.log(productComboID);
          const productCombo = await fetchProductComboById(productComboID);
          if (productCombo) {
            updatedProduct = {
              ...productCombo,
              status: "Hết hàng",
            };
          } else {
            message.error("Không thể lấy thông tin combo sản phẩm.");
            return;
          }
        }

        // Kiểm tra nếu updatedProduct đã được xác định
        if (updatedProduct) {
          const productEndpoint = productID
            ? `/product/${productID}`
            : `/productcombo/${productComboID}`;

          try {
            // Gửi yêu cầu cập nhật product hoặc productCombo
            const productRes = await api.put(productEndpoint, updatedProduct);

            // Kiểm tra nếu yêu cầu API thành công
            if (
              productRes &&
              productRes.status >= 200 &&
              productRes.status < 300
            ) {
              message.success(`Cập nhật trạng thái sản phẩm thành công.`);
            } else {
              console.log("Phản hồi từ API:", productRes);
              message.error("Cập nhật trạng thái sản phẩm thất bại.");
            }
          } catch (error) {
            console.error("Lỗi khi cập nhật sản phẩm:", error);
            message.error("Có lỗi xảy ra khi cập nhật sản phẩm.");
          }
        }
      } else {
        message.error("Cập nhật trạng thái đơn ký gửi thất bại.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      message.error("Có lỗi xảy ra khi cập nhật trạng thái.");
    }
  };

  return (
    <div className="consignment-tracking-page-wrapper">
      <div className="consignment-tracking-page">
        <h1>Theo Dõi Ký Gửi</h1>
        {loading ? (
          <Spin size="large" />
        ) : (
          <Tabs defaultActiveKey="1">
            <TabPane className="consignment-tab" tab="Dịch vụ chăm sóc" key="1">
              <Collapse accordion>
                {Object.entries(consignmentDetailsMap)
                  .filter(([id, consignment]) =>
                    consignment.consignmentType.includes("chăm sóc")
                  )
                  .map(([id, consignment]) => (
                    <Panel
                      key={id}
                      header={
                        <div className="order-header">
                          <span>Mã ký gửi: {consignment.consignmentID}</span>
                          {/* Add other header details as needed */}
                        </div>
                      }
                    >
                      <Card className="order-details">
                        {/* You can add more consignment details here */}
                        <h3>Chi tiết ký gửi:</h3>
                        <Table
                          columns={careColumns}
                          dataSource={[consignment]} // Pass an array with the consignment object
                          rowKey="consignmentID"
                          pagination={false} // Remove pagination
                        />
                      </Card>
                    </Panel>
                  ))}
              </Collapse>
            </TabPane>
            <TabPane className="consignment-tab" tab="Dịch vụ bán" key="2">
              <Collapse accordion>
                {Object.entries(consignmentDetailsMap)
                  .filter(([id, consignment]) =>
                    consignment.consignmentType.includes("bán")
                  )
                  .map(([id, consignment]) => (
                    <Panel
                      key={id}
                      header={
                        <div className="order-header">
                          <span>Mã ký gửi: {consignment.consignmentID}</span>
                          {/* Add other header details as needed */}
                        </div>
                      }
                    >
                      <Card className="order-details">
                        {/* You can add more consignment details here */}
                        <h3>Chi tiết ký gửi:</h3>
                        <Table
                          columns={saleColumns}
                          dataSource={[consignment]}
                          rowKey="consignmentID"
                          pagination={false} // Remove pagination
                        />
                      </Card>
                    </Panel>
                  ))}
              </Collapse>
            </TabPane>
          </Tabs>
        )}
      </div>
    </div>
  );
}

export default ConsignmentTracking;