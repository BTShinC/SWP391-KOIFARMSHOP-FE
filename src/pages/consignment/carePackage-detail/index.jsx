import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import "./index.scss";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { useNavigate, useParams } from "react-router-dom";

function CarePackageDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const handleCareConsignmentFrom = () => {
    navigate(`/consignmentFrom/${id}`);
  };
  return (  
    <div>
      {/* Tạo một hàng chứa tất cả các phần tử */}
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
          <img
            src="/public/images/cakoi1.webp"
            alt="Cá Koi 1"
            style={{ width: "80px", borderRadius: "8px" }}
          />
          <img
            src="/public/images/cakoi1.webp"
            alt="Cá Koi 2"
            style={{ width: "80px", borderRadius: "8px" }}
          />
          <img
            src="/public/images/cakoi1.webp"
            alt="Cá Koi 3"
            style={{ width: "80px", borderRadius: "8px" }}
          />
        </Box>
        <Box className="main-img" sx={{ textAlign: "center" }}>
          <img
            src="/public/images/cakoi1.webp"
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
            justifyContent: "flex-start", // Căn từ trên xuống dưới
            alignItems: "center", // Căn giữa theo chiều ngang
            maxWidth: "100%",
            marginLeft: "2rem", // Thêm khoảng cách giữa hình ảnh chính và mô tả
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

          {/* Căn giữa Button */}
          <Button
            className="careConsignment-btn"
            onClick={() => handleCareConsignmentFrom()}
          >
            Ký gửi ngay
            <LocalFireDepartmentIcon /> {/* Icon ngọn lửa bên phải */}
          </Button>
        </Card>
      </Grid>
    </div>
  );
}

export default CarePackageDetail;
