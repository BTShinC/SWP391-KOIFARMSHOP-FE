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
  editUser,
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
      if (finalData?.quantity <= 10 && finalData?.size <= 40) {
        fee = finalData?.duration * 20000;
      } else if (finalData?.quantity <= 20 && finalData?.size <= 40) {
        fee = finalData?.duration * 40000;
      } else if (finalData?.quantity <= 10 && finalData?.size > 40) {
        fee = finalData?.duration * 60000;
      } else {
        fee = finalData?.duration * 90000;
      }
    } else {
      if (finalData.size <= 40) {
        fee =
          finalData?.duration <= 60
            ? 50000 * finalData?.duration
            : 25000 * finalData?.duration;
      } else {
        fee =
          finalData?.duration <= 60
            ? 90000 * finalData?.duration
            : 70000 * finalData?.duration;
      }
    }

    return fee;
  };

  const fee = countFee();

  // Hàm xử lý thanh toán
  const handlePayment = async () => {
    try {
      // First, check if the user has enough balance
      if (user.accountBalance >= fee) {
        let generateProductID = null;
        let generateProductComboID = null;

        // Check if sellForm is in localStorage (individual fish)
        if (localStorage.getItem("sellForm")) {
          localStorage.removeItem("sellForm");
          console.log("SellForm đã bị xóa");

          // Try adding the fish
          const res = await addFish(finalData);
          if (res) {
            console.log("Thành công thêm cá");
            generateProductID = res.data.productID;
          } else {
            throw new Error("Failed to add fish");
          }
        }

        // Check if sellFormCombo is in localStorage (fish combo)
        if (localStorage.getItem("sellFormCombo")) {
          localStorage.removeItem("sellFormCombo");
          console.log("sellFormCombo đã bị xóa");

          // Try adding the fish combo
          const res = await AddFishCombo(finalData);
          if (res) {
            console.log("Thành công thêm combo cá");
            generateProductComboID = res.data.productComboID;
          } else {
            throw new Error("Failed to add fish combo");
          }
        }

        // Construct the consignment object based on product or product combo
        const consignment = {
          ...finalData,
          saleDate: null,
          salePrice: finalData?.price,
          dateReceived: null,
          dateExpiration: null,
          status: "Chờ xác nhận",
          accountID: user?.accountID,
          productID: generateProductID,
          productComboID: generateProductComboID,
          total: fee,
        };

        console.log("consignment =>", consignment);

        // Try creating the consignment
        const consignmentRes = await createConsignment(consignment);
        if (!consignmentRes) {
          throw new Error("Failed to create consignment");
        }
        console.log("Thành công tạo đơn ký gửi");

        // If everything is successful, deduct the balance
        const newBalance = user?.accountBalance - fee;
        const updatedUser = { ...user, accountBalance: newBalance };

        // Update the user's balance
        const updateUserapi = await editUser(updatedUser);
        if (updateUserapi) {
          console.log("Đã trừ tiền");
        } else {
          throw new Error("Failed to update user balance");
        }
        
        // Show success message after all operations succeed
        toast.success("Thanh toán thành công");
        navigate("/consignmentSuccess")
      } else {
        // Show error if the user doesn't have enough balance
        toast.error("Không đủ tiền để thanh toán");
      }
    } catch (error) {
      console.error("Error in handlePayment:", error);
      toast.error("Có lỗi xảy ra trong quá trình thanh toán");
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
              <Typography variant="body1">
                Số ngày: {finalData?.duration}
              </Typography>
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
