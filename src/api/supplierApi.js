import api from "./axiosClient";

const supplierApi = {

    getAllSuppliers(params) {
        return api.get(
            "/suppliers",
            {
                params
            }
        );
    },

    getSupplier(id) {
        return api.get(`/suppliers/${id}`);
    },

    createSupplier(data) {
        return api.post("/suppliers", data);
    },

    updateSupplier(id, data) {
        return api.put(`/suppliers/${id}`, data);
    },

    deleteSupplier(id) {
        return api.delete(`/suppliers/${id}`);
    }

};

export default supplierApi;
