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

// const editUser = async () => {
//   try {
//     const response = await api.get("account");
//     return response;
//   } catch (error) {
//     console.error(error);
//     throw error; // Ném lỗi ra ngoài để xử lý trong hàm gọi
//   }
// };

const fetchAllProduct = async () => {
  try {
    const response = await api.get("product/getall");
    return response;
  } catch (error) {
    console.error(error);
    throw error; // Ném lỗi ra ngoài để xử lý trong hàm gọi
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

const editFishInfo = async (data) => {
  try {
    const response = await api.put(`product/${data.id}`, data);
    return response;
  } catch (error) {
    console.error(error);
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

const addToCartAPI = async (data) => {
  try {
    const response = await api.post("shop-cart/add", data); // Endpoint API để thêm vào giỏ hàng
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};
const fetchUser = async () => {
  try {
    const response = await api.get("account"); // Điều chỉnh endpoint nếu cần
    return response.data; // Trả về dữ liệu người dùng
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error; // Ném lỗi để xử lý trong hàm gọi
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
  addToCartAPI,
  fetchUser
};
