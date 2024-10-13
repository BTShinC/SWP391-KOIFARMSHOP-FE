import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import { useState } from "react"; // Thêm useState để quản lý trạng thái hình ảnh
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { useNavigate, useParams } from "react-router-dom";
import "./index.scss";

function CarePackageDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Danh sách các hình ảnh nhỏ
  const images = [
    "/public/images/cakoi1.webp",
    "/public/images/cakoi2.webp",
    "/public/images/banner-JPD.jpg",
  ];

  // State để lưu hình ảnh chính
  const [mainImage, setMainImage] = useState(images[0]);

  // Hàm điều hướng đến trang ký gửi
  const handleCareConsignmentFrom = () => {
    navigate(`/consignmentFrom/${id}`);
  };

  return (
    <div>
      <Grid
        container
        alignItems="center"
        justifyContent="left"
        marginLeft="5rem"
        marginTop="3rem"
        marginBottom="3rem"
      >
        {/* Hình ảnh nhỏ liên quan */}
        <Box
          className="relative-img"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            alignItems: "center",
          }}
        >
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Cá Koi ${index + 1}`}
              style={{ width: "80px", borderRadius: "8px" }}
              onMouseEnter={() => setMainImage(img)} // Cập nhật hình ảnh chính khi hover
            />
          ))}
        </Box>

        {/* Hình ảnh chính */}
        <Box className="main-img" sx={{ textAlign: "center" }}>
          <img
            src={mainImage} // Hiển thị hình ảnh chính từ state
            alt="Cá Koi chính"
            style={{ width: "300px", borderRadius: "8px" }}
          />
        </Box>

        {/* Phần mô tả */}
        <Card
          className="img-description"
          sx={{
            padding: "3rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            maxWidth: "100%",
            marginLeft: "2rem",
          }}
        >
          <CardContent>
            <Typography variant="h4" fontWeight="bold">
              Gói chăm sóc cá Koi tiêu chuẩn
            </Typography>
            <Typography variant="h6" color="primary">
              Giá: 1.500.000đ/tháng
            </Typography>
            <Typography variant="body1">Bao gồm:</Typography>
            <Typography
              variant="body2"
              component="ul"
              sx={{ paddingLeft: "1.5rem" }}
            >
              <li>Kiểm tra sức khỏe định kỳ</li>
              <li>Tư vấn chăm sóc cá Koi</li>
            </Typography>
          </CardContent>

          {/* Nút ký gửi */}
          <Button
            className="careConsignment-btn"
            onClick={() => handleCareConsignmentFrom()}
          >
            Ký gửi ngay
            <LocalFireDepartmentIcon />
          </Button>
        </Card>
      </Grid>
    </div>
  );
}

export default CarePackageDetail;
