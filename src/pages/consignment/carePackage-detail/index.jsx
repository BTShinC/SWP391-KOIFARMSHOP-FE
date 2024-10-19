import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import { useState } from "react";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { useNavigate, useParams } from "react-router-dom";
import "./index.scss";

function CarePackageDetail() {
  const koiCarePackages = [
    {
      id: 1,
      title: "Gói chăm sóc cá Koi tiêu chuẩn",
      price: "1.500.000đ/tháng",
      description:
        "Gói tiêu chuẩn bao gồm kiểm tra sức khỏe định kỳ và tư vấn chăm sóc cá Koi, đảm bảo sức khỏe và môi trường sống tối ưu cho cá Koi của bạn.",
      services: [
        {
          name: "Kiểm tra chất lượng nước",
          frequency: "2 lần/tháng",
          description:
            "Đánh giá và điều chỉnh các thông số nước để đảm bảo môi trường sống tốt nhất cho cá.",
        },
        {
          name: "Kiểm tra sức khỏe cá",
          frequency: "1 lần/tháng",
          description:
            "Kiểm tra tình trạng sức khỏe cá và đề xuất phương pháp điều trị nếu cần thiết.",
        },
        {
          name: "Tư vấn dinh dưỡng",
          frequency: "Mỗi tuần",
          description:
            "Tư vấn chế độ dinh dưỡng phù hợp để cá phát triển tốt và khỏe mạnh.",
        },
      ],
      images: [
        {
          name: "Chăm sóc định kỳ",
          url: "/images/cakoi1.webp",
        },
        {
          name: "Chăm sóc định kỳ",
          url: "/images/cakoi2.webp",
        },
        {
          name: "Chăm sóc định kỳ",
          url: "/images/cakoi1.webp",
        },
      ],
      tag: "HOT",
      type: "Cá thể",
    },
    {
      id: 2,
      title: "Gói chăm sóc cá Koi nâng cao",
      price: "3.000.000đ/tháng",
      description:
        "Dịch vụ chăm sóc chuyên sâu cho các giống cá Koi quý hiếm, bao gồm điều trị bệnh, kiểm tra môi trường nước chuyên sâu và chăm sóc đặc biệt.",
      services: [
        {
          name: "Kiểm tra chuyên sâu",
          frequency: "Hàng tuần",
          description:
            "Kiểm tra môi trường và sức khỏe cá toàn diện để phát hiện sớm các vấn đề.",
        },
        {
          name: "Điều trị bệnh cá",
          frequency: "Theo yêu cầu",
          description:
            "Điều trị các bệnh thường gặp của cá Koi với các phương pháp hiện đại.",
        },
        {
          name: "Chăm sóc định kỳ",
          frequency: "3 lần/tháng",
          description:
            "Chăm sóc và theo dõi sức khỏe cá liên tục nhằm cải thiện chất lượng sống.",
        },
      ],
      images: [
        {
          name: "Chăm sóc định kỳ",
          url: "/images/cakoi1.webp",
        },
        {
          name: "Chăm sóc định kỳ",
          url: "/images/cakoi2.webp",
        },
        {
          name: "Chăm sóc định kỳ",
          url: "/images/cakoi1.webp",
        },
      ],
      tag: "SALE",
      type: "Lô",
    },
  ];

  const navigate = useNavigate();
  const { id } = useParams(); // Lấy id từ URL
  const data = koiCarePackages.find((item) => item.id === parseInt(id)); // Tìm sản phẩm theo id
  // State để lưu hình ảnh chính
  const [mainImage, setMainImage] = useState(data.images[0].url);
  // Kiểm tra nếu không tìm thấy sản phẩm
  if (!data) {
    return <Typography variant="h4">Không tìm thấy sản phẩm</Typography>;
  }
  // Hàm điều hướng đến trang ký gửi
  const handleCareConsignmentFrom = (id, type) => {
    navigate("/consignmentFrom", { state: { id, type } });
  };

  return (
    <div>
      <Button
        variant="contained"
        className="back-button"
        onClick={() => navigate(-1)}
      >
        Trở lại
      </Button>
      <Grid
        container
        alignItems="center"
        justifyContent="left"
        marginLeft="5rem"
        marginTop="3rem"
        marginBottom="3rem"
      >
        <Box
          className="relative-img"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            alignItems: "center",
          }}
        >
          {data.images.map((img, index) => (
            <img
              key={index}
              src={img.url}
              alt={`Cá Koi ${index + 1}`}
              style={{ width: "80px", borderRadius: "8px" }}
              onMouseEnter={() => setMainImage(img.url)}
            />
          ))}
        </Box>

        <Box className="main-img" sx={{ textAlign: "center" }}>
          <img
            src={mainImage}
            alt="Cá Koi chính"
            style={{ width: "250px", borderRadius: "8px" }}
          />
        </Box>

        <Card
          className="img-description"
          sx={{
            padding: "3rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            maxWidth: "700px",
            width: "100%",
            marginLeft: "2rem",
          }}
        >
          <CardContent>
            <Typography variant="h4" fontWeight="bold">
              {data.title}
            </Typography>
            <Typography variant="h6" color="primary">
              Giá: {data.price}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {data.description}
            </Typography>

            <Typography variant="body1">Dịch vụ bao gồm:</Typography>
            <ul>
              {data.services.map((service, index) => (
                <li key={index}>
                  <Typography variant="body2" fontWeight="bold">
                    {service.name} ({service.frequency})
                  </Typography>
                  <Typography variant="body2">{service.description}</Typography>
                </li>
              ))}
            </ul>
          </CardContent>
          <Button
            className="careConsignment-btn"
            onClick={() => handleCareConsignmentFrom(data.id, data.type)}
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
