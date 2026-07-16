import api from "./axiosClient";

const warehouseApi = {

    getAllWarehouses(params) {

        return api.get(
            "/warehouses",
            {
                params
            }
        );

    },

    getWarehouse(id) {

        return api.get(
            `/warehouses/${id}`
        );

    },

    createWarehouse(data) {

        return api.post(
            "/warehouses",
            data
        );

    },

    updateWarehouse(id, data) {

        return api.put(
            `/warehouses/${id}`,
            data
        );

    },

    deleteWarehouse(id) {

        return api.delete(
            `/warehouses/${id}`
        );

    }

};

export default warehouseApi;