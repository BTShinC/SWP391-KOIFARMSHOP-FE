import { Button, Spin } from "antd";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import "./index.scss";
import {
  fetchProductById,
  fetchProductComboById,
} from "../../../../service/userService"; // API lấy thông tin sản phẩm và combo
import ChangeStatusConsignment from "../../../../components/changeStatusConsignment";

ConsignmentTable.propTypes = {
  consignmentData: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
};

function ConsignmentTable({ consignmentData, columns }) {
  const [consignmentTypes, setConsignmentTypes] = useState({}); // Lưu loại ký gửi cho từng consignmentID
  const [showDetail, setShowDetail] = useState(null); // Để theo dõi trạng thái hiển thị chi tiết
  const [productDetails, setProductDetails] = useState(null); // Chi tiết sản phẩm hoặc combo
  const [loading, setLoading] = useState(false);

  // Hàm xác định loại ký gửi
  const determineConsignmentType = async (productID, productComboID) => {
    try {
      let product;
      if (productComboID) {
        // Nếu có productComboID, gọi API để lấy thông tin combo
        product = await fetchProductComboById(productComboID);
      } else if (productID) {
        // Nếu không có productComboID, gọi API để lấy thông tin sản phẩm
        product = await fetchProductById(productID);
      }

      if (product?.carePackageID) {
        return "chăm sóc";
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin sản phẩm hoặc combo:", error);
    }
    return "ký gửi để bán";
  };

  // Gọi API để lấy loại ký gửi cho tất cả các consignment ngay khi bảng được hiển thị
  useEffect(() => {
    const fetchConsignmentTypes = async () => {
      setLoading(true);
      const newConsignmentTypes = {};

      for (const consignment of consignmentData) {
        const productIdToFetch =
          consignment.productID || consignment.productComboID;
        if (productIdToFetch) {
          const consignmentType = await determineConsignmentType(
            consignment.productID,
            consignment.productComboID
          );
          newConsignmentTypes[consignment.consignmentID] = consignmentType;
        }
      }

      setConsignmentTypes(newConsignmentTypes); // Lưu tất cả consignmentType vào state
      setLoading(false);
    };

    fetchConsignmentTypes();
  }, [consignmentData]);

  // Hàm xử lý khi nhấn nút "Xem chi tiết"
  const handleViewDetail = async (id, productID, productComboID) => {
    setShowDetail((prev) => (prev === id ? null : id)); // Toggle hiển thị chi tiết

    const productIdToFetch = productID || productComboID;
    if (productIdToFetch) {
      setLoading(true);
      try {
        let res;
        if (productComboID) {
          res = await fetchProductComboById(productComboID);
        } else {
          res = await fetchProductById(productID);
        }

        setProductDetails(res); // Lưu chi tiết sản phẩm hoặc combo
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="consignment-table">
      <div>
        <h2 className="">Quản lý ký gửi</h2>
      </div>
      <table>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {consignmentData.map((consignment, index) => (
            <React.Fragment key={consignment.consignmentID || index}>
              <tr>
                <td>{consignment.consignmentID}</td>
                <td>{consignment.consignmentDate || "N/A"}</td>
                <td>{consignment.dateReceived || "N/A"}</td>
                <td>{consignment.dateExpiration || "N/A"}</td>
                <td>{consignment.productComboID || consignment.productID}</td>
                <td>{consignment.accountID || "N/A"}</td>
                <td>
                  {loading ? (
                    <Spin />
                  ) : (
                    consignmentTypes[consignment.consignmentID] ||
                    "N/A" /* Hiển thị consignmentType đã tính */
                  )}
                </td>
                <td>{consignment.status || "N/A"}</td>
                <td className="btn-container">
                  <Button
                    onClick={() =>
                      handleViewDetail(
                        consignment.consignmentID,
                        consignment.productID,
                        consignment.productComboID
                      )
                    }
                  >
                    {showDetail === consignment.consignmentID
                      ? "Ẩn chi tiết"
                      : "Xem chi tiết"}
                  </Button>
                  {/* Truyền consignmentID, productID và productComboID vào ChangeStatusConsignment */}
                  <ChangeStatusConsignment
                    data={consignment}
                    consignmentID={consignment.consignmentID}
                    productID={consignment.productID}
                    productComboID={consignment.productComboID}
                  />
                </td>
              </tr>

              {/* Hiển thị chi tiết sản phẩm khi nhấn "Xem chi tiết" */}
              {showDetail === consignment.consignmentID && (
                <tr>
                  <td colSpan={8}>
                    {loading ? (
                      <Spin />
                    ) : productDetails ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          gap: "1rem",
                        }}
                      >
                        <div>
                          <div>
                            <p>
                              <strong>Tên sản phẩm:</strong>{" "}
                              {productDetails.productName ||
                                productDetails.comboName}
                            </p>
                            <p>
                              <strong>Mô tả:</strong>{" "}
                              {productDetails.description || "N/A"}
                            </p>
                            <p>
                              <strong>Gói chăm sóc:</strong>{" "}
                              {productDetails.carePackageID || "N/A"}
                            </p>
                            <p>
                              <strong>Giá bán:</strong>{" "}
                              {productDetails.price !== undefined &&
                              productDetails.price !== null
                                ? `${new Intl.NumberFormat("vi-VN").format(
                                    productDetails.desiredPrice
                                  )} VNĐ`
                                : "Không có giá"}
                            </p>
                            <p>
                              <strong>Hình ảnh:</strong>{" "}
                              {productDetails.image ? (
                                <img
                                  src={productDetails.image}
                                  alt="Hình ảnh sản phẩm"
                                  style={{
                                    display:"flex",
                                    width: "150px",
                                    height: "auto",
                                    borderRadius: "8px",
                                  }}
                                />
                              ) : (
                                "Không có hình ảnh"
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p>Không tìm thấy chi tiết sản phẩm</p>
                    )}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ConsignmentTable;
