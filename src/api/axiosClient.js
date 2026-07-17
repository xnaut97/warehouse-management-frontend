import axios from "axios";
import { toast } from "react-hot-toast";

import authStore from "../store/authStore";

let isRedirecting = false;

const axiosClient = axios.create({

    baseURL: "http://localhost:8080/api",

    headers: {
        "Content-Type": "application/json"
    }

});

axiosClient.interceptors.request.use(

    (config) => {

        const token = authStore.getState().token;

        if (token) {

            config.headers.Authorization = `Bearer ${token}`;

        }

        return config;

    },

    (error) => Promise.reject(error)

);

axiosClient.interceptors.response.use(

    (response) => response,

    (error) => {

        if (error.response?.status === 401 && !isRedirecting) {

            isRedirecting = true;

            toast.error(
                "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
            );

            authStore.getState().logout();

            setTimeout(() => {

                window.location.href = "/login";

            }, 1000);


        }

        return Promise.reject(error);

    }

);

export default axiosClient;