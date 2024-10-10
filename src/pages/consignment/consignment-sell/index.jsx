import { Box, Card, CardContent, Typography } from "@mui/material";
import { Button } from "antd";
ConsignmentSell.propTypes = {};

function ConsignmentSell() {
  return (
    <>
      <Box className="online-consignment" sx={{ maxWidth: "45%" }}>
        <Typography variant="h4" sx={{ marginBottom: "1rem" }}>
          Ký gửi Online
        </Typography>
        <Typography>
          Với hình thức ký gửi online, bạn có thể dễ dàng ký gửi cá Koi của mình
          thông qua nền tảng trực tuyến của chúng tôi. Chúng tôi sẽ giúp bạn
          tiếp cận với hàng ngàn khách hàng tiềm năng từ khắp nơi mà không cần
          phải di chuyển.
        </Typography>
        <Button type="primary" sx={{ marginTop: "1rem" }}>
          <b>Tìm hiểu thêm</b>
        </Button>
      </Box>
      <Box className="offline-consignment" sx={{ maxWidth: "45%" }}>
      <Card>
        <CardContent>
        <Typography variant="h4" sx={{ marginBottom: "1rem" }}>
          Ký gửi Offline
        </Typography>
        <Typography>
          Hình thức ký gửi offline giúp bạn mang cá Koi trực tiếp đến các cửa
          hàng đối tác của chúng tôi để được trưng bày và bán. Đội ngũ chuyên
          gia của chúng tôi sẽ chăm sóc và đảm bảo cá Koi của bạn luôn trong
          điều kiện tốt nhất.
        </Typography>
        <Button type="primary" sx={{ marginTop: "1rem" }}>
          <b>Tìm hiểu thêm</b>
        </Button>
        </CardContent>


      </Card>
      </Box>
    </>
  );
}

export default ConsignmentSell;
