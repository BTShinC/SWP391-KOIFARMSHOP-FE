import { useState } from "react";
import { Button } from "antd";
import PropTypes from "prop-types";
import "./index.scss";
FishTable.propTypes = {
  columns: PropTypes.array.isRequired,
  fishData: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
};

function FishTable({ columns, fishData, title }) {
  const [showDetail, setShowDetail] = useState(null);

  const handleViewDetail = (id) => {
    setShowDetail((prev) => (prev === id ? null : id));
  };
  return (
    <div className="fish-table">
      <div>
        <h3 className="fish-table__title">{title}</h3>
      </div>
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {fishData.map((fish) => (
            <>
              <tr key={fish.productID}>
                <td>{fish.productID}</td>
                <td>{fish.breed}</td>
                <td>{fish.size}</td>
                <td>{fish.sex}</td>
                <td>{fish.price} $</td>
                <td>{fish.quality}</td>
                <td>{fish.status}</td>
                <td className="btn-container">
                  <Button onClick={() => handleViewDetail(fish.productID)}>
                    {showDetail === fish.productID
                      ? "Ẩn chi tiết"
                      : "Xem chi tiết"}
                  </Button>
                  <Button>Chỉnh sửa</Button>
                </td>
              </tr>
              {showDetail === fish.productID && (
                <tr>
                  <td colSpan={7}>
                    <div>
                      <p style={{ textAlign: "left" }}>
                        <strong>Trạng thái sức khỏe:</strong>{" "}
                        {fish.healthStatus}
                      </p>
                      <p style={{ textAlign: "left" }}>
                        <strong>Tính cách:</strong> {fish.personalityTrait}
                      </p>
                      <p style={{ textAlign: "left" }}>
                        <strong>Nguồn gốc:</strong> {fish.origin}
                      </p>
                      <p style={{ textAlign: "left" }}>
                        <strong>Mô tả:</strong> {fish.description}
                      </p>
                      <p style={{ textAlign: "left" }}>
                        <strong>Chứng nhận:</strong> {fish.certificate}
                      </p>
                      <p style={{ textAlign: "left" }}>
                        <strong>Loại:</strong> {fish.type}
                      </p>
                      <p style={{ textAlign: "left" }}>
                        <strong>Mã ký gửi:</strong> {fish.koiConsignmentID}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FishTable;
