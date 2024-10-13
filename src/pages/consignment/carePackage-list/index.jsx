import { Box, Button, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate để xử lý quay lại
import "./index.scss";

function CarePackageList() {
  const navigate = useNavigate(); // Khởi tạo useNavigate
  const koiCarePackages = [
    {
      id: 1,
      title: "Gói chăm sóc cá Koi tiêu chuẩn",
      price: "1.500.000đ/tháng",
      description:
        "Bao gồm kiểm tra sức khỏe định kỳ và tư vấn chăm sóc cá Koi.",
      services: [
        "Kiểm tra chất lượng nước",
        "Kiểm tra sức khỏe cá",
        "Tư vấn dinh dưỡng",
      ],
      image: "/public/images/cakoi2.webp",
      tag: "HOT",
    },
    {
      id: 2,
      title: "Gói chăm sóc cá Koi nâng cao",
      price: "3.000.000đ/tháng",
      description: "Dịch vụ chăm sóc chuyên sâu cho các giống cá Koi quý hiếm.",
      services: ["Kiểm tra chuyên sâu", "Điều trị bệnh cá", "Chăm sóc định kỳ"],
      image: "/public/images/a.jpg",
      tag: "SALE",
    },
  ];

  return (
    <div className="care-package-list">
      <div className="care-package-container">
        {/* Nút Trở lại */}
        <Button
          variant="contained"
          className="back-button"
          onClick={() => navigate(-1)} // Xử lý quay lại
        >
          Trở lại
        </Button>
        <Typography variant="h3" className="package-title">
          Các gói chăm sóc
        </Typography>
        {koiCarePackages.map((item) => (
          <Grid
            container
            spacing={4}
            key={item.id}
            className="care-package-item"
            alignItems="center"
          >
            {/* Image Column */}
            <Grid item xs={12} md={6}>
              <Box className="image-container">
                <img src={item.image} height={"300px"} alt={item.title} />
              </Box>
            </Grid>

            {/* Description Column */}
            <Grid item xs={12} md={6}>
              <Box className="description-container">
                <div className="title-wrapper">
                  <Typography variant="h4">{item.title}</Typography>
                  {item.tag && (
                    <span
                      className={`label-tag ${
                        item.tag === "SALE" ? "label-sale" : ""
                      }`}
                    >
                      {item.tag}
                    </span>
                  )}
                </div>
                <Typography variant="h6">{item.price}</Typography>
                <ul>
                  {item.services.map((service, index) => (
                    <li key={index}>{service}</li>
                  ))}
                </ul>
                <Button variant="contained" className="view-detail-btn">
                  Xem chi tiết
                </Button>
              </Box>
            </Grid>
          </Grid>
        ))}
      </div>
    </div>
  );
}

export default CarePackageList;
