import React, { useState } from 'react';
import { Modal, Input, Button, Card, Pagination } from 'antd';
import PropTypes from 'prop-types';
import Meta from 'antd/es/card/Meta';
import "./index.scss";

// Sample fish data for selection with additional properties
const sampleFishData = [
    {
        id: 1,
        imgSrc: "/images/kohaku.svg",
        title: "Tancho Kohaku",
        price: '25000000',
        productID: '001',
        breed: 'Tancho Kohaku',
        size: '80cm',
        sex: 'Đực',
        healthStatus: 'Tốt',
        personalityTrait: 'Đặc biệt',
        origin: 'Danchi Farm',
        description: 'Mô tả cá 1',
        certificateUrl: 'Chứng nhận 1',
    },
    {
        id: 2,
        imgSrc: "/images/koi5.svg",
        title: "Shiro Utsuri",
        price: '22000000',
        productID: '002',
        breed: 'Shiro Utsuri',
        size: '75cm',
        sex: 'Cái',
        healthStatus: 'Tốt',
        personalityTrait: 'Hiền lành',
        origin: 'Koi Farm',
        description: 'Mô tả cá 2',
        certificateUrl: 'Chứng nhận 2',
    },
    {
        id: 3,
        imgSrc: "/images/koi6.svg",
        title: "Sanke",
        price: '20000000',
        productID: '003',
        breed: 'Sanke',
        size: '70cm',
        sex: 'Đực',
        healthStatus: 'Khỏe mạnh',
        personalityTrait: 'Năng động',
        origin: 'Koi Farm',
        description: 'Mô tả cá 3',
        certificateUrl: 'Chứng nhận 3',
    },
    {
        id: 4,
        imgSrc: "/images/kohaku.svg",
        title: "Benigoi",
        price: '21000000',
        productID: '004',
        breed: 'Benigoi',
        size: '85cm',
        sex: 'Cái',
        healthStatus: 'Tốt',
        personalityTrait: 'Thân thiện',
        origin: 'Danchi Farm',
        description: 'Mô tả cá 4',
        certificateUrl: 'Chứng nhận 4',
    },
    {
        id: 5,
        imgSrc: "/images/koi5.svg",
        title: "Asagi",
        price: '23000000',
        productID: '005',
        breed: 'Asagi',
        size: '78cm',
        sex: 'Đực',
        healthStatus: 'Tốt',
        personalityTrait: 'Thích nghi',
        origin: 'Koi Farm',
        description: 'Mô tả cá 5',
        certificateUrl: 'Chứng nhận 5',
    },
    {
        id: 6,
        imgSrc: "/images/koi6.svg",
        title: "Showa Sanshoku",
        price: '24000000',
        productID: '006',
        breed: 'Showa Sanshoku',
        size: '82cm',
        sex: 'Cái',
        healthStatus: 'Khỏe mạnh',
        personalityTrait: 'Năng động',
        origin: 'Danchi Farm',
        description: 'Mô tả cá 6',
        certificateUrl: 'Chứng nhận 6',
    },
    {
        id: 7,
        imgSrc: "/images/koi5.svg",
        title: "Karashi",
        price: '19000000',
        productID: '007',
        breed: 'Karashi',
        size: '76cm',
        sex: 'Đực',
        healthStatus: 'Tốt',
        personalityTrait: 'Thân thiện',
        origin: 'Koi Farm',
        description: 'Mô tả cá 7',
        certificateUrl: 'Chứng nhận 7',
    },
    {
        id: 8,
        imgSrc: "/images/koi6.svg",
        title: "Kohaku",
        price: '26000000',
        productID: '008',
        breed: 'Kohaku',
        size: '80cm',
        sex: 'Cái',
        healthStatus: 'Tốt',
        personalityTrait: 'Đặc biệt',
        origin: 'Danchi Farm',
        description: 'Mô tả cá 8',
        certificateUrl: 'Chứng nhận 8',
    },
    {
        id: 9,
        imgSrc: "/images/kohaku.svg",
        title: "Shusui",
        price: '28000000',
        productID: '009',
        breed: 'Shusui',
        size: '75cm',
        sex: 'Đực',
        healthStatus: 'Khỏe mạnh',
        personalityTrait: 'Năng động',
        origin: 'Koi Farm',
        description: 'Mô tả cá 9',
        certificateUrl: 'Chứng nhận 9',
    },
    {
        id: 10,
        imgSrc: "/images/koi5.svg",
        title: "Hikari Muji",
        price: '30000000',
        productID: '010',
        breed: 'Hikari Muji',
        size: '82cm',
        sex: 'Cái',
        healthStatus: 'Tốt',
        personalityTrait: 'Thích nghi',
        origin: 'Danchi Farm',
        description: 'Mô tả cá 10',
        certificateUrl: 'Chứng nhận 10',
    },
    // Add more fish as needed...
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