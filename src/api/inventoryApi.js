import api from "./axiosClient";

const inventoryApi = {

    getAll(params) {

        return api.get(
            "/inventories",
            {
                params
            }
        );

    },

    getSummary(params) {

        return api.get(
            "/inventories/summary",
            {
                params
            }
        );

    },

    getDetail(id) {

        return api.get(
            `/inventories/${id}`
        );

    },

    getLowStock() {

        return api.get(
            "/inventories/low-stock"
        );

    },

    getProductLots(params) {

        return api.get(
            "/product-inventories/lots",
            {
                params
            }
        );

    }

};

export default inventoryApi;