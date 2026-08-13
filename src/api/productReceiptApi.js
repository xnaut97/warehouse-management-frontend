import api from "./axiosClient.js";

const productReceiptApi = {
    getAll(params = {}) {
        return api.get("/product-receipts", {
            params,
        });
    },

    getDetail(id) {
        return api.get(`/product-receipts/${id}`);
    },

    create(data) {
        return api.post("/product-receipts", data);
    },

    update(id, data) {
        return api.put(`/product-receipts/${id}`, data);
    },

    delete(id) {
        return api.delete(`/product-receipts/${id}`);
    },

    confirm(id) {
        return api.post(`/product-receipts/${id}/confirm`);
    },

    addItem(receiptId, data) {
        return api.post(
            `/product-receipts/${receiptId}/items`,
            data
        );
    },

    updateItem(receiptId, itemId, data) {
        return api.put(
            `/product-receipts/${receiptId}/items/${itemId}`,
            data
        );
    },

    deleteItem(receiptId, itemId) {
        return api.delete(
            `/product-receipts/${receiptId}/items/${itemId}`
        );
    },
};

export default productReceiptApi;