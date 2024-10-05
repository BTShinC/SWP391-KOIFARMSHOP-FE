import PropTypes from "prop-types";
import React from "react";
import { Button } from "antd";
import { useState } from "react";
import "./index.scss";
ConsignmentTable.propTypes = {
  consignmentData: PropTypes.arrayOf(PropTypes.object).isRequired,
  renderAction: PropTypes.func,
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
};

function ConsignmentTable({ consignmentData, renderAction, columns }) {
  const [showDetail, setShowDetail] = useState(null);

  const handleViewDetail = (id) => {
    setShowDetail((prev) => (prev === id ? null : id));
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
          {consignmentData.map((fish, index) => (
            <React.Fragment key={fish.koiConsignmentID || index}>
              <tr>
                <td>{fish.koiConsignmentID}</td>
                <td>{fish.breed}</td>
                <td>{fish.size}</td>
                <td>{fish.sex}</td>
                <td>{fish.healthStatus}</td>
                <td>{fish.type}</td>
                <td>{fish.status}</td>
                <td className="btn-container">
                  <Button
                    onClick={() => handleViewDetail(fish.koiConsignmentID)}
                  >
                    {showDetail === fish.koiConsignmentID
                      ? "Ẩn chi tiết"
                      : "Xem chi tiết"}
                  </Button>
                  {renderAction &&
                   (renderAction(fish)) }
                </td>
              </tr>
              {showDetail === fish.koiConsignmentID && (
                <tr>
                  <td colSpan={7}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: "1rem",
                      }}
                    >
                      {/* Phần văn bản */}
                      <div>
                        <p>
                          <strong>Tính cách:</strong> {fish.personalityTrait}
                        </p>
                        <p>
                          <strong>Nguồn gốc:</strong> {fish.origin}
                        </p>
                        <p>
                          <strong>Mô tả:</strong> {fish.description}
                        </p>
                        <p>
                          <strong>Chứng nhận:</strong> {fish.certificate}
                        </p>
                        {fish.type != "chăm sóc" && (
                          <p>
                            <strong>Giá bán:</strong> {fish.desiredPrice}
                          </p>
                        )}
                        {fish.type === "chăm sóc" && (
                          <p>
                            <strong>Mã ký gửi:</strong> {fish.carePackageID}
                          </p>
                        )}
                      </div>
                      {fish.certificate && (
                        <div
                          style={{
                            flexShrink: 0,
                            display: "flex",
                            gap: "1rem",
                          }}
                        >
                          <p>
                            <strong>Ảnh chứng nhận:</strong>
                          </p>
                          <img
                            src={fish.certificateUrl}
                            alt="Fish"
                            style={{ maxWidth: "200px", borderRadius: "8px" }}
                          />
                        </div>
                      )}
                      {/* Hình ảnh */}
                      {fish.image && (
                        <div
                          style={{
                            flexShrink: 0,
                            display: "flex",
                            gap: "1rem",
                          }}
                        >
                          <p>
                            <strong>Ảnh cá:</strong>
                          </p>
                          <img
                            src={fish.imageUrl}
                            alt="Fish"
                            style={{ maxWidth: "200px", borderRadius: "8px" }}
                          />
                        </div>
                      )}
                    </div>
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
