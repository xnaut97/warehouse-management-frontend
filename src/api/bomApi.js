import api from "./axiosClient.js";

const bomApi = {

    getAll() {

        return api.get("/boms");

    },

    getById(id) {

        return api.get(`/boms/${id}`);

    },

    search(keyword) {

        return api.get("/boms/search", {
            params: {
                keyword
            }
        });

    },

    create(data) {

        return api.post("/boms", data);

    },

    update(id, data) {

        return api.put(`/boms/${id}`, data);

    },

    enable(id) {

        return api.patch(`/boms/${id}/enable`);

    },

    disable(id) {

        return api.patch(`/boms/${id}/disable`);

    }

};

export default bomApi;
