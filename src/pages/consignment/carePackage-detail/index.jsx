import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, CardContent, Grid, Typography, Button } from "@mui/material";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { fetchAllCarePackages } from "../../../service/userService";
import "./index.scss";

function CarePackageDetail() {
  const [koiCarePackages, setKoiCarePackages] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy id từ URL

  // Hàm lấy dữ liệu tất cả các gói chăm sóc cá Koi
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

  // Tìm gói chăm sóc theo id khi có dữ liệu gói chăm sóc
  const data = koiCarePackages.find((item) => item.carePackageID === id);

  // Cập nhật ảnh chính khi tìm thấy dữ liệu gói chăm sóc
  useEffect(() => {
    if (data?.images?.length > 0) {
      setMainImage(data.images[0]); // Lấy ảnh đầu tiên làm ảnh chính
    }
  }, [data]);

  // Nếu không tìm thấy sản phẩm thì hiển thị thông báo
  if (!data) {
    return <Typography variant="h4">Không tìm thấy sản phẩm</Typography>;
  }

  const handleCareConsignmentFrom = (id, type) => {
    navigate("/consignmentFrom", { state: { id, type } });
  };

  return (
    <div>
      <Button
        variant="contained"
        className="back-button"
        onClick={() => navigate(-1)}
      >
        Trở lại
      </Button>

      <Grid
        container
        alignItems="center"
        justifyContent="left"
        marginLeft="5rem"
        marginTop="3rem"
        marginBottom="3rem"
      >
        <Box
          className="relative-img"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            alignItems: "center",
          }}
        >
          {data.images?.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Cá Koi ${index + 1}`}
              style={{ width: "80px", borderRadius: "8px" }}
              onMouseEnter={() => setMainImage(img)}
            />
          ))}
        </Box>

        <Box className="main-img" sx={{ textAlign: "center" }}>
          <img
            src={mainImage}
            alt="Cá Koi chính"
            style={{ width: "250px", borderRadius: "8px" }}
          />
        </Box>

        <Card
          className="img-description"
          sx={{
            padding: "3rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            maxWidth: "700px",
            width: "100%",
            marginLeft: "2rem",
          }}
        >
          <CardContent>
            <Typography variant="h4" fontWeight="bold">
              {data.packageName}
            </Typography>
            <Typography variant="h6" color="primary">
              Giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.price)}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {data.description}
            </Typography>

            <Typography variant="body1">Dịch vụ bao gồm:</Typography>
            <ul>
              {data.services?.map((service, index) => (
                <li key={index}>
                  <Typography variant="body2" fontWeight="bold">
                    {service}
                  </Typography>
                </li>
              ))}
            </ul>
          </CardContent>
          <Button
            className="careConsignment-btn"
            onClick={() => handleCareConsignmentFrom(data.carePackageID, data.type)}
          >
            Ký gửi ngay
            <LocalFireDepartmentIcon />
          </Button>
        </Card>
      </Grid>
    </div>
  );
}

export default CarePackageDetail;
