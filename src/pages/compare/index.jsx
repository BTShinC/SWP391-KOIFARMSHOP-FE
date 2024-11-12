import { useState, useEffect } from 'react';
import "./index.scss";
import { Button } from 'antd';
import SelectFishModal from './selecfish-modal';
import { PlusOutlined, DeleteOutlined, RollbackOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import api from '../../config/api';

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
    // Fetch fish details for P001 and P002 when the page is first accessed
    const fetchInitialFishes = async () => {
      try {
        const fish1Response = await api.get(`/product/get/P001`);
        const fish2Response = await api.get(`/product/get/P002`);
        setSelectedFishes([fish1Response.data, fish2Response.data]);
      } catch (error) {
        console.error("Error fetching initial fish details:", error);
      }
    };

    fetchInitialFishes();
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
                            <p><strong>Mã sản phẩm:</strong> {selectedFishes[0].productID}</p>
                            <p><strong>Giống:</strong> {selectedFishes[0].breed}</p>
                            <p><strong>Kích thước:</strong> {selectedFishes[0].size}cm</p>
                            <p><strong>Giới tính:</strong> {selectedFishes[0].sex}</p>
                            <p><strong>Tình trạng sức khỏe:</strong> {selectedFishes[0].healthStatus}</p>
                            <p><strong>Đặc điểm tính cách:</strong> {selectedFishes[0].personalityTrait}</p>
                            <p><strong>Nguồn gốc:</strong> {selectedFishes[0].origin}</p>
                            <p><strong>Mô tả:</strong> {selectedFishes[0].description}</p>
                            <p><strong>Giá:</strong> {formatCurrency(selectedFishes[0].price)} VND</p>
                            <div className="comparepage-button-wrapper">
                                <Button className="comparepage-button" onClick={() => removeFish(0)}><DeleteOutlined />Xóa</Button>
                                <Link to={`/singleproduct/${selectedFishes[0].productID}`}>
                                <Button className="comparepage-button"><ExclamationCircleOutlined />Chi tiết</Button>
                                </Link>
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
                            <p><strong>Mã sản phẩm:</strong> {selectedFishes[1].productID}</p>
                            <p><strong>Giống:</strong> {selectedFishes[1].breed}</p>
                            <p><strong>Kích thước:</strong> {selectedFishes[1].size}cm</p>
                            <p><strong>Giới tính:</strong> {selectedFishes[1].sex}</p>
                            <p><strong>Tình trạng sức khỏe:</strong> {selectedFishes[1].healthStatus}</p>
                            <p><strong>Đặc điểm tính cách:</strong> {selectedFishes[1].personalityTrait}</p>
                            <p><strong>Nguồn gốc:</strong> {selectedFishes[1].origin}</p>
                            <p><strong>Mô tả:</strong> {selectedFishes[1].description}</p>
                            <p><strong>Giá:</strong> {formatCurrency(selectedFishes[1].price)} VND</p>
                            <div className="comparepage-button-wrapper">
                                <Button className="comparepage-button" onClick={() => removeFish(1)}><DeleteOutlined />Xóa</Button>
                                <Link to={`/singleproduct/${selectedFishes[1].productID}`}>
                                <Button className="comparepage-button"><ExclamationCircleOutlined />Chi tiết</Button>
                                </Link>
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
}

export default ComparePage;