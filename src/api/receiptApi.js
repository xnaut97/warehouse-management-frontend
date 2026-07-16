import axiosClient from "./axiosClient";

const receiptApi = {

    getAll: (params) =>
        axiosClient.get("/receipts", { params }),

    getDetail: (id) =>
        axiosClient.get(`/receipts/${id}`),

    create: (data) =>
        axiosClient.post("/receipts", data),

    update: (id, data) =>
        axiosClient.put(`/receipts/${id}`, data),

    delete: (id) =>
        axiosClient.delete(`/receipts/${id}`),

    confirm: (id) =>
        axiosClient.post(`/receipts/${id}/confirm`),

    addItem: (id, data) =>
        axiosClient.post(`/receipts/${id}/items`, data),

    updateItem: (receiptId, itemId, data) =>
        axiosClient.put(`/receipts/${receiptId}/items/${itemId}`, data),

    deleteItem: (receiptId, itemId) =>
        axiosClient.delete(`/receipts/${receiptId}/items/${itemId}`)

};

export default receiptApi;