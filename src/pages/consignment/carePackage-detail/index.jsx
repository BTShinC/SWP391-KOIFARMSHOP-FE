import { Box, Card, CardContent, Grid } from "@mui/material";
import PropTypes from "prop-types";
import "./index.scss";
import { Typography } from "antd";

CarePackageDetail.propTypes = {
  data: PropTypes.object.isRequired,
};

function CarePackageDetail({ data }) {
    console.log(data)
  return (
    <div>
      {/* Tạo một hàng chứa tất cả các phần tử */}
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        {/* Hình ảnh nhỏ liên quan */}
        <Grid item md={2}>
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
        </Grid>

        {/* Hình ảnh chính */}
        <Grid item md={6}>
          <Box className="main-img" sx={{ textAlign: "center" }}>
            <img
              src="/public/images/cakoi1.webp"
              alt="Cá Koi chính"
              style={{ width: "300px", borderRadius: "8px" }}
            />
          </Box>
        </Grid>

        {/* Phần mô tả */}
        <Grid item md={4}>
          <Card
            className="img-description"
            sx={{
              padding: "0.5rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              maxWidth: "100%",
            }}
          >
            <CardContent>
              <Typography variant="h5">Gói chăm sóc cá Koi tiêu chuẩn</Typography>
              <Typography>Giá: 1.500.000đ/tháng</Typography>
              <Typography>
                Bao gồm kiểm tra sức khỏe định kỳ và tư vấn chăm sóc cá Koi.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default CarePackageDetail;
