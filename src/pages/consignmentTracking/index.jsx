import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, Spin, message, Collapse, Table, Tabs, Modal } from "antd";
import { addDays, format } from 'date-fns';
import api from "../../config/api";
import "./index.scss";
import {
  editUser,
  // fetchCarePackageByID,
  fetchProductById,
  fetchProductComboById,
  refundConsignmentSell,
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
  // Lấy cá của đơn ký gửi
  const fetchConsignmentDetails = async (productID, productComboID) => {
    try {
      let image = null;
      if (productID) {
        const productResponse = await api.get(`/product/${productID}`);
        console.log("Product Response:", productResponse.data); // Log product response
        image = productResponse.data.image;
      } else if (productComboID) {
        const comboResponse = await api.get(`/productcombo/${productComboID}`);
        console.log("Product Combo Response:", comboResponse.data); // Log product combo response
        image = comboResponse.data.image;
      }
      return image;
    } catch (error) {
      console.error("Error fetching consignment details:", error);
      return null;
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
      title: "Ghi chú",
      dataIndex: "reason",
      key: "reason",

      render: (text, record) => record.reason || "",
    },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
    {
      title: "Thao tác",
      key: "action",
      render: (text, record) => {
        return record.status === "Hoàn tất" ? (
          <button
            className="btn-edit-consignment"
            onClick={() =>
              handleExtendConsignment(
                record,
                record.productID,
                record.productComboID
              )
            }
          >
            Gia hạn
          </button>
        ) : null;
      },
    },
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

    {
      title: "Ghi chú",
      dataIndex: "reason",
      key: "reason",
      render: (text, record) => record.reason || "",
    },

    { title: "Trạng thái", dataIndex: "status", key: "status" },
    {
      title: "Thao tác",
      key: "action",

      render: (text, record) => {
        const consignmentDate = new Date(record.consignmentDate);
        const currentDate = new Date();
        const daysDifference = Math.floor(
          (currentDate - consignmentDate) / (1000 * 60 * 60 * 24)
        );
        if (record.status === "Chờ xác nhận" && daysDifference >= 3) {
          return (
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
          );
        } else if (record.status === "Chờ xác nhận" && daysDifference < 3) {
          // If less than 3 days, disable the button and show a warning
          return (
            <button className="btn-edit-consignment" disabled>
              Chờ thêm {3 - daysDifference} ngày để rút
            </button>
          );
        }
        return null;
      },
    },
  ];
  // Gia hạn gói chăm sóc
  const handleOk  = async (record) => {
    console.log("Gia hạn consignment:", record, record.productComboID, record.productID);
  
    // Lấy ngày hiện tại và ngày hết hạn
    const currentDate = new Date();
    const dateExpiration = addDays(currentDate, record.duration);
  
    let carePackageID;
    let fee = 0;
  
    // Kiểm tra nếu có productID hoặc productComboID
    if (record.productID || record.productComboID) {
      try {
        // Gọi API song song để lấy product và care package (nếu cần)
        const [productRes, productComboRes] = await Promise.all([
          record.productID ? fetchProductById(record.productID) : null,
          record.productComboID ? fetchProductComboById(record.productComboID) : null,
        ]);
  
        // Lấy carePackageID từ product hoặc combo product
        if (productRes) {
          carePackageID = productRes.carePackageID;
        } else if (productComboRes) {
          carePackageID = productComboRes.carePackageID;
        }
  
        // Gọi API lấy thông tin care package và xử lý fee nếu có carePackageID
        if (carePackageID) {
          const carePackageRes = await fetchCarePackageByID(carePackageID);
          if (carePackageRes) {
            fee = carePackageRes?.data?.price || 0; // Lấy giá trị fee từ care package
          }
        }
  
        // Cập nhật thông tin record
        const updateRecord = {
          ...record,
          consignmentDate: format(currentDate, 'yyyy-MM-dd'),
          dateReceived: format(currentDate, 'yyyy-MM-dd'),
          dateExpiration: format(dateExpiration, 'yyyy-MM-dd'),
          status: "Đang chăm sóc",
          total: record.total + fee,
          reason: "Cá của khách iu đang được tiếp tục được chăm sóc",
        };
        console.log("updateRecord ===>", updateRecord);
  
        // Kiểm tra số dư tài khoản và gia hạn nếu đủ
        if (user.accountBalance >= fee) {
          // Gọi API song song: cập nhật consignment và cập nhật số dư người dùng
          const [extendConsignmentRes, updateUserRes] = await Promise.all([
            updateConsignmentByID(updateRecord),
            editUser({ ...user, accountBalance: user.accountBalance - fee }),
          ]);
  
          if (extendConsignmentRes && updateUserRes) {
            message.success("Gia hạn thành công");
          }
        } else {
          message.error("Số dư tài khoản không đủ để gia hạn.");
        }
      } catch (error) {
        console.error("Lỗi khi gia hạn consignment:", error);
        message.error("Đã xảy ra lỗi trong quá trình gia hạn.");
      }
    } else {
      message.error("Không tìm thấy productID hoặc productComboID.");
    }
  };
  
  const handleExtendConsignment = (record) => {
    console.log(record)
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn gia hạn?',
      content: `Tổng phí gia hạn sẽ là ${record.total} VND. Bạn có chắc chắn muốn tiếp tục không?`,
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: () => handleOk(record),  // Gọi hàm handleOk khi người dùng nhấn OK
    });
  };
  
  // Thay đổi trạng thái cá
  const handleChangeStatus = async (consignment, productID, productComboID) => {
    try {
      let updatedProduct = null;
      // Nếu có productID, lấy thông tin sản phẩm
      if (productID) {
        console.log(productID);
        const product = await fetchProductById(productID);
        if (product) {
          updatedProduct = {
            ...product,
            status: "Đã hủy",
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
            status: "Đã hủy",
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
          if (productRes) {
            console.log("Thành công");
          }
        } catch (error) {
          console.error("Lỗi khi cập nhật sản phẩm:", error);
          message.error("Có lỗi xảy ra khi cập nhật sản phẩm.");
        }
      }
      const refundAmount = consignment.total; // Assuming 'total' is the amount to be refunded
      const updatedUserBalance = user.accountBalance + refundAmount;

      // Create an updated user object with the new balance
      const updatedUser = { ...user, accountBalance: updatedUserBalance };

      // Call the API to update the user's balance
      const userRes = await editUser(updatedUser);
      console.log(consignment.consignmentID);
      const refund = await refundConsignmentSell(consignment.consignmentID);
      if (userRes && refund) {
        message.success(`Hoàn tiền thành công: ${refundAmount} VND`);
      } else {
        message.error("Không thể hoàn tiền vào ví của bạn.");
      }
      const newStatus = "Đã hủy";
      const currentDate = new Date().toISOString();
      console.log(consignment);
      const updatedConsignment = {
        ...consignment,
        status: newStatus,
        saleDate: currentDate,
        total: 0,
      };
      console.log(updatedConsignment);

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
        {loading ? (
          <Spin size="large" />
        ) : (
          <Tabs
            defaultActiveKey="1"
            style={{ marginLeft: 20, marginBottom: 20 }}
          >
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
                    consignment.consignmentType.includes("Ký gửi để bán")
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
