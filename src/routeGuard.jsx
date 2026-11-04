import { Navigate, Outlet, useOutletContext } from 'react-router-dom';
import { notify } from './components/norifications/notifications';

const SafeRoute = () => {
    const context = useOutletContext();

    if (!context.auth?.accessToken) {
        notify.error('access Denied, please authenticate')

        return <Navigate to="/" replace />;
    }

    return <Outlet context={context} />;
};
export{
    SafeRoute
}