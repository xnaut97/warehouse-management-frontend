import api from "./axiosClient.js";

const productIssueApi = {
    getAll(params = {}) {
        return api.get("/product-issues", {
            params,
        });
    },

    getDetail(id) {
        return api.get(`/product-issues/${id}`);
    },

    create(data) {
        return api.post("/product-issues", data);
    },

    update(id, data) {
        return api.put(`/product-issues/${id}`, data);
    },

    delete(id) {
        return api.delete(`/product-issues/${id}`);
    },

    confirm(id) {
        return api.post(`/product-issues/${id}/confirm`);
    },

    addItem(issueId, data) {
        return api.post(
            `/product-issues/${issueId}/items`,
            data
        );
    },

    updateItem(issueId, itemId, data) {
        return api.put(
            `/product-issues/${issueId}/items/${itemId}`,
            data
        );
    },

    deleteItem(issueId, itemId) {
        return api.delete(
            `/product-issues/${issueId}/items/${itemId}`
        );
    },
};

export default productIssueApi;