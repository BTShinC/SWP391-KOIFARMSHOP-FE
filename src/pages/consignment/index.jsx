import "./index.scss";
import ConsignmentCarousel from "../../components/consignment-carousel";
import { Box, Typography } from "@mui/material";
import ConsignmentPackageExample from "./consignment-package";
import ConsignmentSell from "./consignment-sell";
function Consignment() {
  return (
    <div className="consignment-page">
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
