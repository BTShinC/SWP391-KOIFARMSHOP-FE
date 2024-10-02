import "./index.scss";
import { Link } from "react-router-dom";
import { Button, Typography, Image, Divider } from "antd";

const { Title, Text } = Typography;



function SinglepProduct() {
  return (
     <div className="single-product">
         <div className="breadcrumb-banner">
      <nav className="breadcrumb">
        <Link to="/" className="breadcrumb-link faded">HomePage</Link>
        <span className="breadcrumb-separator"> &gt; </span>
        <Link to="/shop" className="breadcrumb-link faded">Shop</Link>
        <span className="breadcrumb-separator"> &gt; </span>
        <span className="breadcrumb-current">Tên sản phẩm</span>
      </nav>
      </div>

      <div className="product-container">
        <div className="image-gallery">
          <div className="thumbnail-container">
            <Image
              src="/images/kohaku1.svg" // Replace with your thumbnail image path
              alt="Thumbnail 1"
              className="thumbnail"
            />
            <Image
              src="/images/kohaku1.svg" // Replace with your thumbnail image path
              alt="Thumbnail 2"
              className="thumbnail"
            />
            <Image
              src="/images/kohaku1.svg" // Replace with your thumbnail image path
              alt="Thumbnail 3"
              className="thumbnail"
            />
          </div>
          <Image
            src="/images/kohaku1.svg" // Replace with your main image path
            alt="Main Product"
            width={418}
            height={500}
            className="main-image"
          />
        </div>

        <div className="product-details">
          <Title level={3}>Tên sản phẩm</Title>
          <Text className="price" style={{ color: "#9F9F9F" }}>Giá: 1.000.000 VNĐ</Text>
          <Divider style={{ borderColor: "#D9D9D9" }} />
          <Text>Tuổi: 5 tháng tuổi</Text><br />
          <Text>Giới tính: Koi Cái</Text><br />
          <Text>Năm sinh: 2024</Text><br />
          <Text>Kích thước: 80cm</Text><br />
          <Text>Giống: Tancho Kohaku</Text><br />
          <Text>Nguồn gốc: Danchi Koi Farm</Text><br />
          <Divider style={{ borderColor: "#D9D9D9" }} />

          <div className="color-selection">
            <Text>Chọn màu sắc: </Text>
            <Button className="color-option" style={{ backgroundColor: 'red' }} />
            <Button className="color-option" style={{ backgroundColor: 'blue' }} />
            <Button className="color-option" style={{ backgroundColor: 'green' }} />
          </div>

          <div className="action-buttons">
            <Button type="primary" className="buy-button">Mua lẻ</Button>
            <Button type="default" className="buy-button">Mua lô</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglepProduct;
