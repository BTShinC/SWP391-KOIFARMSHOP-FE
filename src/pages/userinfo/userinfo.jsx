import React from 'react';
import './userinfo.css';

const UserInfo = () => {
  
  const user = {
    fullName: "John Doe",
    address: "123 Main St, Anytown, USA",
    email: "john.doe@example.com",
    phoneNumber: "(555) 123-4567",
    accountBalance: 5000.00
  };

  return (
    <div className="userinfo-container">
      <h2>User Information</h2>
      <div className="userinfo-item">
        <span>Full Name:</span> {user.fullName}
      </div>
      <div className="userinfo-item">
        <span>Address:</span> {user.address}
      </div>
      <div className="userinfo-item">
        <span>Email:</span> {user.email}
      </div>
      <div className="userinfo-item">
        <span>Phone Number:</span> {user.phoneNumber}
      </div>
      <div className="userinfo-item">
        <span>Account Balance:</span> ${user.accountBalance.toFixed(2)}
      </div>
    </div>
  );
};

export default UserInfo;