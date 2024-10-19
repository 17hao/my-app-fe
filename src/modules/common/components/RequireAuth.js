import { Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

// chilren is a component
// https://stackoverflow.com/q/48458334
export default function RequireAuth({ chilren }) {
    // todo authentication logic
    const isAuthenticated = window.localStorage.getItem("isAuth");

    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    return chilren;
}
