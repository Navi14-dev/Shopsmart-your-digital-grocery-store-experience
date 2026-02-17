import api from "../api/api";

export const createPayment = (orderId, amount) =>
  api.post("/payments/create", { orderId, amount });

export const verifyPayment = (data) =>
  api.post("/payments/verify", data);
