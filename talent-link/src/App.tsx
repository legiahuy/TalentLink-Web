import { RouterProvider } from 'react-router-dom';
import { router } from '@/router';
import { useEffect } from 'react';
import { useAuth } from './features/auth/hooks/useAuth';
import { Toaster } from 'sonner';

function App() {
    const { initAuth, isLoading } = useAuth();

    useEffect(() => {
        initAuth();
    }, [initAuth]);

    if (isLoading) {
        return <div>Initializing app...</div>;
    }

    return (
        <>
            <RouterProvider router={router} />
            <Toaster position="top-right" richColors />
        </>
    );
}

export default App;
