import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Card, Pagination } from 'antd';
import PropTypes from 'prop-types';
import Meta from 'antd/es/card/Meta';
import axios from 'axios'; // Added axios
import "./index.scss";




const SelectFishModal = ({ visible, onClose, onSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [fishData, setFishData] = useState([]); // Added state for fish data
    const itemsPerPage = 4; // Number of items per page

    // Fetch fish data from the API
    const fetchFish = async () => {
        try {
            const response = await axios.get("http://103.90.227.69:8080/api/product/getall"); // API endpoint
            setFishData(response.data); // Set the fetched data
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchFish(); // Fetch fish data on component mount
    }, []);

    const filteredFish = fishData.filter(fish =>
        fish.productName && fish.productName.toLowerCase().includes(searchTerm.toLowerCase()) // Updated filter
    );

    const handleSelect = (fish) => {
        onSelect(fish);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Calculate the current items to display
    const indexOfLastFish = currentPage * itemsPerPage;
    const indexOfFirstFish = indexOfLastFish - itemsPerPage;
    const currentFish = filteredFish.slice(indexOfFirstFish, indexOfLastFish);

    return (
        <Modal
            title="Chọn cá để so sánh"
            visible={visible}
            onCancel={onClose}
            footer={null}
            width={800} // Adjust width as needed
        >
            <Input
                placeholder="Tìm kiếm cá..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: '20px' }}
            />
            <div className="product-list">
                {currentFish.map(fish => (
                    <Card
                        key={fish.id}
                        hoverable
                        cover={<img src={fish.image} alt={fish.title} />}
                        style={{ width: 240, margin: '16px', display: 'inline-block' }}
                    >
                        <Meta 
                                title={<span className="product-name">{fish.productName}</span>} 
                                description={
                                    <div>
                                        <p>Giống: {fish.breed}</p>
                                        <p>Kích thước: {fish.size}</p>
                                        <p>Giới tính: {fish.sex}</p>
                                        <p className="price">Giá: {fish.price} VND</p>
                                    </div>
                                } 
                            />
                        <div className="select-button-wrapper">
                            <Button className="select-button" onClick={() => handleSelect(fish)} style={{ marginTop: '10px' }}>
                                Chọn
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
            <Pagination className="pagination"
                current={currentPage}
                pageSize={itemsPerPage}
                total={filteredFish.length}
                onChange={handlePageChange}
                style={{ marginTop: '20px', textAlign: 'center' }}
            />
        </Modal>
    );
};

SelectFishModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
};

export default SelectFishModal;