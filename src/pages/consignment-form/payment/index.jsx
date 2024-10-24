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
  editUser,
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
  const user = useSelector((state) => state?.user);
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
      if (user.accountBalance >= carePackage?.price) {
        try {
          let productID = null;
          let productComboID = null;

          // Kiểm tra và tạo đơn ký gửi cá thể
          if (localStorage.getItem("careForm")) {
            console.log("Bắt đầu tạo đơn ký gửi cho cá thể...");
            const res = await addFish(paymentData); // Gọi API để thêm sản phẩm cá thể

            if (res && res.data) {
              productID = res.data.productID;
              paymentData.productID = productID;
              console.log(
                "Thêm sản phẩm cá thể thành công, productID:",
                productID
              );

              // Tạo đơn ký gửi cho sản phẩm cá thể
              console.log(paymentData)
              const res1 = await createConsignment(paymentData);
              if (res1) {
                console.log("Tạo đơn ký gửi cá thể thành công");
              } else {
                throw new Error("Tạo đơn ký gửi cá thể thất bại");
              }
            } else {
              throw new Error("Thêm sản phẩm cá thể thất bại");
            }
          }

          // Kiểm tra và tạo đơn ký gửi cho combo
          if (localStorage.getItem("careFormCombo")) {
            console.log("Bắt đầu tạo đơn ký gửi cho combo...");
            const res = await AddFishCombo(paymentData); // Gọi API để thêm combo sản phẩm

            if (res && res.data) {
              productComboID = res.data.productComboID;
              paymentData.productComboID = productComboID;
              console.log(
                "Thêm sản phẩm combo thành công, productComboID:",
                productComboID
              );

              // Tạo đơn ký gửi cho combo
              const res1 = await createConsignment(paymentData);
              if (res1) {
                console.log("Tạo đơn ký gửi combo thành công");
              } else {
                throw new Error("Tạo đơn ký gửi combo thất bại");
              }
            } else {
              throw new Error("Thêm sản phẩm combo thất bại");
            }
          }

          // Nếu đến đây mà không có lỗi nào, nghĩa là đơn ký gửi đã thành công
          // Tiến hành cập nhật số dư tài khoản
          const newBalance = user.accountBalance - carePackage?.price;
          console.log(newBalance)
          const updatedUser = { ...user, accountBalance: newBalance };
          console.log("Updated user balance:", updatedUser);
          const updateUserapi = await editUser(updatedUser)
          if(updateUserapi){  
              console.log("Đã trừ tiền")
          }

          // Xóa localStorage sau khi thanh toán thành công
          if (localStorage.getItem("careForm")) {
            localStorage.removeItem("careForm");
            console.log("careForm đã bị xóa");
          }
          if (localStorage.getItem("careFormCombo")) {
            localStorage.removeItem("careFormCombo");
            console.log("careFormCombo đã bị xóa");
          }

          toast.success("Thanh toán thành công");
        } catch (error) {
          console.error(
            "Lỗi khi thực hiện thanh toán hoặc tạo đơn ký gửi:",
            error.message || error
          );
          toast.error(
            "Có lỗi xảy ra trong quá trình thanh toán hoặc tạo đơn ký gửi."
          );
        }
      } else {
        console.log("Không đủ tiền");
        toast.error("Không đủ tiền trong tài khoản.");
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
