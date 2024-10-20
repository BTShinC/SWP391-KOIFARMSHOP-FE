// src/pages/productCombo/ProductComboPage.jsx
import "./index.scss";
import { useEffect, useState } from "react";
import { Card, Pagination, Input, Button, Dropdown, Menu } from "antd";
import Meta from "antd/es/card/Meta";
import { FilterOutlined } from "@ant-design/icons";
import axios from "axios";
import { Link } from "react-router-dom";

function ProductComboPage() {
    const [comboData, setComboData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
          style: 'decimal',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(amount);
      };
    

    // Fetch product combo data from the API
    async function fetchComboData() {
        try {
            const response = await axios.get("http://103.90.227.69:8080/api/productcombo");
            setComboData(response.data);
        } catch (error) {
            console.error("Error fetching product combo data:", error);
        }
    }

    useEffect(() => {
        fetchComboData();
    }, []);

    // Filter product combos based on search term
    const filteredCombos = comboData.filter(combo =>
        combo.comboName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastCombo = currentPage * itemsPerPage;
    const indexOfFirstCombo = indexOfLastCombo - itemsPerPage;
    const currentCombos = filteredCombos.slice(indexOfFirstCombo, indexOfLastCombo);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Dropdown menu for filter options
    const menu = (
        <Menu>
            <Menu.Item key="1">
                <Link to="/product">Theo cá thể</Link>
            </Menu.Item>
            <Menu.Item key="2">
                <Link to="/productcombo">Theo lô</Link>
            </Menu.Item>
        </Menu>
    );

    return (
        <div className="product-combo-page">
            <div className="search-wrapper">
                <div className="search-filter">
                    <div className="filter-options">
                        <Dropdown overlay={menu} trigger={['click']}>
                            <Button icon={<FilterOutlined />}>Bộ lọc</Button>
                        </Dropdown>
                    </div>
                    <Input
                        placeholder="Tìm kiếm combo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>
            <h2>Các Combo Sản Phẩm</h2>
            <div className="product-list">
                {currentCombos.map(combo => (
                    <Card
                        key={combo.comboName}
                        hoverable
                        cover={<img src={combo.image} alt={combo.comboName} />}
                        style={{ width: 240, margin: '16px', display: 'inline-block' }}
                    >
                        <Meta
                            title={<span className="combo-name">{combo.comboName}</span>}
                            description={
                                <div>
                                    <p>Giống: {combo.breed}</p>
                                    <p>Kích cỡ trung bình: {combo.size}cm</p>
                                    <p>Số lượng: {combo.quantity} con</p>
                                    <p className="price">{formatCurrency(combo.price)} VND</p>
                                    <div className="select-button-wrapper">
                                        <Link to={`/singleproductcombo/${combo.productComboID}`}>
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
            <div className="pagination-wrapper">
                <Pagination
                    current={currentPage}
                    pageSize={itemsPerPage}
                    total={filteredCombos.length}
                    onChange={handlePageChange}
                    style={{ marginTop: '20px', textAlign: 'center' }}
                />
            </div>
        </div>
    );
}

export default ProductComboPage;