import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CardMedia,
} from "@mui/material";
import "./index.scss";
import { useNavigate } from "react-router-dom";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { useCallback, useEffect, useState } from "react";
import { fetchAllCarePackages } from "../../../service/userService";

function ConsignmentPackageExample() {
  const [koiCarePackages, setKoiCarePackages] = useState([]);

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

  const navigate = useNavigate();

  const handleCarePackageDetail = (id) => {
    navigate(`/carepackagedetail/${id}`);
  };

  return (
    <Box sx={{ padding: { xs: "1rem", md: "2rem" } }}>
      <Grid container spacing={3} justifyContent="center">
        {koiCarePackages.slice(0, 4).map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.carePackageID}>
            <Card className="hover-card">
              <CardMedia
                component="img"
                src={product.images[0]}
                alt={product.packageName}
                className="card-media"
              />
              <CardContent>
                <Box
                  sx={{
                    backgroundColor: "#f8f1e4", // Light background color
                    borderRadius: "8px",
                    padding: "0.5rem 1rem",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
                    textAlign: "center",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#441d01", // Rich brown color for the title
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      fontSize: "1.2rem",
                    }}
                  >
                    {product.packageName} ({product.type})
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "left", mb: 1 }}
                >
                  {product.description}
                </Typography>
                <ul style={{ textAlign: "left", marginBottom: "1rem" }}>
                  {product.services.map((service, index) => (
                    <li key={index}>
                      <Typography variant="body2" color="text.secondary">
                        {service}
                      </Typography>
                    </li>
                  ))}
                </ul>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    color: "#d48806",
                    fontWeight: "bold",
                  }}
                >
                  <LocalFireDepartmentIcon className="fire-icon" />
                  {new Intl.NumberFormat("vi-VN").format(product?.price)}{" "}
                  VNĐ/tháng
                </Box>
              </CardContent>
              <Box sx={{ textAlign: "center", padding: "1rem 0" }}>
                <Button
                  className="detail-care-package-btn"
                  onClick={() =>
                    handleCarePackageDetail(product?.carePackageID)
                  }
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
    </Box>
  );
}

export default ConsignmentPackageExample;
