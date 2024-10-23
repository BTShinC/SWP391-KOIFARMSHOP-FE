import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./index.scss";
import { useCallback, useEffect, useState } from "react";
import { ArrowDropUp, ArrowDropDown } from "@mui/icons-material"; // Mũi tên chỉ hướng
import { fetchAllCarePackages } from "../../../service/userService";

function CarePackageList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [sortPriceDirection, setSortPriceDirection] = useState(null); // Trạng thái sắp xếp giá

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

  // Lọc và sắp xếp các gói chăm sóc
  const filteredPackages = koiCarePackages
    .filter((item) => {
      const packageName = item.packageName || ""; // Đảm bảo packageName không phải là undefined
      const matchesSearch = packageName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType = selectedType === "" || item.type === selectedType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortPriceDirection === "asc") {
        return a.price - b.price;
      } else if (sortPriceDirection === "desc") {
        return b.price - a.price;
      }
      return 0; // Không sắp xếp
    });

  const handleDetailPackage = (id) => {
    navigate(`/carepackagedetail/${id}`);
  };

  // Xử lý sắp xếp giá khi nhấn nút
  const handleSortPrice = () => {
    if (sortPriceDirection === "asc") {
      setSortPriceDirection("desc");
    } else {
      setSortPriceDirection("asc");
    }
  };

  return (
    <div className="care-package-list">
      <div className="care-package-container">
          <Button
            variant="contained"
            className="back-button"
            onClick={() => navigate(-1)}
          >
            Trở lại
          </Button>
        {/* Bộ lọc */}
        <Box className="filter-container">
          <Box className="type-filter-buttons">
            <Button
              className={`filter-button ${selectedType === "" ? "active" : ""}`}
              onClick={() => setSelectedType("")}
            >
              Tất cả
            </Button>
            <Button
              className={`filter-button ${
                selectedType === "Cá thể" ? "active" : ""
              }`}
              onClick={() => setSelectedType("Cá thể")}
            >
              Cá thể
            </Button>
            <Button
              className={`filter-button ${
                selectedType === "Lô" ? "active" : ""
              }`}
              onClick={() => setSelectedType("Lô")}
            >
              Lô
            </Button>
            {/* Nút sắp xếp giá */}
            <Button className="sort-price-button" onClick={handleSortPrice}>
              Sắp xếp giá
              {sortPriceDirection === "asc" && <ArrowDropUp />}
              {sortPriceDirection === "desc" && <ArrowDropDown />}
            </Button>
          </Box>
          {/* Tìm kiếm theo tên */}
          <TextField
            label="Tìm kiếm gói"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>

        <Typography variant="h3" className="package-title">
          Các gói chăm sóc
        </Typography>
        {filteredPackages.map((item) => (
          <Grid
            container
            spacing={4}
            key={item.carePackageID}
            className="care-package-item"
            alignItems="center"
          >
            {/* Image Column */}
            <Grid item xs={12} md={6}>
              <Box className="image-container">
                <img
                  src={item.images[0]}
                  height={"300px"}
                  alt={item.packageName}
                />
              </Box>
            </Grid>

            {/* Description Column */}
            <Grid item xs={12} md={6}>
              <Box className="description-container">
                <div className="title-wrapper">
                  <Typography variant="h4">
                    {item.packageName} ({item?.type})
                  </Typography>
                  {item.tag && (
                    <>
                      <span
                        className={`label-tag ${
                          item.tag.toLowerCase() === "sale"
                            ? "label-sale"
                            : item.tag.toLowerCase() === "best seller"
                            ? "label-best-seller"
                            : ""
                        }`}
                      >
                        {item.tag}
                      </span>
                    </>
                  )}
                </div>
                {item.tag.toLowerCase() === "sale" && (
                  <Typography
                    variant="h6"
                    sx={{ textDecoration: "line-through" }}
                  >
                    {new Intl.NumberFormat("vi-VN").format(item.price * 1.2)}VNĐ
                  </Typography>
                )}
                <Typography variant="h6">
                  {new Intl.NumberFormat("vi-VN").format(item.price)} VNĐ
                </Typography>
                <ul>
                  {item.services.map((service, index) => (
                    <li key={index}>{service}</li>
                  ))}
                </ul>
                <Button
                  variant="contained"
                  className="view-detail-btn"
                  onClick={() => handleDetailPackage(item.carePackageID)}
                >
                  Xem chi tiết
                </Button>
              </Box>
            </Grid>
          </Grid>
        ))}
      </div>
    </div>
  );
}

export default CarePackageList;
