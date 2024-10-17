import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CardMedia,
} from "@mui/material";
import "./index.scss"; // Import file SCSS của bạn
import { useNavigate } from "react-router-dom";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment"; // Import icon ngọn lửa
const koiCarePackages = [
  {
    id: 1,
    title: "Gói chăm sóc cá Koi tiêu chuẩn",
    price: "1.500.000đ/tháng",
    description: "Bao gồm kiểm tra sức khỏe định kỳ và tư vấn chăm sóc cá Koi.",
    services: [
      "Kiểm tra chất lượng nước",
      "Kiểm tra sức khỏe cá",
      "Tư vấn dinh dưỡng",
    ],
    image: "/public/images/cakoi2.webp",
  },
  {
    id: 2,
    title: "Gói chăm sóc cá Koi nâng cao",
    price: "3.000.000đ/tháng",
    description: "Dịch vụ chăm sóc chuyên sâu cho các giống cá Koi quý hiếm.",
    services: ["Kiểm tra chuyên sâu", "Điều trị bệnh cá", "Chăm sóc định kỳ"],
    image: "/public/images/a.jpg",
  },
  {
    id: 3,
    title: "Gói chăm sóc cá Koi VIP",
    price: "5.000.000đ/tháng",
    description:
      "Dịch vụ cao cấp bao gồm chăm sóc, điều trị, và tư vấn toàn diện.",
    services: ["Chăm sóc 24/7", "Tư vấn chuyên gia", "Bảo hiểm sức khỏe cá"],
    image: "/public/images/ca-koi-chat-luong.webp",
  },
  {
    id: 4,
    title: "Gói lên màu cho cá Koi",
    price: "3.500.000đ/tháng",
    description:
      "Dịch vụ chuyên nghiệp giúp tăng cường màu sắc cá Koi, cải thiện sức khỏe và ngoại hình.",
    services: [
      "Chăm sóc dinh dưỡng đặc biệt",
      "Kiểm tra định kỳ tình trạng màu sắc",
      "Tư vấn điều chỉnh chế độ chăm sóc",
    ],
    image: "/public/images/image 111.png",
  },
];

function ConsignmentPackageExample() {
  const navigate = useNavigate();
  const handleCarePackageDetail = (id) => {
    navigate(`/carepackagedetail/${id}`);
  };
  return (
    <>
      <Grid container spacing={3} justifyContent="center" alignItems="stretch">
        {koiCarePackages.map((product) => (
          <Grid item xs={12} sm={6} key={product.id}>
            <Card className="hover-card">
              <CardMedia
                component="img"
                src={product.image}
                alt={product.title}
                className="card-media"
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {product.title}
                </Typography>
                {/* Căn trái phần mô tả */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "left" }}
                >
                  {product.description}
                </Typography>
                <ul style={{ textAlign: "left" }}>
                  {product.services.map((service, index) => (
                    <li key={index}>
                      <Typography variant="body2" color="text.secondary">
                        {service}
                      </Typography>
                    </li>
                  ))}
                </ul>
                {/* Cập nhật màu và kích thước giá */}
                <Typography className="price-text">
                  {product.price}
                  <LocalFireDepartmentIcon className="fire-icon" />
                </Typography>
              </CardContent>
              <Box sx={{ textAlign: "center", paddingBottom: "1rem" }}>
                <Button
                  className="detail-care-package-btn"
                  onClick={() => handleCarePackageDetail(product.id)}
                >
                  Xem chi tiết
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ textAlign: "center", marginTop: "2rem" }}>
        <Button
          className="more-button"
          variant="outlined"
          onClick={() => {
            navigate("/carePackageList");
          }}
        >
          Xem thêm
        </Button>
      </Box>
    </>
  );
}

export default ConsignmentPackageExample;