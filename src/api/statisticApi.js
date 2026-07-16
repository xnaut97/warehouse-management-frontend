import api from './axiosClient.js';

const statisticApi = {
    getStatistics: () => {
        return api.get('/statistics');
    }
};

export default statisticApi;