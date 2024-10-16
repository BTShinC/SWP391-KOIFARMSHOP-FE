import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";
import "./index.scss";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";

function ConsignmentSell() {
  const navigate = useNavigate();
  const handleTypeSelection = (type) => {
    // Truyền type (ví dụ: Online/Offline) thông qua state
    navigate(`/consignmentFrom`, { state: { type } });
  };
  return (
    <div className="form-of-sale">
      <Box className="online-consignment">
        <Card className="card">
          <CardMedia
            component="img"
            alt="Online Consignment"
            height="140"
            image="/public/images/a.jpg"
          />
          <CardContent className="card-content">
            <Button
              className="sell-online"
              onClick={() => handleTypeSelection("Online")}
            >
              Ký gửi Online
              <ArrowForwardIcon sx={{ marginLeft: "0.5rem" }} />
            </Button>
            <Typography className="text-content">
              Với hình thức ký gửi online, bạn có thể dễ dàng ký gửi cá Koi của
              mình thông qua nền tảng trực tuyến của chúng tôi. Chúng tôi sẽ
              giúp bạn tiếp cận hàng ngàn khách hàng tiềm năng từ khắp nơi.
            </Typography>
            <Typography className="text-content">
              Phù hợp cho người muốn tiện lợi và không cần di chuyển nhiều.
            </Typography>
            <Button
              className="button-outline"
              onClick={() => console.log("Clicked on 'Tìm hiểu thêm Online'")}
            >
              Tìm hiểu thêm
            </Button>
          </CardContent>
        </Card>
      </Box>

      {/* Offline Consignment Section */}
      <Box className="offline-consignment">
        <Card className="card">
          <CardMedia
            component="img"
            alt="Offline Consignment"
            height="140"
            image="/public/images/a.jpg"
          />
          <CardContent className="card-content">
            <Button
              className="sell-offline"
              onClick={() => handleTypeSelection("Offline")}
            >
              Ký gửi Offline
              <ArrowForwardIcon sx={{ marginLeft: "0.5rem" }} />
            </Button>
            <Typography className="text-content">
              Ký gửi offline giúp bạn mang cá Koi đến cửa hàng đối tác để trưng
              bày và bán. Đội ngũ chuyên gia sẽ chăm sóc và đảm bảo cá luôn
              trong tình trạng tốt nhất.
            </Typography>
            <Typography className="text-content">
              Phù hợp cho người nuôi cá muốn bán nhanh và tiếp cận khách hàng
              trực tiếp.
            </Typography>
            <Button
              className="button-outline"
              onClick={() => console.log("Clicked on 'Tìm hiểu thêm Offline'")}
            >
              Tìm hiểu thêm
            </Button>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
}

export default ConsignmentSell;
