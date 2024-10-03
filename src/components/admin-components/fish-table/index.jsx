import React, { useState } from "react";
import { Button } from "antd";
import PropTypes from "prop-types";
import "./index.scss";
FishTable.propTypes = {
  columns: PropTypes.array.isRequired,
  fishData: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  ModalComponent: PropTypes.elementType.isRequired,
  onChange : PropTypes.func.isRequired
};

function FishTable({ columns, fishData, title, ModalComponent,onChange }) {
  const [showDetail, setShowDetail] = useState(null);

  const handleViewDetail = (id) => {
    setShowDetail((prev) => (prev === id ? null : id));
  };
  return (
    <div className="fish-table">
      <div>
        <h2 className="fish-table__title">{title}</h2>
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
          {fishData.map((fish, index) => (
            <React.Fragment key={fish.productID || index}>
              <tr>
                <td>{fish.productID}</td>
                <td>{fish.breed}</td>
                <td>{fish.size}</td>
                <td>{fish.sex}</td>
                <td>{fish.price} VND</td>
                <td>{fish.status}</td>
                <td className="btn-container">
                  <Button onClick={() => handleViewDetail(fish.productID)}>
                    {showDetail === fish.productID
                      ? "Ẩn chi tiết"
                      : "Xem chi tiết"}
                  </Button>
                  {ModalComponent && <ModalComponent onChange={onChange} fishData={fish} />}
                </td>
              </tr>
              {showDetail === fish.productID && (
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
                          <strong>Trạng thái sức khỏe:</strong>{" "}
                          {fish.healthStatus}
                        </p>
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
                          <strong>Chứng nhận:</strong>
                          {fish.certificate ? "Có" : "Không"}
                        </p>
                        <p>
                          <strong>Loại:</strong> {fish.type}
                        </p>
                        <p>
                          <strong>Mã ký gửi:</strong> {fish.koiConsignmentID}
                        </p>
                      </div>

                      {/* Hình ảnh */}
                      <div
                        style={{ flexShrink: 0, display: "flex", gap: "1rem" }}
                      >
                        <p>
                          <strong>Ảnh cá:</strong>
                        </p>
                        <img
                          src={fish.image}
                          alt="Fish"
                          style={{ maxWidth: "200px", borderRadius: "8px" }}
                        />
                      </div>
                      <div
                        style={{ flexShrink: 0, display: "flex", gap: "1rem" }}
                      >
                        <p>
                          <strong>Ảnh chứng nhận:</strong>
                        </p>
                        <img
                          src={fish.certificate}
                          alt="Fish"
                          style={{ maxWidth: "200px", borderRadius: "8px" }}
                        />
                      </div>
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

export default FishTable;
