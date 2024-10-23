import { useState, useEffect } from 'react';

import "./index.scss";


import { Button } from 'antd';
import SelectFishModal from './selecfish-modal';
import { PlusOutlined, DeleteOutlined, RollbackOutlined, ShoppingCartOutlined } from '@ant-design/icons';

// Import the fish data from the modal file
const fishData = [
    {
        id: "DK001",
        image: "/images/kohaku.svg", // Ensure this image path is correct
        title: "Kohaku",
        price: '1.500.000',
        productID: '1',
        breed: 'Kohaku',
        size: '84cm',
        sex: 'Đực',
        healthStatus: 'Tốt',
        personalityTrait: 'Hiền',
        origin: 'Nhật bản',
        description: 'Koi Kohaku Là dòng Koi được yêu thích nhất. Là dòng Koi được lai tạo đầu tiên tại Nhật. Có lịch sử lâu đời (từ TK 19). Koi nổi bật với nước da trắng hơn tuyết, các điểm đỏ Hi lớn, phân bố đều, hài hòa trên thân.',
        certificateUrl: '', // Add certificate URL if available
    },
    {
        id: "DK002",
        image: "/images/koi5.svg", // Ensure this image path is correct
        title: "Showa",
        price: '2.300.000',
        productID: '2',
        breed: 'Showa',
        size: '100cm',
        sex: 'Cái',
        healthStatus: 'Tốt',
        personalityTrait: 'Hiền',
        origin: 'Nhật bản',
        description: 'Cá Koi Showa là dòng Gosanke tiêu chuẩn, thuộc dòng cá Koi nhóm AAA của Nhật Koi Showa hấp dẫn người chơi bởi 3 màu đỏ-đen-trắng. Trong đó, màu trắng (Shiroji) là màu nền, tiếp theo là màu đỏ (Hi) và màu đen (Sumi).',
        certificateUrl: '', // Add certificate URL if available
    },
];
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

function ComparePage() {
    const [selectedFishes, setSelectedFishes] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        // Set initial selected fishes with the imported fish data
        setSelectedFishes([fishData[0], fishData[1]]); // Automatically add the two fish
    }, []);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleSelect = (fish) => {
        if (selectedFishes.length < 2) {
            setSelectedFishes([...selectedFishes, fish]);
        }
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const removeFish = (index) => {
        const newFishes = selectedFishes.filter((_, i) => i !== index);
        setSelectedFishes(newFishes);
    };

    // New function to remove both fish
    const removeAllFishes = () => {
        setSelectedFishes([]);
    };

    return (
        <div className="compare-page">
            
            
            <div className="compare-content container">
                <div className="row">
                    <div className="col-5">
                        {selectedFishes.length > 0 ? (
                            <div className="fish-card">
                                <img src={selectedFishes[0].image} alt={selectedFishes[0].breed} className="fish-image" />
                                <h2>{selectedFishes[0].breed}</h2>
                                <p>Mã sản phẩm: {selectedFishes[0].productID}</p>
                                <p>Giống: {selectedFishes[0].breed}</p>
                                <p>Kích thước: {selectedFishes[0].size}</p>
                                <p>Giới tính: {selectedFishes[0].sex}</p>
                                <p>Tình trạng sức khỏe: {selectedFishes[0].healthStatus}</p>
                                <p>Đặc điểm tính cách: {selectedFishes[0].personalityTrait}</p>
                                <p>Nguồn gốc: {selectedFishes[0].origin}</p>
                                <p>Mô tả: {selectedFishes[0].description}</p>
                                <p>Chứng nhận: {selectedFishes[0].certificateUrl}</p>
                                <p>Giá: {selectedFishes[0].price} VND</p>
                                <div className="comparepage-button-wrapper">
                                    <Button className="comparepage-button" onClick={() => removeFish(0)}><DeleteOutlined />Xóa</Button>
                                    <Button className="comparepage-button" ><ShoppingCartOutlined />Thêm vào giỏ hàng</Button>
                                </div>
                            </div>
                        ) : (
                            <p>Chưa có sản phẩm nào được chọn để so sánh.</p>
                        )}
                    </div>
                    <div className="col-5">
                        {selectedFishes.length > 1 ? (
                            <div className="fish-card">
                                <img src={selectedFishes[1].image} alt={selectedFishes[1].breed} className="fish-image" />
                                <h2>{selectedFishes[1].breed}</h2>
                                <p>Mã sản phẩm: {selectedFishes[1].productID}</p>
                                <p>Giống: {selectedFishes[1].breed}</p>
                                <p>Kích thước: {selectedFishes[1].size}</p>
                                <p>Giới tính: {selectedFishes[1].sex}</p>
                                <p>Tình trạng sức khỏe: {selectedFishes[1].healthStatus}</p>
                                <p>Đặc điểm tính cách: {selectedFishes[1].personalityTrait}</p>
                                <p>Nguồn gốc: {selectedFishes[1].origin}</p>
                                <p>Mô tả: {selectedFishes[1].description}</p>
                                <p>Chứng nhận: {selectedFishes[1].certificateUrl}</p>
                                <p>Giá: {selectedFishes[1].price} VND</p>
                                <div className="comparepage-button-wrapper">
                                    <Button className="comparepage-button" onClick={() => removeFish(1)}><DeleteOutlined />Xóa</Button>
                                    <Button className="comparepage-button" ><ShoppingCartOutlined />Thêm vào giỏ hàng</Button>
                                </div>
                            </div>
                        ) : (
                            <p>Chưa có sản phẩm nào được chọn để so sánh.</p>
                        )}
                    </div>
                    <div className="col-2">
                        <Button className="comparepage-button" onClick={() => window.history.back()}><RollbackOutlined />Quay lại</Button>
                        <Button className="comparepage-button" onClick={showModal}><PlusOutlined />Thêm sản phẩm</Button>

                        <Button className="comparepage-button" onClick={removeAllFishes} disabled={selectedFishes.length === 0}>
                        <DeleteOutlined />Xóa tất cả
                        </Button>
                    </div>
                </div>
                <SelectFishModal
                    visible={isModalVisible}
                    onClose={handleCancel}
                    onSelect={handleSelect}
                />
            </div>
        </div>
    );
};

export default ComparePage;