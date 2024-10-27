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
  createTransaction,
  editUser,
  fetchAllCarePackages,
} from "../../../service/userService";

PaymentPage.propTypes = {};

function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("Ví cửa hàng");
  const [koiCarePackages, setKoiCarePackages] = useState([]);
  const location = useLocation();
  const paymentData = location?.state;
  const id = paymentData.carePackageID;
  const user = useSelector((state) => state?.user);

  const getAllCarePackages = useCallback(async () => {
    try {
      const res = await fetchAllCarePackages();
      if (res && res.data) {
        setKoiCarePackages(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getAllCarePackages();
  }, [getAllCarePackages]);

  const carePackage = koiCarePackages.find((item) => item.carePackageID == id);
  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handlePayment = async () => {
    if (paymentMethod === "Ví cửa hàng") {
      if (user.accountBalance >= carePackage?.price) {
        try {
          let productID = null;
          let productComboID = null;
          let consignmentID = null; // Thêm biến để lưu consignmentID
  
          // Kiểm tra và tạo đơn ký gửi cá thể
          if (localStorage.getItem("careForm") && paymentData.formType === "careForm") {
            const res = await addFish(paymentData);
            if (res && res.data) {
              productID = res.data.productID;
              paymentData.productID = productID;
  
              const res1 = await createConsignment(paymentData);
              if (res1 && res1.data) {
                consignmentID = res1.data.consignmentID; // Lấy consignmentID từ res1
                console.log("Tạo đơn ký gửi cá thể thành công:", consignmentID);
              } else {
                throw new Error("Tạo đơn ký gửi cá thể thất bại");
              }
            } else {
              throw new Error("Thêm sản phẩm cá thể thất bại");
            }
          }
  
          // Kiểm tra và tạo đơn ký gửi combo
          if (localStorage.getItem("careFormCombo") && paymentData.formType === "careFormCombo") {
            const res = await AddFishCombo(paymentData);
            if (res) {
              productComboID = res.data.productComboID;
              paymentData.productComboID = productComboID;
  
              const res1 = await createConsignment(paymentData);
              if (res1) {
                consignmentID = res1.data.consignmentID; // Lấy consignmentID từ res1
                console.log("Tạo đơn ký gửi combo thành công:", consignmentID);
              } else {
                throw new Error("Tạo đơn ký gửi combo thất bại");
              }
            } else {
              throw new Error("Thêm sản phẩm combo thất bại");
            }
          }
  
          // Cập nhật số dư tài khoản
          const newBalance = user.accountBalance - carePackage?.price;
          const updatedUser = { ...user, accountBalance: newBalance };
          const updateUserapi = await editUser(updatedUser);
          if (updateUserapi) {
            console.log("Đã trừ tiền. Số dư tài khoản mới:", newBalance);
          } else {
            throw new Error("Cập nhật số dư tài khoản thất bại");
          }
  
          // Tạo transaction
          const transactionData = {
            accountID: user.accountID,
            price: paymentData.price,
            date: new Date(),
            description: `Phí đơn ${consignmentID}`, // Sử dụng consignmentID từ res1
          };
  
          const transactionRes = await createTransaction(transactionData);
          if (transactionRes) {
            console.log("Lưu transaction thành công:", transactionRes.data);
            toast.success("Thanh toán thành công");
            navigate("/consignmentSuccess");
          } else {
            throw new Error("Lưu transaction thất bại");
          }
  
          // Xóa localStorage sau khi thanh toán thành công
          localStorage.removeItem("careForm");
          localStorage.removeItem("careFormCombo");
        } catch (error) {
          console.error("Lỗi khi thực hiện thanh toán:", error.message || error);
          toast.error("Có lỗi xảy ra trong quá trình thanh toán.");
        }
      } else {
        toast.error("Không đủ tiền trong tài khoản.");
      }
    }
  };
  
  

  const navigate = useNavigate();

  return (
    <div className="consignment-payment">
      <Card className="pay-form-container">
        <Box sx={{ marginBottom: "3rem" }}>
          <Button
            variant="contained"
            className="back-button"
            onClick={() => navigate(-1)}
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
