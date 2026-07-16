import api from './axiosClient.js'

const productApi = {
    getProducts: () =>
        api.get('/products'),

    getProduct: (id) =>
        api.get(`/products/${id}`),

    createProduct: (data) =>
        api.post('/products', data),

    updateProduct: (id, data) =>
        api.put(`/products/${id}`, data),

    deleteProduct: (id) =>
        api.delete(`/products/${id}`),

}

export default productApi;