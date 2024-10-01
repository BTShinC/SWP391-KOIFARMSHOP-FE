import React, { useState } from 'react';
import { Modal, Input, Button, Card, Pagination } from 'antd';
import PropTypes from 'prop-types';
import Meta from 'antd/es/card/Meta';
import "./index.scss";

// Sample fish data for selection
const sampleFishData = [
    { id: 1, imgSrc: "/images/kohaku.svg", title: "Tancho Kohaku", price: '25000000 VND' },
    { id: 2, imgSrc: "/images/koi5.svg", title: "Shiro Utsuri", price: '22000000 VND' },
    { id: 3, imgSrc: "/images/koi6.svg", title: "Sanke", price: '20000000 VND' },
    { id: 4, imgSrc: "/images/kohaku.svg", title: "Benigoi", price: '21000000 VND' },
    { id: 5, imgSrc: "/images/koi5.svg", title: "Asagi", price: '23000000 VND' },
    { id: 6, imgSrc: "/images/koi6.svg", title: "Showa Sanshoku", price: '24000000 VND' },
    { id: 7, imgSrc: "/images/koi5.svg", title: "Karashi", price: '19000000 VND' },
    { id: 8, imgSrc: "/images/koi6.svg", title: "Kohaku", price: '26000000 VND' },
    { id: 9, imgSrc: "/images/kohaku.svg", title: "Shusui", price: '28000000 VND' },
    { id: 10, imgSrc: "/images/koi5.svg", title: "Hikari Muji", price: '30000000 VND' },
    { id: 11, imgSrc: "/images/koi6.svg", title: "Kumonryu", price: '27000000 VND' },
    { id: 12, imgSrc: "/images/koi5.svg", title: "Ginrin", price: '29000000 VND' },
    { id: 13, imgSrc: "/images/koi6.svg", title: "Koi Koi", price: '31000000 VND' },
    { id: 14, imgSrc: "/images/kohaku.svg", title: "Koi Koi 2", price: '32000000 VND' },
    { id: 15, imgSrc: "/images/koi6.svg", title: "Koi Koi 3", price: '33000000 VND' },
    { id: 16, imgSrc: "/images/kohaku.svg", title: "Shusui", price: '28000000 VND' },
];
const SelectFishModal = ({ visible, onClose, onSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4; // Number of items per page

    const filteredFish = sampleFishData.filter(fish =>
        fish.title.toLowerCase().includes(searchTerm.toLowerCase())
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
                        cover={<img src={fish.imgSrc} alt={fish.title} />}
                        style={{ width: 240, margin: '16px', display: 'inline-block' }}
                    >
                        <Meta title={fish.title} description={`Giá: ${fish.price}`} />
                        <Button onClick={() => handleSelect(fish)} style={{ marginTop: '10px' }}>
                            Chọn
                        </Button>
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