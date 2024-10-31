// import PropTypes from "prop-types";
// import { Button, Modal } from "antd";
// import { useState } from "react";
// import "./index.scss";

// ChangeStatus.propTypes = {
//   data: PropTypes.object.isRequired, // Nhận dữ liệu là một đối tượng
// };

// function ChangeStatus({ data }) {
//   const initOrder = {
//     orderId: data.orderId,
//     // customerId: data.customerId,
//     totalAmount: data.totalAmount,
//     orderDate: data.orderDate,
//     status: data.status,
//   };

//   const [newOrder, setNewOrder] = useState(initOrder);
//   const [showButtons, setShowButtons] = useState(false); // Trạng thái để hiển thị các nút cập nhật

//   // Hàm xử lý khi nhấn vào nút "Cập nhật trạng thái"
//   const handleShowButtons = () => {
//     setShowButtons(true); // Hiển thị các nút cập nhật
//   };
//   const handleCloseButtons = () => {
//     setShowButtons(false);
//   };

//   // Hàm xử lý khi cập nhật trạng thái đơn hàng
//   const handleUpdateStatus = (newStatus) => {
//     if (newStatus === "Đã hủy") {
//       // Hiển thị Modal xác nhận hủy
//       Modal.confirm({
//         title: "Bạn chắc chắn muốn hủy?",
//         okText: "Yes",
//         cancelText: "No",
//         centered: true,
//         onOk: () => {
//           // Hành động khi người dùng nhấn "Yes"
//           setNewOrder((preNewOrder) => {
//             const updatedForm = {
//               ...preNewOrder,
//               status: newStatus,
//             };
//             console.log(updatedForm);
//             return updatedForm;
//           });
//         },
//         onCancel: () => {
//           // Hành động khi người dùng nhấn "No" (Không cần làm gì nếu chỉ muốn đóng modal)
//         },
//       });
//     } else {
//       // Cập nhật trạng thái nếu không phải "Đã hủy"
//       setNewOrder((preNewOrder) => {
//         const updatedForm = {
//           ...preNewOrder,
//           status: newStatus,
//         };
//         console.log(updatedForm);
//         return updatedForm;
//       });
//     }
//   };

//   return (
//     <div>
//       {!showButtons ? (
//         <Button onClick={handleShowButtons}>Cập nhật trạng thái</Button>
//       ) : (
//         <div className="change-status-button__container">
//           <div className="change-status-button__close">
//             <Button onClick={handleCloseButtons}>Ẩn cập nhật trạng thái</Button>
//           </div>
//           <div className="change-status-button">
//             {newOrder.status == "Đang xử lý" ? (
//               <>
//                 <Button
//                   className="custom-button__transport"
//                   onClick={() => handleUpdateStatus("Đang chuẩn bị")}
//                 >
//                   Xác nhận
//                 </Button>
//                 <Button
//                   type="primary"
//                   danger
//                   onClick={() => handleUpdateStatus("Đã hủy")}
//                 >
//                   Hủy đơn
//                 </Button>
//               </>
//             ) : newOrder.status == "Đang chuẩn bị" ? (
//               <Button
//                 className="custom-button__transport"
//                 onClick={() => handleUpdateStatus("Đang vận chuyển")}
//               >
//                 Đang vận chuyển
//               </Button>
//             ) : newOrder.status == "Đang vận chuyển" ? (
//               <Button
//                 className="custom-button"
//                 onClick={() => handleUpdateStatus("Hoàn tất")}
//               >
//                 Hoàn tất
//               </Button>
//             ) : null}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // export default ChangeStatus;
// import PropTypes from "prop-types";
// import { Button, Modal } from "antd";
// import { useState } from "react";

// import "./index.scss";
// import { updateOrderStatus } from "../../service/userService";

// ChangeStatus.propTypes = {
//   data: PropTypes.object.isRequired, // Nhận dữ liệu là một đối tượng
// };

