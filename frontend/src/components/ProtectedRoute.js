import { Redirect } from "react-router-dom";
import { getUserRole } from "../utils/auth";

const ProtectedRoute = ({ children, role }) => {
    const userRole = getUserRole();

    if (!userRole) {
        return <Redirect to={`/${role}/login`} />;
    }

    if (role && userRole !== role) {
        return <Redirect to="/" />;
    }

    return children;
};

export default ProtectedRoute;
