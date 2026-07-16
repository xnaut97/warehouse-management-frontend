import { Navigate } from "react-router-dom";

import authStore from "../store/authStore";


function GuestRoute({ children }) {

    const token = authStore((state) => state.token);

    if (token) {

        return <Navigate to="/dashboard" replace />;

    }

    return children;

}


export default GuestRoute;