// function ChangeStatus({ data }) {
//   const initOrder = {
//     orderID: data.orderID,
//     // customerId: data.customerId,
//     // totalAmount: data.totalAmount,
//     // orderDate: data.orderDate,
//     status: data.status,
//   };

//   const [newOrder, setNewOrder] = useState(initOrder);
//   const [showButtons, setShowButtons] = useState(false); // Trạng thái để hiển thị các nút cập nhật

//   // Hàm xử lý khi nhấn vào nút "Cập nhật trạng thái"
//   const handleShowButtons = () => {
//     setShowButtons(true); // Hiển thị các nút cập nhật
//   };
//   const handleCloseButtons = () => {
//     setShowButtons(false);
//   };

//   // Hàm xử lý khi cập nhật trạng thái đơn hàng
//   const handleUpdateStatus = async (newStatus) => {
//     if (newStatus === "Đã hủy") {
//       // Hiển thị Modal xác nhận hủy
//       Modal.confirm({
//         title: "Bạn chắc chắn muốn hủy?",
//         okText: "Yes",
//         cancelText: "No",
//         centered: true,
//         onOk: async () => {
//           // Hành động khi người dùng nhấn "Yes"
//           try {
//             await updateOrderStatus(data.orderID, newStatus); // Gọi API để cập nhật trạng thái
//             setNewOrder((preNewOrder) => ({
//               ...preNewOrder,
//               status: newStatus,
//             }));
//             console.log("Order status updated to:", newStatus);
//           } catch (error) {
//             console.error("Failed to update order status:", error);
//           }
//         },
//         onCancel: () => {
//           // Hành động khi người dùng nhấn "No" (Không cần làm gì nếu chỉ muốn đóng modal)
//         },
//       });
//     } else {
//       // Cập nhật trạng thái nếu không phải "Đã hủy"
//       try {
//         await updateOrderStatus(data.orderID, newStatus); // Gọi API để cập nhật trạng thái
//         setNewOrder((preNewOrder) => ({
//           ...preNewOrder,
//           status: newStatus,
//         }));
//         console.log("Order status updated to:", newStatus);
//       } catch (error) {
//         console.error("Failed to update order status:", error);
//       }
//     }
//   };

//   return (
//     <div>
//       {!showButtons ? (
//         <Button onClick={handleShowButtons}>Cập nhật trạng thái</Button>
//       ) : (
//         <div className="change-status-button__container">
//           <div className="change-status-button__close">
//             <Button onClick={handleCloseButtons}>Ẩn cập nhật trạng thái</Button>
//           </div>
//           <div className="change-status-button">
//             {newOrder.status === "Chờ xác nhận" ? (
//               <>
//                 <Button
//                   className="custom-button__transport"
//                   onClick={() => handleUpdateStatus("Đang chuẩn bị")}
//                 >
//                   Xác nhận
//                 </Button>
//                 <Button
//                   type="primary"
//                   danger
//                   onClick={() => handleUpdateStatus("Đã hủy")}
//                 >
//                   Hủy đơn
//                 </Button>
//               </>
//             ) : newOrder.status === "Đang chuẩn bị" ? (
//               <Button
//                 className="custom-button__transport"
//                 onClick={() => handleUpdateStatus("Đang vận chuyển")}
//               >
//                 Đang vận chuyển
//               </Button>
//             ) : newOrder.status === "Đang vận chuyển" ? (
//               <Button
//                 className="custom-button"
//                 onClick={() => handleUpdateStatus("Hoàn tất")}
//               >
//                 Hoàn tất
//               </Button>
//             ) : null}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ChangeStatus;
import { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, message } from "antd";
import { updateOrderStatus } from "../../service/userService"; // Import API
import api from "../../config/api";

ChangeStatus.propTypes = {
  data: PropTypes.shape({
    orderID: PropTypes.string.isRequired, // Yêu cầu orderID hợp lệ
    status: PropTypes.string.isRequired,  // Trạng thái ban đầu
  }).isRequired,
};

