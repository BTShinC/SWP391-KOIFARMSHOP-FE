import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./index.scss";
import { useState } from "react";
import { ArrowDropUp, ArrowDropDown } from "@mui/icons-material"; // Mũi tên chỉ hướng

function CarePackageList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [sortPriceDirection, setSortPriceDirection] = useState(null); // Trạng thái sắp xếp giá

  const koiCarePackages = [
    {
      id: 1,
      title: "Gói chăm sóc cá Koi tiêu chuẩn",
      price: "1500000", // Chuyển giá thành số để dễ so sánh
      description:
        "Bao gồm kiểm tra sức khỏe định kỳ và tư vấn chăm sóc cá Koi.",
      services: [
        "Kiểm tra chất lượng nước",
        "Kiểm tra sức khỏe cá",
        "Tư vấn dinh dưỡng",
      ],
      image: "/images/cakoi2.webp",
      tag: "HOT",
      type: "Cá thể",
    },
    {
      id: 2,
      title: "Gói chăm sóc cá Koi nâng cao",
      price: "3000000",
      description: "Dịch vụ chăm sóc chuyên sâu cho các giống cá Koi quý hiếm.",
      services: ["Kiểm tra chuyên sâu", "Điều trị bệnh cá", "Chăm sóc định kỳ"],
      image: "/images/a.jpg",
      tag: "SALE",
      type: "Lô",
    },
  ];

  // Lọc và sắp xếp các gói chăm sóc
  const filteredPackages = koiCarePackages
    .filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType = selectedType === "" || item.type === selectedType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortPriceDirection === "asc") {
        return a.price - b.price; // Sắp xếp tăng dần
      } else if (sortPriceDirection === "desc") {
        return b.price - a.price; // Sắp xếp giảm dần
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
        {/* Nút Trở lại */}
        <Button
          variant="contained"
          className="back-button"
          onClick={() => navigate(-1)}
        >
          Trở lại
        </Button>

        {/* Bộ lọc */}
        <Box className="filter-container">
          {/* Lọc theo loại với nút */}
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
            key={item.id}
            className="care-package-item"
            alignItems="center"
          >
            {/* Image Column */}
            <Grid item xs={12} md={6}>
              <Box className="image-container">
                <img src={item.image} height={"300px"} alt={item.title} />
              </Box>
            </Grid>

            {/* Description Column */}
            <Grid item xs={12} md={6}>
              <Box className="description-container">
                <div className="title-wrapper">
                  <Typography variant="h4">{item.title}</Typography>
                  {item.tag && (
                    <span
                      className={`label-tag ${
                        item.tag === "SALE" ? "label-sale" : ""
                      }`}
                    >
                      {item.tag}
                    </span>
                  )}
                </div>
                <Typography variant="h6">{item.price}đ</Typography>
                <ul>
                  {item.services.map((service, index) => (
                    <li key={index}>{service}</li>
                  ))}
                </ul>
                <Button
                  variant="contained"
                  className="view-detail-btn"
                  onClick={() => handleDetailPackage(item.id)}
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
