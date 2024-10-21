import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CardMedia,
} from "@mui/material";
import "./index.scss"; // Import file SCSS của bạn
import { useNavigate } from "react-router-dom";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment"; // Import icon ngọn lửa
import { useCallback, useEffect, useState } from "react";
import { fetchAllCarePackages } from "../../../service/userService";

function ConsignmentPackageExample() {
  const getAllCarePackages = useCallback(async () => {
    try {
      let res = await fetchAllCarePackages();
      if (res && res.data) {
        setKoiCarePackages(res.data);
        console.log("koiCarePackages =>", res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getAllCarePackages();
  }, [getAllCarePackages]);
  const [koiCarePackages, setKoiCarePackages] = useState([]);

  const navigate = useNavigate();
  const handleCarePackageDetail = (id) => {
    navigate(`/carepackagedetail/${id}`);
  };
  return (
    <>
      <Grid container spacing={3} justifyContent="center" alignItems="stretch">
        {koiCarePackages.slice(0, 4).map((product) => (
          <Grid item xs={12} sm={6} key={product.id}>
            <Card className="hover-card">
              <CardMedia
                component="img"
                src={product.image}
                alt={product.title}
                className="card-media"
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {product.title}
                </Typography>
                {/* Căn trái phần mô tả */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "left" }}
                >
                  {product.description}
                </Typography>
                <ul style={{ textAlign: "left" }}>
                  {product.services.map((service, index) => (
                    <li key={index}>
                      <Typography variant="body2" color="text.secondary">
                        {service}
                      </Typography>
                    </li>
                  ))}
                </ul>
                {/* Cập nhật màu và kích thước giá */}
                <Typography className="price-text">
                  {new Intl.NumberFormat("vi-VN").format(product?.price)}VNĐ/tháng
                  <LocalFireDepartmentIcon className="fire-icon" />
                </Typography>
              </CardContent>
              <Box sx={{ textAlign: "center", paddingBottom: "1rem" }}>
                <Button
                  className="detail-care-package-btn"
                  onClick={() => handleCarePackageDetail(product.carePackageID)}
                >
                  Xem chi tiết
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ textAlign: "center", marginTop: "2rem" }}>
        <Button
          className="more-button"
          variant="outlined"
          onClick={() => {
            navigate("/carePackageList");
          }}
        >
          Xem thêm
        </Button>
      </Box>
    </>
  );
}

export default ConsignmentPackageExample;
