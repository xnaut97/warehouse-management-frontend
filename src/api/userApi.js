import api from "./axiosClient";


const userApi = {


    getAllUsers: () => {

        return api.get("/users");

    },


    getUserById: (id) => {

        return api.get(`/users/${id}`);

    },


    createUser: (data) => {

        return api.post(
            "/users",
            data
        );

    },


    updateUser: (id, data) => {

        return api.put(
            `/users/${id}`,
            data
        );

    },


    lockUser: (id) => {

        return api.patch(
            `/users/${id}/lock`
        );

    },


    unlockUser: (id) => {

        return api.patch(
            `/users/${id}/unlock`
        );

    },


    resetPassword: (id, data) => {

        return api.patch(
            `/users/${id}/reset-password`,
            data
        );

    }


};


export default userApi;