import api from "./axiosClient";

const materialApi = {

    getAllMaterials(params) {

        return api.get(
            "/materials",
            {
                params
            }
        );

    },

    getMaterial(id) {

        return api.get(
            `/materials/${id}`
        );

    },

    createMaterial(data) {

        return api.post(
            "/materials",
            data
        );

    },

    updateMaterial(id, data) {

        return api.put(
            `/materials/${id}`,
            data
        );

    },

    enableMaterial(id) {

        return api.patch(
            `/materials/${id}/enable`
        );

    },

    disableMaterial(id) {

        return api.patch(
            `/materials/${id}/disable`
        );

    }

};

export default materialApi;