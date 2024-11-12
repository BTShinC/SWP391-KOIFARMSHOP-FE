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
  Input,
  Checkbox,
} from "antd";
import { addDays, format, isValid } from "date-fns";
import api from "../../config/api";
import "./index.scss";
import {
  createTransaction,
  editUser,
  fetchAllCareDetail,
  fetchCarePackageByID,
  fetchProductById,
  fetchProductComboById,
  // refundConsignmentTotal,
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

        const date = new Date(dateString); // Tạo đối tượng Date từ dateString

        if (!isValid(date)) return "Ngày không hợp lệ"; // Kiểm tra tính hợp lệ của ngày

        return format(date, "dd/MM/yyyy"); // Định dạng ngày theo kiểu DD/MM/YYYY
      },
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "dateExpiration",
      key: "dateExpiration",
      render: (dateString) => {
        if (!dateString) return "N/A"; // Kiểm tra nếu giá trị null hoặc undefined

        const date = new Date(dateString); // Tạo đối tượng Date từ dateString

        if (!isValid(date)) return "Ngày không hợp lệ"; // Kiểm tra tính hợp lệ của ngày

        return format(date, "dd/MM/yyyy"); // Định dạng ngày theo kiểu DD/MM/YYYY
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
          <div className="btn-container">
            {/* Nút "Xem tình hình cá" luôn hiển thị */}
            {record.status != "Chờ xác nhận" && (
              <button
                className="btn-edit-consignment"
                onClick={() => handleViewCareFish(record)}
              >
                Xem tình hình cá
              </button>
            )}
            {/* Nút "Gia hạn" chỉ hiển thị khi trạng thái là "Hoàn tất" */}
            {(() => {
              const currentDate = new Date(); // Ngày hiện tại
              const expirationDate = new Date(record.dateExpiration); // Ngày đáo hạn

              // Tính ngày trước 3 ngày so với ngày đáo hạn
              const threeDaysBeforeExpiration = new Date(expirationDate);
              threeDaysBeforeExpiration.setDate(expirationDate.getDate() - 3);

              // So sánh ngày hiện tại với ngày trước 3 ngày
              if (
                currentDate >= threeDaysBeforeExpiration &&
                currentDate < expirationDate &&
                record.status === "Đang chăm sóc"
              ) {
                return (
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
                );
              }

              return null;
            })()}

            {/* Nút "Rút cá" chỉ hiển thị khi trạng thái khác "Chờ xác nhận" và "Hoàn tất" */}
            {record.status === "Đang chăm sóc" && (
              <button
                className="btn-edit-consignment"
                onClick={() => warning(record)}
              >
                Rút cá
              </button>
            )}
          </div>
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
      title: "Ngày hết hạn",
      dataIndex: "dateExpiration",
      key: "dateExpiration",
      render: (dateString) => {
        if (!dateString) return "N/A"; // Kiểm tra nếu giá trị null hoặc undefined

        const date = new Date(dateString); // Tạo đối tượng Date từ dateString

        if (!isValid(date)) return "Ngày không hợp lệ"; // Kiểm tra tính hợp lệ của ngày

        return format(date, "dd/MM/yyyy"); // Định dạng ngày theo kiểu DD/MM/YYYY
      },
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
        // const consignmentDate = new Date(record.consignmentDate);
        const currentDate = new Date();
        const expirationDate = new Date(record.dateExpiration);

        // const daysDifference = Math.floor(
        //   (currentDate - consignmentDate) / (1000 * 60 * 60 * 24)
        // );

        // // Tính ngày trước 3 ngày so với ngày đáo hạn
        const threeDaysBeforeExpiration = new Date(expirationDate);
        threeDaysBeforeExpiration.setDate(expirationDate.getDate() - 3);

        // // Hiển thị nút "Rút cá" nếu trạng thái là "Chờ xác nhận" và đã qua 3 ngày
        // if (record.status === "Chờ xác nhận" && daysDifference >= 3) {
        //   return (
        //     <button
        //       className="btn-edit-consignment"
        //       onClick={() =>
        //         handleChangeStatus(
        //           record,
        //           record.productID,
        //           record.productComboID
        //         )
        //       }
        //     >
        //       Rút cá
        //     </button>
        //   );
        // }
        // Hiển thị thông báo chờ nếu dưới 3 ngày để rút cá
        //  if (record.status === "Chờ xác nhận" && daysDifference < 3) {
        //   return (
        //     <button className="btn-edit-consignment" disabled>
        //       Chờ thêm {3 - daysDifference} ngày để rút
        //     </button>
        //   );
        // }
        // Nếu còn 3 ngày trước ngày đáo hạn thì hiển thị nút "Gia hạn"
        if (
          currentDate >= threeDaysBeforeExpiration &&
          currentDate < expirationDate &&
          record.status === "Đang tiến hành"
        ) {
          return (
            <button
              className="btn-edit-consignment"
              onClick={() => info(record)}
            >
              Gia hạn
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
      console.log("Gia hạn consignment:", record);

      // Lấy ngày hiện tại và ngày hết hạn
      const consignmentDate = new Date(record.dateExpiration).toISOString();
      const dateExpiration = addDays(
        consignmentDate,
        record.duration
      ).toISOString();
      let reason = null;
      let status = null;
      if (user.accountBalance < fee) {
        message.error("Số dư tài khoản không đủ để gia hạn.");
        return;
      }

      if (record.consignmentType === "Ký gửi chăm sóc") {
        reason = "Cá của khách iu đang được tiếp tục được chăm sóc";
        status = "Đang chăm sóc";
      } else {
        reason =
          "Cá đang được đăng để bán. Vui lòng kiểm tra thường xuyên để cập nhật tình hình cá";
        status = "Đang tiến hành";
      }
      // Cập nhật thông tin record nếu đủ số dư
      const updateRecord = {
        ...record,
        consignmentDate: consignmentDate,
        dateReceived: format(new Date(), "yyyy-MM-dd"),
        dateExpiration: dateExpiration,
        status: status,
        total: record.total + fee,
        reason: reason,
      };
      console.log("updateRecord ===>", updateRecord);

      // Gọi API song song: cập nhật consignment và cập nhật số dư người dùng
      const [extendConsignmentRes, updateUserRes] = await Promise.all([
        updateConsignmentByID(updateRecord),
        editUser({ ...user, accountBalance: user.accountBalance - fee }),
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

  const handleExtendConsignment = async (record, days) => {
    console.log(record);

    let carePackageID = null;
    let carePackage = null;
    let fee = 0;
    let selectedProduct = null;

    if (record.productID || record.productComboID) {
      try {
        const [productRes, productComboRes] = await Promise.all([
          record.productID ? fetchProductById(record.productID) : null,
          record.productComboID
            ? fetchProductComboById(record.productComboID)
            : null,
        ]);

        if (productRes) {
          selectedProduct = productRes;
          carePackageID = productRes.carePackageID;
          setIsCombo(false);
        } else if (productComboRes) {
          selectedProduct = productComboRes;
          carePackageID = productComboRes.carePackageID;
          setIsCombo(true);
        }

        if (carePackageID) {
          const carePackageRes = await fetchCarePackageByID(carePackageID);
          if (carePackageRes) {
            fee = carePackageRes?.data?.price || 0;
            carePackage = carePackageRes?.data;
          }
        }
        if (record.consignmentType === "Ký gửi để bán" && days) {
          let finalData = {
            ...productRes,
            duration: days,
          };
          fee = countFee(finalData);
        }

        Modal.confirm({
          title: "Bạn có chắc chắn muốn gia hạn?",
          content: (
            <div>
              <p>Tên sản phẩm: {carePackage?.packageName}</p>
              {record.consignmentType === "Ký gửi chăm sóc" && (
                <p>Loại: {isCombo ? "Chăm sóc lô" : "Chăm sóc cá thể"}</p>
              )}
              {record.consignmentType === "Ký gửi để bán" && (
                <p>Loại: {isCombo ? "Ký gửi bán lô" : "Ký gửi bán cá thể"}</p>
              )}
              <p>
                Tổng phí gia hạn:
                <strong>
                  {new Intl.NumberFormat("vi-VN").format(fee)} VNĐ
                </strong>
              </p>
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

  // // Thay đổi trạng thái cá
  // const handleChangeStatus = async (consignment, productID, productComboID) => {
  //   try {
  //     let updatedProduct = null;

  //     // Kiểm tra và cập nhật productID hoặc productComboID
  //     if (productID || productComboID) {
  //       const product = productID
  //         ? await fetchProductById(productID)
  //         : await fetchProductComboById(productComboID);

  //       if (product) {
  //         updatedProduct = { ...product, status: "Đã hủy" };
  //       } else {
  //         message.error(
  //           productID
  //             ? "Không thể lấy thông tin sản phẩm."
  //             : "Không thể lấy thông tin combo sản phẩm."
  //         );
  //         return;
  //       }

  //       const productEndpoint = productID
  //         ? `/product/${productID}`
  //         : `/productcombo/${productComboID}`;

  //       try {
  //         // Gửi yêu cầu cập nhật sản phẩm hoặc combo sản phẩm
  //         const productRes = await api.put(productEndpoint, updatedProduct);
  //         if (
  //           productRes &&
  //           productRes.status >= 200 &&
  //           productRes.status < 300
  //         ) {
  //           console.log("Cập nhật sản phẩm thành công");
  //         } else {
  //           message.error("Cập nhật sản phẩm thất bại.");
  //           return;
  //         }
  //       } catch (error) {
  //         console.error("Lỗi khi cập nhật sản phẩm:", error);
  //         message.error("Có lỗi xảy ra khi cập nhật sản phẩm.");
  //         return;
  //       }
  //     }

  //     // Hoàn tiền vào tài khoản người dùng
  //     const refundAmount = consignment.total;
  //     const updatedUserBalance = user.accountBalance + refundAmount;
  //     const updatedUser = { ...user, accountBalance: updatedUserBalance };

  //     const userRes = await editUser(updatedUser);

  //     const refund = await refundConsignmentTotal(consignment.consignmentID);

  //     if (userRes && refund) {
  //       message.success(`Hoàn tiền thành công: ${refundAmount} VND`);
  //       setRefreshKey((prev) => prev + 1);
  //     } else {
  //       message.error("Không thể hoàn tiền vào ví của bạn.");
  //       return;
  //     }

  //     // Cập nhật trạng thái của consignment
  //     const updatedConsignment = {
  //       ...consignment,
  //       status: "Đã hủy",
  //       total: 0, // Xóa giá trị total sau khi hoàn tiền
  //     };

  //     const consignmentRes = await updateConsignmentByID(updatedConsignment);
  //     if (consignmentRes) {
  //       message.success(`Cập nhật trạng thái đơn ký gửi thành công.`);

  //       // Tạo transaction để lưu lại lịch sử hoàn tiền
  //       const transactionData = {
  //         accountID: user.accountID,
  //         price: refundAmount,
  //         date: new Date(),
  //         description: `Hoàn tiền đơn ${consignment.consignmentID}`,
  //       };

  //       const transactionRes = await createTransaction(transactionData);
  //       if (transactionRes) {
  //         message.success("Lưu transaction thành công");
  //       } else {
  //         message.error("Lưu transaction thất bại.");
  //       }

  //       // Cập nhật trạng thái sản phẩm sau khi đơn ký gửi đã hủy
  //       if (updatedProduct) {
  //         const updatedProductStatus = {
  //           ...updatedProduct,
  //           status: "Hết hàng",
  //         };
  //         const productEndpoint = productID
  //           ? `/product/${productID}`
  //           : `/productcombo/${productComboID}`;

  //         try {
  //           const productRes = await api.put(
  //             productEndpoint,
  //             updatedProductStatus
  //           );
  //           if (
  //             productRes &&
  //             productRes.status >= 200 &&
  //             productRes.status < 300
  //           ) {
  //             message.success("Cập nhật trạng thái sản phẩm thành công.");
  //           } else {
  //             message.error("Cập nhật trạng thái sản phẩm thất bại.");
  //           }
  //         } catch (error) {
  //           console.error("Lỗi khi cập nhật trạng thái sản phẩm:", error);
  //           message.error("Có lỗi xảy ra khi cập nhật trạng thái sản phẩm.");
  //         }
  //       }
  //     } else {
  //       message.error("Cập nhật trạng thái đơn ký gửi thất bại.");
  //     }
  //   } catch (error) {
  //     console.error("Error updating status:", error);
  //     message.error("Có lỗi xảy ra khi cập nhật trạng thái.");
  //   }
  // };

  const handleReturnCareFish = async (consignment) => {
    try {
      // Chuẩn bị dữ liệu để cập nhật trạng thái consignment
      const updatedConsignmentData = {
        ...consignment,
        consignmentDate: format(new Date(), "yyyy-MM-dd"),
        status: "Yêu cầu hoàn trả",
      };
      console.log(updatedConsignmentData);
      // Gửi yêu cầu cập nhật trạng thái consignment
      const consignmentRes = await updateConsignmentByID(
        updatedConsignmentData
      );
      if (!consignmentRes)
        throw new Error("Cập nhật trạng thái đơn ký gửi thất bại");
      message.success("Đã gửi yêu cầu hoàn trả");
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

  const countFee = (finalData) => {
    let fee = 0;

    if (finalData?.quantity) {
      if (finalData?.quantity <= 10 && finalData?.size <= 40) {
        fee = finalData?.duration * 20000;
      } else if (finalData?.quantity <= 20 && finalData?.size <= 40) {
        fee = finalData?.duration * 40000;
      } else if (finalData?.quantity <= 10 && finalData?.size > 40) {
        fee = finalData?.duration * 60000;
      } else {
        fee = finalData?.duration * 90000;
      }
    } else {
      if (finalData.size <= 40) {
        fee =
          finalData?.duration <= 60
            ? 50000 * finalData?.duration
            : 25000 * finalData?.duration;
      } else {
        fee =
          finalData?.duration <= 60
            ? 90000 * finalData?.duration
            : 70000 * finalData?.duration;
      }
    }

    return fee;
  };
  {
    /* Modal để người dùng nhập ngày muốn gia hạn */
  }
  const info = (record) => {
    let days = 0; // Sử dụng biến cục bộ

    Modal.info({
      title: "Gia hạn dịch vụ ký gửi bán",
      centered: true, // Căn giữa Modal
      content: (
        <div>
          <p>Vui lòng nhập số ngày cần gia hạn:</p>
          <Input
            type="number"
            min={1}
            placeholder="Nhập số ngày"
            defaultValue={days}
            onChange={(e) => {
              days = e.target.value;
              console.log("Ngày cần gia hạn: ", days);
            }}
          />
        </div>
      ),
      onOk() {
        console.log("Số ngày cần gia hạn khi nhấn OK: ", days);
        handleExtendConsignment(record, days);
      },
    });
  };

  const warning = (record) => {
    let isChecked = false; // Sử dụng biến cục bộ để lưu trạng thái checkbox

    Modal.warning({
      title: "Lưu ý về ký gửi chăm sóc",
      centered: true,
      content: (
        <div>
          <div style={{ marginTop: "16px" }}>
            <h3>Điều khoản dịch vụ ký gửi chăm sóc:</h3>
            <ul>
              <li>
                Shop cần từ 1 đến 3 ngày để chuẩn bị khi khách hàng rút cá.
              </li>
              <li>
                Chi phí dịch vụ sẽ không được hoàn lại khi bạn quyết định rút cá
                trong quá trình chăm sóc.
              </li>
            </ul>
            <Checkbox
              style={{ marginTop: "10px" }}
              onChange={(e) => {
                isChecked = e.target.checked; // Cập nhật biến cục bộ khi checkbox thay đổi
                console.log("Trạng thái checkbox: ", isChecked);
              }}
            >
              Tôi đồng ý với các điều khoản trên
            </Checkbox>
          </div>
        </div>
      ),
      onOk() {
        if (!isChecked) {
          message.error("Bạn phải đồng ý với các điều khoản để tiếp tục.");
          return false; // Ngăn không cho đóng modal nếu chưa chọn checkbox
        }

        console.log("Người dùng đã đồng ý với các điều khoản");
        handleReturnCareFish(record, record.productID, record.productComboID); // Gọi hàm xử lý khi người dùng đồng ý
      },
    });
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
                    Ngày cập nhật:
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
