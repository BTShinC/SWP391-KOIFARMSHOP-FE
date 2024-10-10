import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { Button } from "antd";
import "./index.scss";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function ConsignmentSell() {
  return (
    <>
      {/* Online Consignment Section */}
      <Box className="online-consignment" sx={{ maxWidth: "45%" }}>
        <Card sx={{height :"450px"}}>
          <CardMedia
            component="img"
            alt="Online Consignment"
            height="140"
            image="public/online-image.png" // Path to your online consignment image
          />
          <CardContent>
            <Button
              className="sell-online"
              onClick={() => console.log("Clicked on 'Ký gửi Online'")}
            >
              Ký gửi Online
              <ArrowForwardIcon sx={{ marginLeft: "0.5rem" }} />
            </Button>
            <Typography sx={{ textAlign: "justify" }}>
              Với hình thức ký gửi online, bạn có thể dễ dàng ký gửi cá Koi của
              mình thông qua nền tảng trực tuyến của chúng tôi. Chúng tôi sẽ
              giúp bạn tiếp cận hàng ngàn khách hàng tiềm năng từ khắp nơi.
            </Typography>
            <Typography sx={{ marginTop: "1rem", textAlign: "justify" }}>
              Phù hợp cho người muốn tiện lợi và không cần di chuyển nhiều.
            </Typography>
            <Button type="primary" sx={{ marginTop: "1rem" }}>
              <b>Tìm hiểu thêm</b>
            </Button>
          </CardContent>
        </Card>
      </Box>

      {/* Offline Consignment Section */}
      <Box className="offline-consignment" sx={{ maxWidth: "45%" }}>
        <Card sx={{height:"450px"}} >
          <CardMedia
            component="img"
            alt="Offline Consignment"
            height="140"
            image="public/image.png" // Path to your offline consignment image
          />
          <CardContent>
            <Button
              className="sell-offline"
              onClick={() => console.log("Clicked on 'Ký gửi Offline'")}
            >
              Ký gửi Offline
              <ArrowForwardIcon sx={{ marginLeft: "0.5rem" }} />
            </Button>
            <Typography sx={{ textAlign: "justify" }}>
              Ký gửi offline giúp bạn mang cá Koi đến cửa hàng đối tác để trưng
              bày và bán. Đội ngũ chuyên gia sẽ chăm sóc và đảm bảo cá luôn
              trong tình trạng tốt nhất.
            </Typography>
            <Typography sx={{ marginTop: "1rem", textAlign: "justify" }}>
              Phù hợp cho người nuôi cá muốn bán nhanh và tiếp cận khách hàng
              trực tiếp.
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
