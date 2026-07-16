import axiosClient from "./axiosClient";

const issueApi = {

    getAll: (params) =>
        axiosClient.get("/issues", { params }),

    getDetail: (id) =>
        axiosClient.get(`/issues/${id}`),

    create: (data) =>
        axiosClient.post("/issues", data),

    update: (id, data) =>
        axiosClient.put(`/issues/${id}`, data),

    delete: (id) =>
        axiosClient.delete(`/issues/${id}`),

    confirm: (id) =>
        axiosClient.post(`/issues/${id}/confirm`),

    addItem: (id, data) =>
        axiosClient.post(`/issues/${id}/items`, data),

    updateItem: (issueId, itemId, data) =>
        axiosClient.put(`/issues/${issueId}/items/${itemId}`, data),

    deleteItem: (issueId, itemId) =>
        axiosClient.delete(`/issues/${issueId}/items/${itemId}`)

};

export default issueApi;