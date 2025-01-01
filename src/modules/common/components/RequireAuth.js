import { Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

// chilren is a component
// https://stackoverflow.com/q/48458334
export default function RequireAuth({ chilren }) {
    // todo authentication logic
    // fixme cookie same site policy
    const sessionToken = window.localStorage.getItem("sessionToken");
    console.log(sessionToken);
    const isAuthenticated = sessionToken!== null && sessionToken !== "";

    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    return chilren;
}
