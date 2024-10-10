import { Button } from "antd";
import "./index.scss";
import ConsignmentCarousel from "../../components/consignment-carousel";
import { Box, Typography } from "@mui/material";
import ConsignmentPackageExample from "./consignment-package";
import ConsignmentSell from "./consignment-sell";
function Consignment() {
  return (
    <div className="consignment-page">
      <div className="consignment-page__intro">
        <div className="consignment-page__text">
          <div className="consignment-page__right">
            <h2>Giới thiệu về Ký Gửi KoiFish - Đam Mê Koi Nhật</h2>
            <p>
              Dịch vụ ký gửi cá Koi của chúng tôi cung cấp giải pháp toàn diện,
              từ chăm sóc cá chuyên nghiệp đến hỗ trợ ký gửi để bán. Với đội ngũ
              chuyên gia tận tâm và môi trường sống lý tưởng, KoiFish đảm bảo cá
              của bạn luôn khỏe mạnh và dễ dàng tiếp cận người mua tiềm năng.
            </p>
            <Button type="primary">
              <b>Xem chi tiết</b>
            </Button>
          </div>
          <img
            src="/public/images/image 111.png"
            alt="cá koi"
            className="koi-image"
          />
        </div>
      </div>
      <Box sx={{ padding: "2rem 0", textAlign: "center" }}>
        <Typography
          variant="h3"
          sx={{ marginBottom: "1rem" }}
          className="package-title"
        >
          Dịch vụ chăm sóc
        </Typography>
        <Box className="consignment-carousel-background">
          <ConsignmentCarousel />
        </Box>
        <Typography
          variant="h3"
          sx={{ marginBottom: "2rem" }}
          className="package-title"
        >
          Các gói chăm sóc tiêu biểu
        </Typography>
        <Box className="consignment-package">
          <ConsignmentPackageExample />
        </Box>
        <Typography
          variant="h3"
          sx={{ marginBottom: "1rem", marginTop: "5rem" }}
          className="package-title"
        >
          Dịch vụ ký gửi bán
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: "2rem",
          }}
        >
          <ConsignmentSell />
        </Box>
      </Box>
    </div>
  );
}

export default Consignment;