function ChangeStatus({ data }) {
  const [showButtons, setShowButtons] = useState(false); // Kiểm soát hiển thị nút
  const [status, setStatus] = useState(data.status); // Trạng thái hiện tại của đơn hàng
  const orderAccountID = data.accountID;

  // Xử lý cập nhật trạng thái đơn hàng
  const updateAccountBalance = async (accountID, amount) => {
    const apiUrl = `/account/updateBalance/${accountID}?amount=${amount}`;
    try {
      const response = await api.put(apiUrl); // Use api.put for PUT requests
      if (!response.ok) {
        throw new Error("Failed to update account balance");
      }
    } catch (error) {
      console.error("Error updating account balance:", error);
    }
  };
  // Xử lý cập nhật trạng thái đơn hàng
  const handleUpdateStatus = async (newStatus) => {
    try {
      const date = new Date().toISOString();

      // Nếu trạng thái mới là "Đã hủy", thực hiện hoàn tiền
      if (newStatus === "Đã hủy") {
        const refundAmount = data.discountedTotal + 200000;
  
        // Log thông tin trước khi gửi request
        console.log("Request Data:", {
          endpoint: `account/updateBalance/${orderAccountID}`,
          body: {
            accountID: orderAccountID,
            amount: refundAmount,
          }
        });
        await updateAccountBalance(orderAccountID, refundAmount);
        // Log response từ API
        // Tạo transaction
        const transactionResponse = await api.post("/transactions/create", {
          accountID: orderAccountID,
          price: refundAmount,
          date: date,
          description: `Hoàn tiền đơn hàng ${data.orderID} (Admin hủy đơn)`
        });
  
        // Log transaction response
        console.log("Transaction Response:", transactionResponse.data);
  
        message.success(`Đã hoàn trả ${refundAmount.toLocaleString()} VND cho khách hàng`);
      }

      // Cập nhật trạng thái đơn hàng
      await updateOrderStatus(data.orderID, newStatus, orderAccountID, date);
      setStatus(newStatus);
      message.success(`Trạng thái cập nhật thành công: ${newStatus}`);
      setShowButtons(false);
      // window.location.reload();
    } catch (error) {
      message.error("Lỗi khi cập nhật trạng thái!");
      console.error("Error updating order status:", error);
    }
  };

  // Hiển thị modal xác nhận nếu trạng thái là "Đã hủy"
  const confirmCancel = () => {
    Modal.confirm({
      title: "Bạn có chắc muốn hủy đơn này?",
      content: "Hệ thống sẽ hoàn tiền lại cho khách hàng sau khi hủy đơn.",
      okText: "Đồng ý",
      cancelText: "Hủy",
      onOk: () => handleUpdateStatus("Đã hủy"),
    });
  };

  return (
    <div>
      {!showButtons ? (
        <Button onClick={() => setShowButtons(true)}>Cập nhật trạng thái</Button>
      ) : (
        <div className="change-status-button__container">
          <Button onClick={() => setShowButtons(false)}>Ẩn cập nhật</Button>

          <div className="change-status-button">
            {status === "Đang xử lý" && (
              <>
                <Button style={{marginTop:10,marginBottom:10}} onClick={() => handleUpdateStatus("Đang chuẩn bị")} className="btn-button">
                  Xác nhận
                </Button>
                <Button type="primary" danger onClick={confirmCancel}>
                  Hủy đơn
                </Button>
              </>
            )}

            {status === "Đang chuẩn bị" && (
              <Button onClick={() => handleUpdateStatus("Đang vận chuyển")}>
                Đang vận chuyển
              </Button>
            )}
            {status === "Đang vận chuyển" && (
              <Button onClick={() => handleUpdateStatus("Đã giao hàng")}>
                Đã giao hàng
              </Button>
            )}
            {status === "Đã giao hàng" && (
              <Button onClick={() => handleUpdateStatus("Hoàn tất")}>
                Hoàn tất
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ChangeStatus;

