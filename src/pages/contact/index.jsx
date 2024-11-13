import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { EnvironmentOutlined, PhoneOutlined, ClockCircleOutlined } from '@ant-design/icons';
import './index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from "../../config/api";

const initFormValue = {
    name: "",
    contact: "",
    subject: "",
    message: "",
    status: "Chờ xử lý"
};

function ContactPage() {
    const [formValue, setFormValue] = useState(initFormValue);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValue({
            ...formValue,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("Contact info:", formValue);

        const questionData = {
            userName: formValue.name,
            contact: formValue.contact,
            topic: formValue.subject,
            question: formValue.message,
            status: "Chờ xử lý" // Assuming the initial status is "pending"
        };

        console.log("Question data to be sent:", questionData);

        try {
            const response = await api.post('/question/create', questionData);
            console.log("Question created:", response.data);
            message.success("Câu hỏi của bạn đã được gửi thành công!");
            setFormValue(initFormValue); // Reset form after successful submission
        } catch (error) {
            console.error("Error creating question:", error);
            if (error.response && error.response.data) {
                console.error("Response data:", error.response.data);
                message.error(`Có lỗi xảy ra: ${error.response.data.message}`);
            } else {
                message.error("Có lỗi xảy ra khi gửi câu hỏi của bạn.");
            }
        }
    };

    return (
        <div>
            <div className='title'>
                <h2>Liên hệ trực tiếp với chúng tôi</h2><br />
                <p>Mọi thắc mắc xin liên hệ trực tiếp với chúng tôi, nhân viên của chúng tôi luôn nhiệt tình hỗ trợ quý khách!</p>
            </div>

            <div className="contact-form">
                <div className='contact-container'>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="content-1">
                                <h3><EnvironmentOutlined /> Địa chỉ</h3>
                                <p>Số 10 ngách 54, ngõ 76 An Dương, Q. Tây Hồ, Hà Nội</p>

                                <h3><PhoneOutlined /> Số Điện thoại</h3>
                                <p>0967838745</p>

                                <h3><ClockCircleOutlined /> Giờ làm việc</h3>
                                <p>Thứ 2 - Thứ 6: 9h - 22h</p>
                                <p>Thứ 7 - CN: 9h - 21h</p>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <Form onSubmit={handleSubmit} className="form">
                                <Form.Item className="form-label">
                                    <Input
                                        name="name"
                                        value={formValue.name}
                                        onChange={handleChange}
                                        placeholder="Tên của bạn"
                                        className="form-control"
                                        required
                                    />
                                </Form.Item>
                                <Form.Item className="form-label">
                                    <Input
                                        name="contact"
                                        value={formValue.contact}
                                        onChange={handleChange}
                                        placeholder="Số điện thoại"
                                        className="form-control"
                                        required
                                        pattern="\d{10}"
                                        title="Số điện thoại phải là 10 chữ số"
                                    />
                                </Form.Item>
                                <Form.Item className="form-label">
                                    <Input
                                        name="subject"
                                        value={formValue.subject}
                                        onChange={handleChange}
                                        placeholder="Chủ đề"
                                        className="form-control"
                                        required
                                    />
                                </Form.Item>
                                <Form.Item className="form-label">
                                    <Input.TextArea
                                        name="message"
                                        value={formValue.message}
                                        onChange={handleChange}
                                        placeholder="Nội dung"
                                        className="form-control"
                                        required
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" className="contact-button" onClick={handleSubmit}>
                                        Xác nhận và gửi
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactPage;