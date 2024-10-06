import "./index.scss";
import logo from "/public/images/logo.svg";
import { useEffect, useState } from "react";
import { Input, Button, Card, Pagination } from "antd";
import Meta from "antd/es/card/Meta";
import { FilterOutlined, SearchOutlined, SwapOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import axios from "axios";

function ProductPage() {
    const [fishData, setFishData] = useState([]); // Renamed to fishData for clarity
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // Fetch fish data from the API
    async function fetchFish() {
        try {
            const response = await axios.get(
                "http://103.90.227.69:8080/api/product/getall"
            );
            console.log(response.data);
            setFishData(response.data); // Set the fetched data
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchFish(); // Fetch fish data on component mount
    }, []);

    // Filter products based on search term
    const filteredProducts = fishData.filter(product =>
        product.productName && product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        // Logic for search can be added here if needed
    };

    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    return (
        <div className="product-page">
            <div className="product-content">
                <div className="search-wrapper">
                    <div className="search-filter">
                        <div className="filter-options">
                            <Button icon={<FilterOutlined />}>Bộ lọc</Button>
                        </div>
                        <form onSubmit={handleSearchSubmit} className="search-form">
                            <Input
                                placeholder="Tìm kiếm sản phẩm..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                            <Button type="submit" icon={<SearchOutlined />} className="search-button">Tìm kiếm</Button>
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
                            key={product.id}
                            hoverable
                            cover={<img src={product.image} alt={product.productName} />}
                            style={{ width: 240, margin: '16px', display: 'inline-block', height: '400px' }} // Adjusted height
                        >
                            <Meta 
                                title={<span className="product-name">{product.productName}</span>} 
                                description={
                                    <div>
                                        <p>Giống: {product.breed}</p>
                                        <p>Kích thước: {product.size}</p>
                                        <p>Giới tính: {product.sex}</p>
                                        <p className="price">Giá: {product.price} VND</p>
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