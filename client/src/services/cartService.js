import axios from "axios";

const API_URL = "http://localhost:5000/api/cart";

const addToCart = (buyerUsername, productId, quantity = 1) =>
  axios.post(`${API_URL}/add`, { buyerUsername, productId, quantity });

const getCart = (buyerUsername) => axios.get(`${API_URL}/${buyerUsername}`);

const updateCartItem = (buyerUsername, productId, quantity) =>
  axios.put(`${API_URL}/update`, { buyerUsername, productId, quantity });

const removeCartItem = (buyerUsername, productId) =>
  axios.delete(`${API_URL}/remove`, { data: { buyerUsername, productId } });

export default {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
};
