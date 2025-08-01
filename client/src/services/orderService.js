import axios from "axios";

const API_URL = "/api/orders";

const placeOrder = (data) => {
  console.log("[orderService] Placing order with data:", data);
  return axios.post(API_URL, data);
};

const getBuyerOrders = (username) => axios.get(`${API_URL}/buyer/${username}`);
const getFarmerOrders = (username) =>
  axios.get(`${API_URL}/farmer/${username}`);
const updateOrderStatus = (orderId, productId, status) =>
  axios.put(`${API_URL}/${orderId}/status`, { productId, status });

export default {
  placeOrder,
  getBuyerOrders,
  getFarmerOrders,
  updateOrderStatus,
};
