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
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  addFish,
  AddFishCombo,
  createConsignment,
  fetchAllCarePackages,
} from "../../../service/userService";
PaymentPage.propTypes = {};
function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("Ví cửa hàng");
  const [koiCarePackages, setKoiCarePackages] = useState([]);
  const location = useLocation();
  const paymentData = location?.state;
  console.log("Payment data received:", paymentData);
  const id = paymentData.carePackageID;
  const user = useSelector((state) => state.user.account);
  console.log(user);

  const getAllCarePackages = useCallback(async () => {
    try {
      const res = await fetchAllCarePackages();
      if (res && res.data) {
        console.log(res);
        setKoiCarePackages(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getAllCarePackages();
  }, [getAllCarePackages]);
  const carePackage = koiCarePackages.find((item) => {
    return item.carePackageID == id;
  });
  console.log(carePackage);

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handlePayment = async () => {
    if (paymentMethod === "Ví cửa hàng") {
      if (user.accountBalance >= carePackage.price) {
        // Trừ phí và cập nhật số dư tài khoản
        const newBalance = user.accountBalance - carePackage.price;
        const updatedUser = {
          ...user,
          accountBalance: newBalance,
        };
        console.log("Updated user balance:", updatedUser);

        // Kiểm tra và xóa careForm nếu có
        if (localStorage.getItem("careForm")) {
          localStorage.removeItem("careForm");
          console.log("careForm đã bị xóa");
          try {
            // Gọi API để thêm sản phẩm
            let res = await addFish(paymentData);
            if (res && res.data) {
              // Thêm productID vào paymentData
              const productID = res.data.productID;
              paymentData.productID = productID; // Thêm productID vào paymentData
              console.log("Thêm sản phẩm thành công, productID:", productID);

              // Sau khi thêm productID, gọi API để tạo đơn ký gửi
              let res1 = await createConsignment(paymentData);
              if (res1) {
                console.log("Tạo đơn ký gửi thành công");
              } else {
                console.log("Tạo đơn ký gửi thất bại");
              }
            } else {
              console.log("Thêm sản phẩm thất bại");
            }
          } catch (error) {
            console.log("Lỗi khi thực hiện thanh toán:", error);
          }
        }

        // Kiểm tra và xóa careFormCombo nếu có
        if (localStorage.getItem("careFormCombo")) {
          localStorage.removeItem("careFormCombo");
          console.log("careFormCombo đã bị xóa");
          try {
            // Gọi API để thêm sản phẩm
            let res = await AddFishCombo(paymentData);
            if (res && res.data) {
              const productComboID = res.data.productComboID;
              paymentData.productComboID = productComboID; 
              console.log("Thêm sản phẩm thành công, productID:", productComboID);

              // Sau khi thêm productID, gọi API để tạo đơn ký gửi
              let res1 = await createConsignment(paymentData);
              if (res1) {
                console.log("Tạo đơn ký gửi thành công");
              } else {
                console.log("Tạo đơn ký gửi thất bại");
              }
            } else {
              console.log("Thêm sản phẩm thất bại");
            }
          } catch (error) {
            console.log("Lỗi khi thực hiện thanh toán:", error);
          }
        }
        toast.success("Thanh toán thành công");
      } else {
        console.log("Không đủ tiền");
      }
    }
  };
  const navigation = useNavigate();
  return (
    <div className="consignment-payment">
      <Card className="pay-form-container">
        <Box sx={{ marginBottom: "3rem" }}>
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
                <Typography variant="body1">
                  {carePackage?.packageName}
                </Typography>
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
                  {new Intl.NumberFormat("vi-VN").format(carePackage?.price)}
                  VNĐ
                </Typography>
              </Box>
              <Box>
                <Typography variant="body1">
                  {new Intl.NumberFormat("vi-VN").format(carePackage?.price)}
                  VNĐ
                </Typography>
              </Box>
              <Box>
                <Typography variant="h5">
                  {new Intl.NumberFormat("vi-VN").format(carePackage?.price)}
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
