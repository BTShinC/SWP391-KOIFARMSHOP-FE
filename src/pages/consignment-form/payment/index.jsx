import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid2,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import "./index.scss";
import WalletIcon from "@mui/icons-material/Wallet";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
PaymentPage.propTypes = {};
function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("Ví cửa hàng");
  const location = useLocation();
  const paymentData = location.state;
  console.log("Payment data received:", paymentData);
  const id = paymentData.carePackageID;
  const user = useSelector((state) => state.user.account);
  console.log(user);
  const koiCarePackages = [
    {
      id: 1,
      title: "Gói chăm sóc cá Koi tiêu chuẩn",
      price: 15,
      description:
        "Bao gồm kiểm tra sức khỏe định kỳ và tư vấn chăm sóc cá Koi.",
      services: [
        "Kiểm tra chất lượng nước",
        "Kiểm tra sức khỏe cá",
        "Tư vấn dinh dưỡng",
      ],
      image: "/images/cakoi2.webp",
    },
    {
      id: 2,
      title: "Gói chăm sóc cá Koi nâng cao",
      price: 30,
      description: "Dịch vụ chăm sóc chuyên sâu cho các giống cá Koi quý hiếm.",
      services: ["Kiểm tra chuyên sâu", "Điều trị bệnh cá", "Chăm sóc định kỳ"],
      image: "/images/a.jpg",
    },
    {
      id: 3,
      title: "Gói chăm sóc cá Koi VIP",
      price: "5.000.000đ/tháng",
      description:
        "Dịch vụ cao cấp bao gồm chăm sóc, điều trị, và tư vấn toàn diện.",
      services: ["Chăm sóc 24/7", "Tư vấn chuyên gia", "Bảo hiểm sức khỏe cá"],
      image: "/images/ca-koi-chat-luong.webp",
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
      image: "/images/image 111.png",
    },
  ];
  const carePackage = koiCarePackages.find((item) => {
    return item.id == id;
  });
  console.log(carePackage);
  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };
  const handlePayment = () => {
    if (paymentMethod === "Ví cửa hàng")
      if (user.accountBalance >= carePackage.price) {
        // Trừ phí và cập nhật số dư tài khoản
        const newBalance = user.accountBalance - carePackage.price;
        const updatedUser = {
          ...user,
          accountBalance: newBalance,
        };
        console.log("Updated user balance:", updatedUser);
        toast.success("Thanh toán thành công");
      }
    console.log("Không đủ tiền");
  };
  const navigation = useNavigate();
  return (
    <div className="consignment-payment">
      <Card className="pay-form-container">
        <Box sx={{marginBottom:"3rem"}}>
          <Button
            variant="contained"
            className="back-button"
            onClick={() => navigation(-1)}
          >
            Trở lại
          </Button>
        </Box>
        <CardContent>
          <Grid2 container spacing={12}>
            <Grid2 xs={6} className="pay-form-box">
              <Box>
                <Typography variant="h4">Thanh toán</Typography>
                <Typography variant="body1">{carePackage?.title}</Typography>
              </Box>
              <Box>
                <Typography variant="body1">Tổng cộng</Typography>
              </Box>
              <Box>
                <Typography variant="body1">Thanh toán</Typography>
              </Box>
            </Grid2>
            <Grid2 xs={6} className="pay-form-box__right">
              <Box>
                <Typography variant="h4">Chi phí thành phần</Typography>
                <Typography variant="body1">
                  {new Intl.NumberFormat("vi-VN").format(carePackage?.price)}{" "}
                  VNĐ
                </Typography>
              </Box>
              <Box>
                <Typography variant="body1">
                  {new Intl.NumberFormat("vi-VN").format(carePackage?.price)}{" "}
                  VNĐ
                </Typography>
              </Box>
              <Box>
                <Typography variant="h5">
                  {new Intl.NumberFormat("vi-VN").format(carePackage?.price)}{" "}
                  VNĐ
                </Typography>
              </Box>
            </Grid2>
          </Grid2>
          <hr />
          <Grid2 container>
            <FormControl fullWidth>
              <FormLabel>Hình thức thanh toán</FormLabel>
              <RadioGroup
                defaultValue="Ví cửa hàng"
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
              >
                <FormControlLabel
                  value="Ví cửa hàng"
                  control={<Radio />}
                  label={
                    <span style={{ display: "flex", flexDirection: "row" }}>
                      <WalletIcon
                        style={{ marginTop: "8px", marginRight: "8px" }}
                      />
                      Ví cửa hàng
                    </span>
                  }
                />
                <FormControlLabel
                  value="VN PAY"
                  control={<Radio />}
                  label={
                    <img
                      src="images/VNPAY.svg"
                      alt="VNPAY"
                      style={{ width: "70px", height: "70px" }}
                    />
                  }
                />
              </RadioGroup>
            </FormControl>
          </Grid2>
          <Box className="pay-button">
            <Button onClick={handlePayment}>Thanh toán</Button>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}

export default PaymentPage;
