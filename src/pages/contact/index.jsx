import { useState } from "react";

import Footer from '../../components/footer';
import logo from '/public/logo.svg'
import { EnvironmentOutlined, PhoneOutlined, ClockCircleOutlined } from '@ant-design/icons';
import './index.scss';

const initFormValue = {
    name: "",
    contact: "",
    subject: "",
    message: "",
};


function ContactPage() {
    const [formValue, setFormValue] = useState(initFormValue);
    const handleChange = (event) => {
        const { value, name } = event.target;
        setFormValue({
            ...formValue,
            [name]: value,
        });
    };


    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Contact info:", formValue);

    };


    return (
        <div>

            <div className="banner-wraper">
                <div className="banner-container">
                    <img src={logo} alt="Logo" className="logo" />
                    <h2 className="shop-name">Liên hệ</h2>
                </div>
            </div>

            <div className='title'>
                <h2>Liên hệ trực tiếp với chúng tôi</h2><br></br>
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
                            <div className="content-2">
                                <form onSubmit={handleSubmit} className="form">
                                    <div className="form">
                                        <label className="form-label">Tên</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="name"
                                            value={formValue.name}
                                            placeholder="Nhập tên của bạn"
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form">
                                        <label className="form-label">Email hoặc số điện thoại</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="contact"
                                            value={formValue.contact}
                                            placeholder="Nhập email hoặc số điện thoại"
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form">
                                        <label className="form-label">Chủ đề</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="subject"
                                            value={formValue.subject}
                                            placeholder="Nhập chủ đề"
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form message">
                                        <label className="form-label">Nội dung</label>
                                        <input
                                            className="form-control"
                                            name="message"
                                            value={formValue.message}
                                            placeholder="Nhập nội dung"
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>



                                    <button type="submit" className="contact-button">
                                        Xác nhận và gửi
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ContactPage