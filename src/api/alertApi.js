import api from "./axiosClient";

const alertApi = {

    getAlerts: (params) =>
        api.get("/alerts", { params }),

    getLotOverview: (params) =>
        api.get("/alerts/lots", { params })

};

export default alertApi;
