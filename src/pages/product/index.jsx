import "./index.scss";
import logo from "/public/images/logo.svg";
import { useEffect, useState } from "react";
import { Input, Button, Card, Pagination, Dropdown, Menu } from "antd";
import Meta from "antd/es/card/Meta";
import { FilterOutlined, SearchOutlined, SwapOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchAllProduct } from "../../service/userService";
import api from "../../config/api";

function ProductPage() {
    const [fishData, setFishData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;
    const navigate = useNavigate(); // Hook for navigation

    // Fetch fish data from the API
    async function fetchFish() {
        try {
            const response = await api.get("http://103.90.227.69:8080/api/product/getall");
            console.log(response.data);
            setFishData(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchFish();
    }, []);

    // Filter products based on search term
    const filteredProducts = fishData.filter(product =>
        product.productName && product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Dropdown menu for filter options
    const menu = (
        <Menu>
            <Menu.Item key="1" onClick={() => navigate("/product")}>
                Theo cá thể
            </Menu.Item>
            <Menu.Item key="2" onClick={() => navigate("/productcombo")}>
                Theo lô
            </Menu.Item>
        </Menu>
    );

    return (
        <div className="product-page">
            <div className="product-content">
                <div className="search-wrapper">
                    <div className="search-filter">
                        <div className="filter-options">
                            <Dropdown overlay={menu} trigger={['click']}>
                                <Button icon={<FilterOutlined />}>Bộ lọc</Button>
                            </Dropdown>
                        </div>
                        <form onSubmit={(e) => e.preventDefault()} className="search-form">
                            <Input
                                placeholder="Tìm kiếm sản phẩm..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </form>
                    </div>
                    <Link to="/compare">
                        <Button icon={<SwapOutlined />} className="compare-button">So sánh cá</Button>
                    </Link>
                </div>
                <h2>Các sản phẩm</h2>
                <div className="product-list">
                    {currentProducts.map(product => (
                        <Card
                            key={product.productId}
                            hoverable
                            cover={<img src={product.image} alt={product.title} />}
                            style={{ width: 240, margin: '16px', display: 'inline-block' }}
                        >
                            <Meta
                                title={<span className="product-name">{product.productName}</span>}
                                description={
                                    <div>
                                        <p>Giống: {product.breed}</p>
                                        <p>Kích thước: {product.size}</p>
                                        <p>Giới tính: {product.sex}</p>
                                        <p className="price">{formatCurrency(product.price)} VND</p>
                                        <div className="select-button-wrapper">
                                            <Link to={`/singleproduct/${product.productID}`}>
                                                <Button className="product-detail-button" style={{ marginTop: '10px' }}>
                                                    Xem chi tiết
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                }
                            />
                        </Card>
                    ))}
                </div>
            </div>
            <div className="pagination-wrapper">
                <Pagination className="pagination"
                    current={currentPage}
                    pageSize={itemsPerPage}
                    total={filteredProducts.length}
                    onChange={handlePageChange}
                    style={{ marginTop: '20px', textAlign: 'center' }}
                />
            </div>
        </div>
    );
}

export default ProductPage;
