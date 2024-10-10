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
    image: "/public/ca-koi-chat-luong.webp",
  },
];

function ConsignmentPackageExample() {
  return (
    <>
      <Grid container spacing={2} justifyContent="center" alignItems="stretch">
        {koiCarePackages.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card
              className="hover-card"
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <CardMedia
                component="img"
                src={product.image}
                alt={product.title}
                sx={{ width: "100%", height: "200px", objectFit: "cover" }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {product.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
                <ul>
                  {product.services.map((service, index) => (
                    <li key={index}>
                      <Typography variant="body2" color="text.secondary">
                        {service}
                      </Typography>
                    </li>
                  ))}
                </ul>
                <Typography variant="h6" color="error">
                  {product.price}
                </Typography>
              </CardContent>
              <Box sx={{ textAlign: "center", paddingBottom: "1rem" }}>
                <Button variant="contained" color="primary">
                  Xem chi tiết
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ textAlign: "center", marginTop: "2rem" }}>
        <Button className="more-button" variant="outlined" color="primary">
          Xem thêm
        </Button>
      </Box>
    </>
  );
}

export default ConsignmentPackageExample;
