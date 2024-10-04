import React, { useState, useEffect } from 'react';
import logo from '/public/logo.svg';
import "./index.scss";
import Header from '../../components/header';
import Footer from '../../components/footer';
import { Button } from 'antd';
import SelectFishModal from './selecfish-modal';
import { PlusOutlined, DeleteOutlined, RollbackOutlined, ShoppingCartOutlined } from '@ant-design/icons';


// Sample fish data for testing
const sampleFish = {
    productID: '001',
    breed: 'Tancho Kohaku',
    size: '80cm',
    sex: 'Đực',
    healthStatus: 'Tốt',
    personalityTrait: 'Đặc biệt',
    origin: 'Danchi Farm',
    description: 'Mô tả cá 1',
    certificateUrl: 'Chứng nhận 1',
    price: '25000000 VND',
    imgSrc: '/images/kohaku.svg', // Add image source
};

function ComparePage() {
    const [selectedFishes, setSelectedFishes] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        // setSelectedFishes([sampleFish]); // Set sample fish for testing
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
            <Header />
            <div className="banner-wraper">
                <div className="banner-container">
                    <img src={logo} alt="Logo" className="logo" />
                    <h2 className="shop-name">So sánh cá</h2>
                </div>
            </div>
            <div className="compare-content container">
                <div className="row">
                    <div className="col-5">
                        {selectedFishes.length > 0 ? (
                            <div className="fish-card">
                                <img src={selectedFishes[0].imgSrc} alt={selectedFishes[0].breed} className="fish-image" />
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
                                <img src={selectedFishes[1].imgSrc} alt={selectedFishes[1].breed} className="fish-image" />
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
            <Footer />
        </div>
    );
};

export default ComparePage;