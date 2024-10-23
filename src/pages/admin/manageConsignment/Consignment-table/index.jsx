import { Button, Spin } from "antd";
import PropTypes from "prop-types";
import { format } from "date-fns";
import React, { useState } from "react";
import "./index.scss";
import {
  fetchProductById,
  fetchProductComboById,
} from "../../../../service/userService";
import ChangeStatusConsignment from "../../../../components/changeStatusConsignment";

ConsignmentTable.propTypes = {
  consignmentData: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func,
};

function ConsignmentTable({ consignmentData, columns, onChange }) {
  const [showDetail, setShowDetail] = useState(null);
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  // Hàm xử lý khi nhấn nút "Xem chi tiết"
  const handleViewDetail = async (id, productID, productComboID) => {
    setShowDetail((prev) => (prev === id ? null : id));

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

        setProductDetails(res);
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
                <td>
                  {consignment.consignmentDate
                    ? format(
                        new Date(consignment.consignmentDate),
                        "dd/MM/yyyy"
                      )
                    : "N/A"}
                </td>

                <td>{consignment.dateReceived || "N/A"}</td>
                <td>{consignment.dateExpiration || "N/A"}</td>
                <td>
                  {consignment.saleDate
                    ? format(new Date(consignment.saleDate), "dd/MM/yyyy")
                    : "N/A"}
                </td>
                <td>{consignment.productComboID || consignment.productID}</td>
                <td>
                  {new Intl.NumberFormat("vi-VN").format(
                    consignment?.total || 0
                  )}
                  VNĐ
                </td>
                <td>{consignment.consignmentType}</td>
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
                  <ChangeStatusConsignment
                    data={consignment}
                    consignmentID={consignment.consignmentID}
                    productID={consignment.productID}
                    productComboID={consignment.productComboID}
                    onChange={onChange}
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
                            {!productDetails.carePackageID &&
                              consignment.farmName && (
                                <a
                                  href={consignment.farmName}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <strong>
                                    Link dẫn tới trang trại của bạn:{" "}
                                  </strong>
                                  {consignment.farmName}
                                </a>
                              )}

                            <p>
                              <strong>Tên sản phẩm:</strong>
                              {productDetails.productName ||
                                productDetails.comboName}
                            </p>
                            <p>
                              <strong>Mô tả:</strong>
                              {productDetails.description || "N/A"}
                            </p>
                            <p>
                              <strong>Gói chăm sóc:</strong>
                              {productDetails.carePackageID || "N/A"}
                            </p>
                            {!productDetails.carePackageID && (
                              <>
                                <p>
                                  <strong>Giá bán: </strong>
                                  {productDetails.price !== undefined &&
                                  productDetails.price !== null
                                    ? `${new Intl.NumberFormat("vi-VN").format(
                                        productDetails.desiredPrice
                                      )} VNĐ`
                                    : "Không có giá"}
                                </p>
                                <p>
                                  <strong>Giá bán khách mong đợi: </strong>
                                  {productDetails.desiredPrice !== undefined &&
                                  productDetails.desiredPrice !== null
                                    ? `${new Intl.NumberFormat("vi-VN").format(
                                        productDetails.desiredPrice
                                      )} VNĐ`
                                    : "Không có giá"}
                                </p>
                              </>
                            )}
                            <p>
                              <strong>Hình ảnh:</strong>
                              {productDetails.image ? (
                                <img
                                  src={productDetails.image}
                                  alt="Hình ảnh sản phẩm"
                                  style={{
                                    display: "flex",
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
