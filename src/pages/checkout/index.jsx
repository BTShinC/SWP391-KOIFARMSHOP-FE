// src/pages/checkout/CheckoutPage.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../redux/features/createSlice";
import { Button, message, Divider } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./index.scss"; // Import the CSS file

function CheckoutPage() {
    const user = useSelector((state) => state.user);
    const cartItems = useSelector((state) => state.cart.items);
    const account = useSelector((state) => state.user.account);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);
    const [discount, setDiscount] = useState(0);
    const deliveryFee = 0;
    const [finalPrice, setFinalPrice] = useState(0);

    useEffect(() => {
        const calculateTotal = () => {
            const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
            setTotalAmount(subtotal);
            if (subtotal >= 2000000) {
                const discountAmount = subtotal * 0.05; // 5% discount if order > 2,000,000
                setDiscount(discountAmount);
            } else {
                setDiscount(0);
            }
            setFinalPrice(subtotal - discount + deliveryFee);
        };
        calculateTotal();

        // Also recalculate on discount change
        const recalculateOnDiscountChange = () => {
            calculateTotal();
        }

        recalculateOnDiscountChange();
    }, [cartItems, discount]);

    const deductAccountBalance = async (accountID, amount) => {
        const apiUrl = `http://103.90.227.69:8080/api/account/deductBalance/${accountID}?amount=${amount}`;
        try {
            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to update account balance');
            }
        } catch (error) {
            console.error('Error updating account balance:', error);
        }
    };

    const handleConfirmOrder = async () => {
        if (!account || !account.accountID) {
            message.error("User account not found.");
            return;
        }

        try {
            // Log the account ID to ensure it's correct
            console.log("Account ID:", account.accountID);

            // Check account balance
            const balanceResponse = await axios.get(`http://103.90.227.69:8080/api/account/${account.accountID}`);
            const accountBalance = balanceResponse.data.accountBalance;

            // Prepare order data
            const productIds = cartItems
                .filter(item => item.type === 'Product')
                .map(item => item.productId);
            const productComboIds = cartItems
                .filter(item => item.type === 'Combo')
                .map(item => item.productComboId);

            if (accountBalance >= finalPrice) {
                // Deduct balance from account using the predefined function
                await deductAccountBalance(account.accountID, finalPrice);

                // Prepare query parameters
                const params = new URLSearchParams({
                    accountId: account.accountID,
                    ...productIds.length > 0 && { productIds: productIds.join(',') },
                    ...productComboIds.length > 0 && { productComboIds: productComboIds.join(',') }
                });

                // Log the query parameters for debugging
                console.log("Query Parameters:", params.toString());

                // Place the order
                const orderResponse = await axios.post(
                    `http://103.90.227.69:8080/api/orders/makeOrder?${params.toString()}`
                );

                console.log("Order Response:", orderResponse.data);

                // Clear the cart after successful order
                dispatch(clearCart());

                message.success("Đơn hàng của bạn đã được đặt thành công!");
                message.success("Bạn sẽ được điều hướng về trang chủ trong 5s, vui lòng đừng thao tác!");
                // Countdown effect before navigating
                let countdown = 3;
                const countdownInterval = setInterval(() => {
                    if (countdown <= 0) {
                        clearInterval(countdownInterval);
                        navigate("/");
                    } else {
                        countdown--;
                    }
                }, 1000);
            } else {
                message.info("Tài khoản hiện không đủ số dư!", 5);
                // Show buttons for wallet and cancel
                message.info(
                    <div className="no-money-msg">
                        Nạp tiền ngay?
                        <Button style={{ marginLeft: "20px" }} onClick={() => navigate("/wallet")}>Nạp tiền</Button>
                    </div>
                );
            }
        } catch (error) {
            console.error("Error during order confirmation:", error);
            if (error.response) {
                console.error("Response data:", error.response.data);
                message.error(`Có lỗi khi đặt hàng: ${error.response.data}`);
            } else {
                message.error("Có lỗi khi đặt hàng.");
            }
        }
    };

    return (
        <div className="checkout-wrapper">
            <div className="checkout-page">
                <h2>Thanh toán</h2>
                <Divider />
                <div className="checkout-details">
                    <div>
                        <span>Tổng số tiền:</span>
                        <span>{totalAmount.toLocaleString("vi-VN")} VNĐ</span>
                    </div>

                    <div>
                        <span>Giảm giá:</span>
                        <span>{discount.toLocaleString("vi-VN")} VNĐ</span>
                    </div>

                    <div>
                        <span>Phí giao hàng:</span>
                        <span>{deliveryFee.toLocaleString("vi-VN")} VNĐ</span>
                    </div>
                    <Divider />
                    <div>
                        <strong>Tổng cộng:</strong>
                        <strong style={{ color: "#B88E2F" }}>{finalPrice.toLocaleString("vi-VN")} VNĐ</strong>
                    </div>
                </div>
                <Button type="primary" onClick={handleConfirmOrder} style={{ marginTop: "20px" }}>
                    Xác nhận đặt hàng
                </Button>
                <Link to="/shoppingcart" >
                    <Button type="primary" style={{ marginTop: "20px" }}>
                        Quay lại
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default CheckoutPage;
