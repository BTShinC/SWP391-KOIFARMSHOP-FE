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
];

function ProductPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredProducts = koiImage.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        // Logic for search can be added here if needed
    };

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
                    {filteredProducts.map(product => (
                        <Card
                            key={product.id}
                            hoverable
                            cover={<img src={product.imgSrc} alt={product.title} />}
                            style={{ width: 240, margin: '16px' }}
                        >
                            <Meta title={product.title} description="2.500k" />
                        </Card>
                    ))}
                </div>
            </div>
            <div className="pagination-wrapper">
                <Pagination align="center" defaultCurrent={1} total={50} />
            </div>
            <Footer />
        </div>
    );
}

export default ProductPage;
