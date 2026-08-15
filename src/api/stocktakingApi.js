import api from "./axiosClient.js";

const stocktakingApi = {

    getAll(params = {}) {

        return api.get("/stocktaking", {
            params
        });

    },

    getDetail(id) {

        return api.get(`/stocktaking/${id}`);

    },

    create(data) {

        return api.post("/stocktaking", data);

    },

    addItem(id, data) {

        return api.post(`/stocktaking/${id}/items`, data);

    },

    updateItem(itemId, data) {

        return api.put(`/stocktaking/items/${itemId}`, data);

    },

    updateBatch(batchId, data) {

        return api.put(`/stocktaking/batches/${batchId}`, data);

    },

    confirm(id, data) {

        return api.post(`/stocktaking/${id}/confirm`, data);

    },

    balance(id) {

        return api.post(`/stocktaking/${id}/balance`);

    }

};

export default stocktakingApi;
