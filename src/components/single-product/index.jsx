import "./index.scss";
import { Link, useParams } from "react-router-dom";
import { Button, Typography, Image, Divider } from "antd";
import Carousel from "../carousel";
import { useState, useEffect } from "react";
import ShoppingCart from "../shopping-cart";
import { addToCartAPI, fetchProductById } from "../../service/userService";
import { useSelector } from "react-redux";

const { Title, Text } = Typography;

function SinglepProduct() {
  const [cartVisible, setCartVisible] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const { id } = useParams(); // Lấy productId từ URL
  const [product, setProduct] = useState(null); // State để lưu thông tin sản phẩm
  // const dispatch = useDispatch(); // Khởi tạo dispatch
  const account = useSelector((state) => state.user.account); // Lấy accountId từ Redux

  // Fetch thông tin người dùng khi component mount
  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const response = await fetchUser(); // Gọi API để lấy thông tin người dùng
  //       dispatch(setUser({ accountId: response.accountId })); // Lưu accountId vào Redux
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //     }
  //   };

  //   fetchUserData();
  // }, [dispatch]);

  // Fetch sản phẩm từ backend khi component mount
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await fetchProductById(id);
        console.log("Fetched product:", response);
        setProduct(response);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    loadProduct();
  }, [id]);

  useEffect(() => {
    console.log("Current account:", account);
  }, [account]);

  useEffect(() => {
    console.log("Current product:", product);
  }, [product]);

  const handleAddToCart = async () => {
    try {
      if (!account || !account.accountID) {
        console.error("Account information is missing");
        return;
      }

      console.log("Sending to API:", {
        accountId: account.accountID,
        productId: product.productID
      });

      const response = await addToCartAPI({
        accountId: account.accountID,
        productId: product.productID
      });
      console.log("Added to cart successfully:", response);

      // Cập nhật cartItems để hiển thị thông tin sản phẩm
      setCartItems((prevItems) => [
        ...prevItems,
        {
          productID: product.productID,
          productName: product.productName,
          price: product.price,
          quantity: 1, // Hoặc giá trị mặc định bạn muốn
          image: product.image,
          breed: product.breed,
        },
      ]);

      setCartVisible(true);
    } catch (error) {
      console.error("Error adding to cart:", error.response?.data || error.message);
    }
  };

  return (
    <div className="single-product">
      <div className="breadcrumb-banner">
        <nav className="breadcrumb">
          <Link to="/" className="breadcrumb-link faded">
            HomePage
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
          <Link to="/shop" className="breadcrumb-link faded">
            Shop
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
          <span className="breadcrumb-current">
            {product ? product.productName : "Loading..."}
          </span>
        </nav>
      </div>

      <div className="product-container">
        {product && (
          <>
            <div className="image-gallery">
              <div className="thumbnail-container">
                <Image
                  src={product.image}
                  alt="Thumbnail 1"
                  className="thumbnail"
                />
                <Image
                  src={product.image}
                  alt="Thumbnail 2"
                  className="thumbnail"
                />
                <Image
                  src={product.image}
                  alt="Thumbnail 3"
                  className="thumbnail"
                />
              </div>
              <Image
                src={product.image}
                alt="Main Product"
                width={400}
                height={400}
                className="main-image"
              />
            </div>

            <div className="product-details">
              <Title level={6}>{product.productName}</Title>
              <Text className="price" style={{ color: "#9F9F9F" }}>
                Giá: {product.price} VNĐ
              </Text>
              <Text>Tuổi: {product.size} tháng tuổi</Text>
              <Text>Giới tính: {product.sex}</Text>
              <Text>Kích thước: {product.size} cm</Text>
              <Text>Giống: {product.breed}</Text>
              <Text>Nguồn gốc: {product.origin}</Text>

              <div className="action-buttons">
                <Link to="/shoppingcart">
                  <Button type="default" className="buy-button">
                    Mua ngay
                  </Button>
                </Link>

                <Button onClick={handleAddToCart}>
                  Thêm vào giỏ hàng
                </Button>
              </div>

              <div className="divider-wrapper">
                <Divider />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="description-container">
        <div className="divider-wrapper">
          <Divider />
        </div>
        <div className="description">
          <Title level={2}>Mô tả</Title>
          <p>{product ? product.description : "Loading description..."}</p>
        </div>
      </div>

      <div className="carousel-container">
        <div className="title">
          <Title level={2}>Sản phẩm liên quan</Title>
        </div>
        <Carousel slidesPerView={4} />
        <div className="button">
          <Button
            className="color-option"
            style={{
              backgroundColor: "white",
              color: "#B88E2F",
              marginTop: 70,
              width: 150,
              height: 50,
            }}
          >
            Xem thêm
          </Button>
        </div>
      </div>

      {/* Show ShoppingCart if visible */}
      {cartVisible && (
        <ShoppingCart
          cartItems={cartItems}
          onClose={() => setCartVisible(false)}
        />
      )}
    </div>
  );
}

export default SinglepProduct;
