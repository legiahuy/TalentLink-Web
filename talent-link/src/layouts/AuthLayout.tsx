import { Outlet } from 'react-router-dom';

const AuthLayout = ({ children }: { children?: React.ReactNode }) => {
    return <div className="min-h-screen">{children ?? <Outlet />}</div>;
};

export default AuthLayout;
