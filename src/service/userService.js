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
    return response.data;
  } catch (error) {
    console.error(error);
    throw error; // Ném lỗi ra ngoài để xử lý trong hàm gọi
  }
};

const sendEmailToRecoveryPassword = async (data) => {
  try {
    const response = await api.post("forgot", data);
    return response;
  } catch (error) {
    console.error(error);
    throw error; // Ném lỗi ra ngoài để xử lý trong hàm gọi
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
    const response = await api.get("account/${data.id}", data);
    return response;
  } catch (error) {
    console.error(error);
    throw error; // Ném lỗi ra ngoài để xử lý trong hàm gọi
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
    const response = await api.get(`product/${id}`); // Adjust the endpoint based on your API structure
    return response.data; // Return the product data
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error; // Throw error to handle it in the calling function
  }
};
const fetchAllProductCombo = async () => {
  try {
    const response = await api.get("productcombo");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error; // Ném lỗi ra ngoài để xử lý trong hàm gọi
  }
};
const fetchProductComboById = async (id) => {
  try {
    const response = await api.get(`productcombo/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error; // Ném lỗi ra ngoài để xử lý trong hàm gọi
  }
};


const editComboInfo = async (data) => {
  try {
    const response = await api.put(`productcombo/${data.id}`, data);
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
      accountId: data.accountId,
      productId: data.productId
    });
    console.log("API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error.response?.data || error.message);
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


const fetchCartItems = async (accountId) => {
  try {
    console.log("Fetching cart items for account:", accountId);
    const response = await api.get(`shop-cart/account/${accountId}`);
    console.log("Cart items response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw error;
  }
};

const deleteCartItem = async (cartItemId) => {
  try {
    const response = await api.delete(`shop-cart/delete/${cartItemId}`); // Giả sử API của bạn có endpoint như vậy
    return response.data; // Trả về dữ liệu từ response nếu cần
  } catch (error) {
    console.error("Error deleting cart item:", error.response?.data || error.message);
    throw error; // Ném lỗi ra ngoài để xử lý ở nơi gọi hàm
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
  fetchProductComboById,
  fetchProductById,
  fetchAllTransactions,
  editUser,
  addToCartAPI,
  fetchCartItems,
  deleteCartItem,

};
