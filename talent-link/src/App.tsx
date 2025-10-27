import { RouterProvider } from 'react-router-dom';
import { router } from '@/router';
import { useEffect } from 'react';
import { useAuth } from './features/auth/hooks/useAuth';

function App() {
    const { initAuth, isLoading } = useAuth();

    useEffect(() => {
        initAuth();
    }, [initAuth]);

    if (isLoading) {
        return <div>Initializing app...</div>;
    }

    return <RouterProvider router={router} />;
}

export default App;
