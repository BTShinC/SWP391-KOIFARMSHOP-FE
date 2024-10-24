import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid2,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  addFish,
  AddFishCombo,
  createConsignment,
} from "../../../../service/userService";

function SellPayment() {
  const user = useSelector((state) => state?.user);
  const navigate = useNavigate();
  const location = useLocation();
  const finalData = location.state;
  // Hàm tính toán phí chăm sóc dựa trên các tiêu chí
  const countFee = () => {
    let fee = 0;
    if (finalData?.quantity) {
      if (finalData.quantity <= 10 && finalData.size <= 40) {
        fee = finalData.day * 150000;
      } else if (finalData.quantity <= 20 && finalData.size <= 40) {
        fee = finalData.day * 180000;
      } else if (finalData.quantity <= 10 && finalData.size > 40) {
        fee = finalData.day * 200000;
      } else {
        fee = finalData.day * 250000;
      }
    } else {
      if (finalData.size <= 40) {
        fee =
          finalData.day < 60 ? 250000 * finalData.day : 150000 * finalData.day;
      } else {
        fee =
          finalData.day < 60 ? 300000 * finalData.day : 200000 * finalData.day;
      }
    }
    return fee;
  };

  const fee = countFee();

  // Hàm xử lý thanh toán
  const handlePayment = async () => {
    if (user.accountBalance >= fee) {
      const newBalance = user.accountBalance - fee;
      const updatedUser = { ...user, accountBalance: newBalance };
      console.log("Updated user balance:", updatedUser);
      console.log(finalData);
      if (localStorage.getItem("sellForm")) {
        localStorage.removeItem("sellForm");
        console.log("SellForm đã bị xóa");
        try {
          let res = await addFish(finalData);
          if (res) {
            console.log("Thành công");
            const generateProductID = res.data.productID;
            console.log("generateProductID =>", generateProductID);
            const consignment = {
              consignmentDate: finalData.date,
              saleDate: null,
              salePrice: finalData.price,
              dateReceived: null,
              dateExpiration: null,
              status: "Chờ xác nhận",
              accountID: user?.accountID,
              productID: generateProductID,
              productComboID: null,
            };
            console.log("consignment =>",consignment)
            try {
              let res = await createConsignment(consignment);
              if (res) {
                console.log("Thành công");
              }
            } catch (error) {
              console.log(error);
            }
          }
        } catch (error) {
          console.log(error);
        }
      }

      if (localStorage.getItem("sellFormCombo")) {
        localStorage.removeItem("sellFormCombo");
        console.log("sellFormCombo đã bị xóa");
        try {
          let res = await AddFishCombo(finalData);
          if (res) {
            console.log("Thành công");
            const generateProductComboID = res.data.productID;
            console.log("generateProductID =>", generateProductComboID);
            const consignment = {
              consignmentDate: finalData.date,
              saleDate: null,
              salePrice: finalData.price,
              dateReceived: null,
              dateExpiration: null,
              status: "Chờ xác nhận",
              accountID: user?.accountID,
              productID: null,
              productComboID: generateProductComboID,
            };
            console.log("consignment =>",consignment)
            try {
              let res = await createConsignment(consignment);
              if (res) {
                console.log("Thành công");
              }
            } catch (error) {
              console.log(error);
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
      toast.success("Thanh toán thành công");
      navigate("/consignmentSuccess");
    } else {
      toast.error("Không đủ tiền để thanh toán");
    }
  };

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
              <Typography variant="h4">Thông tin thanh toán</Typography>
              <Typography variant="body1">
                Loại ký gửi: {finalData?.consignmentType}
              </Typography>
              <Typography variant="body1">
                Số lượng: {finalData?.quantity}
              </Typography>
              <Typography variant="body1">
                Kích thước: {finalData?.size} cm
              </Typography>
              <Typography variant="body1">Số ngày: {finalData?.day}</Typography>
            </Grid2>
            <Grid2 xs={6} className="pay-form-box__right">
              <Box
                sx={{
                  marginBottom: "1.5rem",
                  padding: "1.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
              >
                <Typography variant="h5" color="primary">
                  Tổng chi phí
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {new Intl.NumberFormat("vi-VN").format(fee)} VNĐ
                </Typography>
              </Box>
            </Grid2>
          </Grid2>
          <hr />
          <Box className="pay-button" textAlign="center">
            <Button variant="contained" color="primary" onClick={handlePayment}>
              Thanh toán
            </Button>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}

export default SellPayment;
