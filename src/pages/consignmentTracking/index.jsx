import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Card,
  Spin,
  message,
  Collapse,
  Table,
  Tabs,
  Modal,
  Button,
} from "antd";

import { addDays, format } from "date-fns";
import api from "../../config/api";
import "./index.scss";
import {
  createTransaction,
  editComboInfo,
  editFishInfo,
  editUser,
  fetchAllCareDetail,
  fetchCarePackageByID,
  fetchProductById,
  fetchProductComboById,
  refundConsignmentTotal,
  updateConsignmentByID,
} from "../../service/userService";
import { toast } from "react-toastify";

const { Panel } = Collapse;
const { TabPane } = Tabs;

function ConsignmentTracking() {
  const [consignments, setConsignments] = useState([]);
  const [consignmentDetailsMap, setConsignmentDetailsMap] = useState({});
  const [refreshKey, setRefreshKey] = useState(0); // State để lưu key và cập nhật khi có thay đổi
  const [loading, setLoading] = useState(true);
  const [isCombo, setIsCombo] = useState(false);
  const [selectedCareDetail, setSelectedCareDetail] = useState([]); // Dữ liệu để hiển thị modal
  const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái của modal
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user && (user.accountID || user.accountId)) {
      fetchConsignments();
    }
  }, [user, refreshKey]);

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
        const productResponse = await api.get(`/product/get/${productID}`);
        console.log("Product Response:", productResponse.data); // Log product response
        image = productResponse.data.image;
      } else if (productComboID) {
        const comboResponse = await api.get(
          `/productcombo/get/${productComboID}`
        );

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
      title: "Ngày đặt đơn",
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
        if (!dateString) return "N/A"; // Kiểm tra nếu giá trị null hoặc undefined
        const date = new Date(dateString);
        return date.toLocaleDateString();
      },
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "dateExpiration",
      key: "dateExpiration",
      render: (dateString) => {
        if (!dateString) return "N/A"; // Kiểm tra nếu giá trị null hoặc undefined
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
        return (
          <>
            {/* Nút "Xem tình hình cá" luôn hiển thị */}
            <button
              className="btn-edit-consignment"
              onClick={() => handleViewCareFish(record)}
            >
              Xem tình hình cá
            </button>

            {/* Nút "Gia hạn" chỉ hiển thị khi trạng thái là "Hoàn tất" */}
            {record.status === "Hoàn tất" && (
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
            )}

            {/* Nút "Rút cá" chỉ hiển thị khi trạng thái khác "Chờ xác nhận" và "Hoàn tất" */}
            {record.status !== "Chờ xác nhận" &&
              record.status !== "Hoàn tất" && (
                <button
                  className="btn-edit-consignment"
                  onClick={() =>
                    handleReturnCareFish(
                      record,
                      record.productID,
                      record.productComboID
                    )
                  }
                >
                  Rút cá
                </button>
              )}
          </>
        );
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
    {
      title: "Giá bán",
      dataIndex: "salePrice",
      key: "salePrice",
      render: (salePrice) =>
        `${new Intl.NumberFormat("vi-VN").format(salePrice)}VNĐ`,
    },
    {
      title: "Ngày bán",
      dataIndex: "saleDate",
      key: "saleDate",
      render: (dateString) => {
        if (!dateString) {
          return "N/A"; // Trả về N/A nếu không có ngày bán
        }
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Trả về ngày ở định dạng locale
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

  const handleOk = async (record, fee) => {
    try {
      console.log(
        "Gia hạn consignment:",
        record,
        record.productComboID,
        record.productID
      );

      // Lấy ngày hiện tại và ngày hết hạn
      const consignmentDate = record.dateExpiration;
      const dateExpiration = addDays(consignmentDate, record.duration);

      // **Check account balance before proceeding**
      if (user.accountBalance < fee) {
        message.error("Số dư tài khoản không đủ để gia hạn.");
        return; // Stop execution if balance is insufficient
      }

      // Cập nhật thông tin record nếu đủ số dư
      const updateRecord = {
        ...record,
        consignmentDate: format(consignmentDate, "dd-MM-yyyy"),
        dateReceived: format(consignmentDate, "dd-MM-yyyy"),
        dateExpiration: format(dateExpiration, "dd-MM-yyyy"),
        status: "Đang chăm sóc",
        total: record.total + fee,
        reason: "Cá của khách iu đang được tiếp tục được chăm sóc",
      };
      console.log("updateRecord ===>", updateRecord);

      // Gọi API song song: cập nhật consignment và cập nhật số dư người dùng
      const [extendConsignmentRes, updateUserRes] = await Promise.all([
        updateConsignmentByID(updateRecord), // Update consignment
        editUser({ ...user, accountBalance: user.accountBalance - fee }), // Deduct fee from user's balance
      ]);

      if (extendConsignmentRes && updateUserRes) {
        // Tạo transaction
        const transactionData = {
          accountID: user.accountID,
          price: fee,
          date: new Date(),
          description: `Phí gia hạn đơn ${record.consignmentID}`,
        };

        const transactionRes = await createTransaction(transactionData); // Record transaction
        if (transactionRes) {
          toast.success("Thanh toán thành công");
        } else {
          throw new Error("Lưu transaction thất bại");
        }

        message.success("Gia hạn thành công");
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Lỗi khi gia hạn consignment:", error);
      message.error("Đã xảy ra lỗi trong quá trình gia hạn.");
    }
  };

  const handleExtendConsignment = async (record) => {
    console.log(record);

    let carePackageID = null;
    let fee = 0;
    let selectedProduct = null;
    if (record.productID || record.productComboID) {
      try {
        // Fetch product and product combo in parallel
        const [productRes, productComboRes] = await Promise.all([
          record.productID ? fetchProductById(record.productID) : null,
          record.productComboID
            ? fetchProductComboById(record.productComboID)
            : null,
        ]);

        // Determine whether to use the product or combo and set isCombo accordingly
        if (productRes) {
          selectedProduct = productRes;
          carePackageID = productRes.carePackageID;
          setIsCombo(false); // It's a single product, not a combo
        } else if (productComboRes) {
          selectedProduct = productComboRes;
          carePackageID = productComboRes.carePackageID;
          setIsCombo(true); // It's a combo
        }

        // Fetch care package details if carePackageID is found
        if (carePackageID) {
          const carePackageRes = await fetchCarePackageByID(carePackageID);
          if (carePackageRes) {
            fee = carePackageRes?.data?.price || 0; // Get fee from care package
          }
        }

        // Show confirmation modal with fee and product/combo information
        Modal.confirm({
          title: "Bạn có chắc chắn muốn gia hạn?",
          content: (
            <div>
              <p>
                Tên sản phẩm:
                {selectedProduct.name || selectedProduct.comboName}
              </p>
              <p>Loại: {isCombo ? "Combo" : "Sản phẩm đơn"}</p>
              {/* Display combo or product */}
              <p>Tổng phí gia hạn: {fee} VND</p>
              <p>Bạn có chắc chắn muốn tiếp tục không?</p>
            </div>
          ),
          okText: "Xác nhận",
          cancelText: "Hủy",
          onOk: () => handleOk(record, fee, selectedProduct, isCombo), // Pass isCombo to handleOk
        });
      } catch (error) {
        console.error("Lỗi khi xử lý gia hạn consignment:", error);
        message.error("Đã xảy ra lỗi trong quá trình lấy thông tin gia hạn.");
      }
    } else {
      message.error("Không tìm thấy productID hoặc productComboID.");
    }
  };

  // Thay đổi trạng thái cá
  const handleChangeStatus = async (consignment, productID, productComboID) => {
    try {
      let updatedProduct = null;

      // Kiểm tra và cập nhật productID hoặc productComboID
      if (productID || productComboID) {
        const product = productID
          ? await fetchProductById(productID)
          : await fetchProductComboById(productComboID);

        if (product) {
          updatedProduct = { ...product, status: "Đã hủy" };
        } else {
          message.error(
            productID
              ? "Không thể lấy thông tin sản phẩm."
              : "Không thể lấy thông tin combo sản phẩm."
          );
          return;
        }

        const productEndpoint = productID
          ? `/product/${productID}`
          : `/productcombo/${productComboID}`;

        try {
          // Gửi yêu cầu cập nhật sản phẩm hoặc combo sản phẩm
          const productRes = await api.put(productEndpoint, updatedProduct);
          if (
            productRes &&
            productRes.status >= 200 &&
            productRes.status < 300
          ) {
            console.log("Cập nhật sản phẩm thành công");
          } else {
            message.error("Cập nhật sản phẩm thất bại.");
            return;
          }
        } catch (error) {
          console.error("Lỗi khi cập nhật sản phẩm:", error);
          message.error("Có lỗi xảy ra khi cập nhật sản phẩm.");
          return;
        }
      }

      // Hoàn tiền vào tài khoản người dùng
      const refundAmount = consignment.total;
      const updatedUserBalance = user.accountBalance + refundAmount;
      const updatedUser = { ...user, accountBalance: updatedUserBalance };

      const userRes = await editUser(updatedUser);

      const refund = await refundConsignmentTotal(consignment.consignmentID);

      if (userRes && refund) {
        message.success(`Hoàn tiền thành công: ${refundAmount} VND`);
        setRefreshKey((prev) => prev + 1);
      } else {
        message.error("Không thể hoàn tiền vào ví của bạn.");
        return;
      }

      // Cập nhật trạng thái của consignment
      const updatedConsignment = {
        ...consignment,
        status: "Đã hủy",
        total: 0, // Xóa giá trị total sau khi hoàn tiền
      };

      const consignmentRes = await updateConsignmentByID(updatedConsignment);
      if (consignmentRes) {
        message.success(`Cập nhật trạng thái đơn ký gửi thành công.`);

        // Tạo transaction để lưu lại lịch sử hoàn tiền
        const transactionData = {
          accountID: user.accountID,
          price: refundAmount,
          date: new Date(),
          description: `Hoàn tiền đơn ${consignment.consignmentID}`,
        };

        const transactionRes = await createTransaction(transactionData);
        if (transactionRes) {
          message.success("Lưu transaction thành công");
        } else {
          message.error("Lưu transaction thất bại.");
        }

        // Cập nhật trạng thái sản phẩm sau khi đơn ký gửi đã hủy
        if (updatedProduct) {
          const updatedProductStatus = {
            ...updatedProduct,
            status: "Hết hàng",
          };
          const productEndpoint = productID
            ? `/product/${productID}`
            : `/productcombo/${productComboID}`;

          try {
            const productRes = await api.put(
              productEndpoint,
              updatedProductStatus
            );
            if (
              productRes &&
              productRes.status >= 200 &&
              productRes.status < 300
            ) {
              message.success("Cập nhật trạng thái sản phẩm thành công.");
            } else {
              message.error("Cập nhật trạng thái sản phẩm thất bại.");
            }
          } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái sản phẩm:", error);
            message.error("Có lỗi xảy ra khi cập nhật trạng thái sản phẩm.");
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

  const handleReturnCareFish = async (
    consignment,
    productID,
    productComboID
  ) => {
    try {
      // Xác định consignment cần cập nhật dựa trên productID hoặc productComboID

      // Chuẩn bị dữ liệu để cập nhật trạng thái consignment
      const updatedConsignmentData = {
        ...consignment,
        status: "Hoàn tất",
        saleDate: new Date(),
      };
      console.log(updatedConsignmentData);
      // Gửi yêu cầu cập nhật trạng thái consignment
      const consignmentRes = await updateConsignmentByID(
        updatedConsignmentData
      );
      if (!consignmentRes)
        throw new Error("Cập nhật trạng thái đơn ký gửi thất bại");

      message.success("Đơn ký gửi đã hoàn tất");

      // Cập nhật trạng thái cá đơn nếu có productID
      if (productID) {
        const productRes = await fetchProductById(productID);
        if (!productRes) throw new Error("Không tìm thấy cá đơn");

        const updatedFishData = {
          ...productRes,
          status: "Hoàn tất chăm sóc", // Trạng thái mới cho cá đơn
        };

        const editRes = await editFishInfo(updatedFishData);
        if (editRes && editRes.status === 200) {
          message.success("Cập nhật trạng thái cá đơn thành công!");
        } else {
          throw new Error("Cập nhật trạng thái cá đơn thất bại");
        }
      }

      // Cập nhật trạng thái combo cá nếu có productComboID
      if (productComboID) {
        const productComboRes = await fetchProductComboById(productComboID);
        if (!productComboRes) throw new Error("Không tìm thấy combo cá");

        const updatedComboData = {
          ...productComboRes,
          status: "Hoàn tất chăm sóc", // Trạng thái mới cho combo cá
        };

        const editComboRes = await editComboInfo(updatedComboData);
        if (editComboRes && editComboRes.status === 200) {
          message.success("Cập nhật trạng thái combo cá thành công!");
        } else {
          throw new Error("Cập nhật trạng thái combo cá thất bại");
        }
      }
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      message.error("Rút cá thất bại");
      console.error(error);
    }
  };

  const handleViewCareFish = async (record) => {
    let careDetailRes = await fetchAllCareDetail(record.consignmentID);
    if (careDetailRes) {
      setSelectedCareDetail(careDetailRes.data);
    } else {
      setSelectedCareDetail([]);
    }
    setIsModalVisible(true); // Hiển thị modal
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Đóng modal
    setSelectedCareDetail(null); // Reset dữ liệu
  };
  console.log(selectedCareDetail);
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
        {/* Modal hiển thị chi tiết tình hình chăm sóc */}
        <Modal
          title="Chi tiết tình hình chăm sóc"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={[
            <Button key="close" onClick={handleCancel}>
              Đóng
            </Button>,
          ]}
        >
          {selectedCareDetail && selectedCareDetail.length > 0 ? (
            <Collapse accordion>
              {selectedCareDetail.map((detail, index) => (
                <Panel header={`Cập nhật ${index + 1}`} key={index}>
                  <p>
                    Ngày cập nhật:{" "}
                    {new Date(detail.updateDate).toLocaleDateString()}
                  </p>

                  <p>Tình trạng: {detail.description}</p>
                  {detail.images && (
                    <img
                      src={detail.images}
                      alt={`Hình ảnh cập nhật ${index + 1}`}
                      style={{
                        width: "100%",
                        maxWidth: "200px",
                        height: "auto",
                      }}
                    />
                  )}
                </Panel>
              ))}
            </Collapse>
          ) : (
            <p>Không có chi tiết chăm sóc nào được tìm thấy.</p>
          )}
        </Modal>
      </div>
    </div>
  );
}

export default ConsignmentTracking;
