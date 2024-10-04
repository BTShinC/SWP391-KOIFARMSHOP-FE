import "./index.scss";
import logo from '/public/logo.svg';
import Header from "../../components/header";
import Footer from "../../components/footer";
import { useState } from "react";
import { Input, Button, Card, Pagination } from "antd";
import Meta from "antd/es/card/Meta";
import { FilterOutlined, SearchOutlined, SwapOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom"; 

const koiImage = [
    { id: 1, imgSrc: "/images/kohaku.svg", title: "Asagi" },
    { id: 2, imgSrc: "/images/koi5.svg", title: "Showa Sanshoku" },
    { id: 3, imgSrc: "/images/koi6.svg", title: "Karashi" },
    { id: 4, imgSrc: "/images/kohaku.svg", title: "Benigoi" },
    { id: 5, imgSrc: "/images/kohaku.svg", title: "Asagi" },
    { id: 6, imgSrc: "/images/koi5.svg", title: "Showa Sanshoku" },
    { id: 7, imgSrc: "/images/koi6.svg", title: "Karashi" },
    { id: 8, imgSrc: "/images/kohaku.svg", title: "Benigoi" },
    { id: 9, imgSrc: "/images/koi5.svg", title: "Karashi" },
    { id: 10, imgSrc: "/images/kohaku.svg", title: "Asagi" },
    { id: 11, imgSrc: "/images/koi5.svg", title: "Koi 1" },
    { id: 12, imgSrc: "/images/koi6.svg", title: "Koi 2" },
    { id: 13, imgSrc: "/images/kohaku.svg", title: "Koi 3" },
    { id: 14, imgSrc: "/images/koi5.svg", title: "Koi 4" },
    { id: 15, imgSrc: "/images/koi6.svg", title: "Koi 5" },
    { id: 16, imgSrc: "/images/kohaku.svg", title: "Koi 6" },
    { id: 17, imgSrc: "/images/koi5.svg", title: "Koi 7" },
    { id: 18, imgSrc: "/images/koi6.svg", title: "Koi 8" },
    { id: 19, imgSrc: "/images/kohaku.svg", title: "Koi 9" },
    { id: 20, imgSrc: "/images/koi5.svg", title: "Koi 10" },
    { id: 21, imgSrc: "/images/koi6.svg", title: "Koi 11" },
    { id: 22, imgSrc: "/images/kohaku.svg", title: "Koi 12" },
    { id: 23, imgSrc: "/images/koi5.svg", title: "Koi 13" },
    { id: 24, imgSrc: "/images/koi6.svg", title: "Koi 14" },
    { id: 25, imgSrc: "/images/kohaku.svg", title: "Koi 15" },
    { id: 26, imgSrc: "/images/koi5.svg", title: "Koi 16" },
    { id: 27, imgSrc: "/images/koi6.svg", title: "Koi 17" },
    // { id: 28, imgSrc: "/images/kohaku.svg", title: "Koi 18" },
    // { id: 29, imgSrc: "/images/koi5.svg", title: "Koi 19" },
    // { id: 30, imgSrc: "/images/koi6.svg", title: "Koi 20" },
];

function ProductPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; 

    const filteredProducts = koiImage.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
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
            <Header />
            <div className="banner-wraper">
                <div className="banner-container">
                    <img src={logo} alt="Logo" className="logo" />
                    <h2 className="shop-name">Cá Koi Nhật</h2>
                </div>
            </div>
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
                            cover={<img src={product.imgSrc} alt={product.title} />}
                            style={{ width: 240, margin: '16px', display: 'inline-block' }} // Adjusted for inline-block
                        >
                            <Meta title={product.title} description="2.500k" />
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
            <Footer />
        </div>
    );
}

export default ProductPage;
