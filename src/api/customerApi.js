import axios from './axiosClient.js';

const customerApi = {
    getAllCustomers: () => {
        return axios.get('/customers');
    },

    getCustomer: (id) => {
        return axios.get(`/customers/${id}`);
    },

    createCustomer: (data) => {
        return axios.post('/customers', data);
    },

    updateCustomer: (id, data) => {
        return axios.put(`/customers/${id}`, data);
    },

    deleteCustomer: (id) => {
        return axios.delete(`/customers/${id}`);
    },

    enableCustomer: (id) => {
        return axios.patch(`/customers/${id}/enable`);
    },

    disableCustomer: (id) => {
        return axios.patch(`/customers/${id}/disable`);
    }
};

export default customerApi;