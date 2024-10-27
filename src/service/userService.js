import api from "../config/api";

const Register = async (data) => {
  try {
    const response = await api.post("Register", data);
    return response.data; // Trả về dữ liệu từ API nếu cần
  } catch (error) {
    console.error("Error registering:", error);
    throw error; // Ném lỗi ra ngoài để xử lý trong hàm gọi
  }
};

const ChangePassword = async (data) => {
  try {
    const response = await api.post("reset", data);
    return response;
  } catch (error) {
    console.error(error);
    throw error; // Ném lỗi ra ngoài để xử lý trong hàm gọi
  }
};

const sendEmailToRecoveryPassword = async (data) => {
  try {
    const response = await api.post("forgot", data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const fetchAllUser = async () => {
  try {
    const response = await api.get("account");
    return response;
  } catch (error) {
    console.error(error);
    throw error; // Ném lỗi ra ngoài để xử lý trong hàm gọi
  }
};

const editUser = async (data) => {
  try {
    const response = await api.put(`account/${data.accountID}`, data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const fetchAllProduct = async () => {
  try {
    const response = await api.get("product/getall");
    return response;
  } catch (error) {
    console.error(error);
    throw error; // Ném lỗi ra ngoài để xử lý trong hàm gọi
  }
};
const editFishInfo = async (data) => {
  try {
    const response = await api.put(`product/${data.productID}`, data);
    return response;
  } catch (error) {
    console.error(error);
    throw error; // Ném lỗi ra ngoài để xử lý trong hàm gọi
  }
};
const addFish = async (data) => {
  try {
    const response = await api.post(`product/postall`, data);
    return response;
  } catch (error) {
    console.error(error);
    throw error; // Ném lỗi ra ngoài để xử lý trong hàm gọi
  }
};

const fetchProductById = async (id) => {
  try {
    const response = await api.get(`product/get/${id}`); // Adjust the endpoint based on your API structure
    return response.data; // Return the product data
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error; // Throw error to handle it in the calling function
  }
};
const fetchAllProductCombo = async () => {
  try {
    const response = await api.get("productcombo/getall");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error; // Ném lỗi ra ngoài để xử lý trong hàm gọi
  }
};

const editComboInfo = async (data) => {
  try {
    const response = await api.put(`productcombo/${data.productComboID}`, data);
    return response;
  } catch (error) {
    console.error(error);
    throw error; // Ném lỗi ra ngoài để xử lý trong hàm gọi
  }
};

const addToCartAPI = async (data) => {
  try {
    console.log("Data being sent to API:", data);
    const response = await api.post("shop-cart/add", {
      accountID: data.accountID, // Change this to accountID
      productID: data.productID,
    });

    console.log("API response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error adding to cart:",
      error.response?.data || error.message
    );
    throw error;
  }
};

const fetchAllTransactions = async () => {
  try {
    const response = await api.get("transactions/all"); // Fetch all transactions
    return response.data; // Return the transaction data
  } catch (error) {
    console.error("Error fetching all transactions:", error);
    throw error; // Ném lỗi ra ngoài để xử lý trong hàm gọi
  }
};

const fetchCartItems = async (accountID) => {
  // Sửa từ accountId thành accountID
  const response = await api.get(`/shop-cart/account/${accountID}`); // Sử dụng đường dẫn API chính xác
  console.log("Cart items response:", response.data); // Kiểm tra phản hồi từ API
  return response.data; // Trả về dữ liệu
};

const deleteCartItem = async (cartItemId) => {
  try {
    const response = await api.delete(`shop-cart/delete/${cartItemId}`); // Giả sử API của bạn có endpoint như vậy
    return response.data; // Trả về dữ liệu từ response nếu cần
  } catch (error) {
    console.error(
      "Error deleting cart item:",
      error.response?.data || error.message
    );
    throw error; // Ném lỗi ra ngoài để xử lý ở nơi gọi hàm
  }
};
const AddFishCombo = async (data) => {
  try {
    const response = await api.post(`productcombo/postall`, data);
    return response;
  } catch (error) {
    console.error(error);
    throw error; // Ném lỗi ra ngoài để xử lý trong hàm gọi
  }
};
const fetchProductComboById = async (id) => {
  try {
    const response = await api.get(`productcombo/get/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error; // Ném lỗi ra ngoài để xử lý trong hàm gọi
  }
};
const fetchAllCarePackages = async () => {
  try {
    const response = await api.get(`carePackages`);
    console.log(response.data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
const createConsignment = async (data) => {
  try {
    const response = await api.post(`consignments`, data);
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
const fetchAllConsignment = async () => {
  try {
    const response = await api.get(`consignments`);
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
const updateConsignmentStatus = async (id, status, saleDate = null) => {
  try {
    const payload = { status };

    // Nếu có saleDate (khi trạng thái là "Hoàn tất"), thêm nó vào payload
    if (saleDate) {
      payload.saleDate = saleDate;
    }

    const response = await api.put(`consignments/${id}`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Response từ API:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi từ API:", error.response || error.message);
    throw error;
  }
};

const updateConsignmentByID = async (data) => {
  try {
    console.log("Dữ liệu gửi lên API:", data); // Log dữ liệu trước khi gọi API
    const response = await api.put(`/consignments/${data.consignmentID}`, data);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Lỗi từ phía server:", error.response.data); // Log phản hồi chi tiết từ server
    } else {
      console.error("Lỗi khi gọi API:", error.message);
    }
    return null;
  }
};

const refundConsignmentSell = async (consignmentID) => {
  try {
    const response = await api.post(`/refund/${consignmentID}`);
    return response;
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    return null;
  }
};

const fetchCarePackageByID = async (carePackageID) =>{
  try {
    const response = await api.get(`carePackages/${carePackageID}`);
    console.log(response.data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// const updateOrder = async (id, data) => {
//   try {
//     const response = await api.put(`orders/${id}`, data);
//     return response.data; // Trả về dữ liệu từ API nếu cần
//   } catch (error) {
//     console.error("Error updating order:", error);
//     throw error; // Ném lỗi ra ngoài để xử lý trong hàm gọi
//   }
// };

// const fetchOrderById = async (id) => {
//   try {
//     const response = await api.get(`orders/${id}`); // Gọi API để lấy thông tin đơn hàng theo ID
//     return response.data; // Trả về dữ liệu từ API
//   } catch (error) {
//     console.error("Error fetching order by ID:", error);
//     throw error; // Ném lỗi ra ngoài để xử lý trong hàm gọi
//   }
// };

const fetchOrders = async () => {
  try {
    const response = await api.get("orders"); // Gọi API để lấy danh sách đơn hàng
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error; // Ném lỗi ra ngoài để xử lý trong hàm gọi
  }
};
const fetchOrderDetails = async (orderID) => {
  try {
    const response = await api.get(`orders-details/order/${orderID}`); // Gọi API để lấy chi tiết đơn hàng
    console.log(response.data);
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Error fetching order details:", error);
    throw error; // Ném lỗi ra ngoài để xử lý trong hàm gọi
  }
};
const updateOrderStatus = async (orderID, status, accountID, date) => {
  try {
    const payload = {
      status: status,
      accountID: accountID, // Trường bắt buộc
      date: date, // Trường bắt buộc
    };
    const response = await api.put(`orders/${orderID}`, payload, {
      headers: { "Content-Type": "application/json" },
    }); // Gọi API để cập nhật trạng thái
    console.log("Order updated:", response.data);
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Error updating order status:", error);
    console.error(
      "Error updating order status:",
      error.response?.data || error.message
    );

    throw error; // Ném lỗi ra ngoài để xử lý trong hàm gọi
  }
};

export {
  Register,
  ChangePassword,
  sendEmailToRecoveryPassword,
  fetchAllUser,
  fetchAllProduct,
  editFishInfo,
  addFish,
  editComboInfo,
  fetchAllProductCombo,
  fetchProductById,
  fetchAllTransactions,
  editUser,
  addToCartAPI,
  fetchCartItems,
  deleteCartItem,
  AddFishCombo,
  fetchProductComboById,
  fetchAllCarePackages,
  createConsignment,
  fetchAllConsignment,
  updateConsignmentStatus,
  updateConsignmentByID,
  refundConsignmentSell,
  // updateOrder,
  // fetchOrderById,
  fetchOrders,
  fetchOrderDetails,
  updateOrderStatus,
  fetchCarePackageByID
};
