import { RouterProvider } from 'react-router-dom';
import { router } from '@/router';
import { useAuthStore } from '@/stores/authStore';
import { Toaster } from 'sonner';
import { useEffect } from 'react';

function App() {
    const { user,
        refreshToken,
        accessToken,
        isAuthenticated
    } = useAuthStore();

    useEffect(() => {
        console.log(user, accessToken, refreshToken, isAuthenticated)
    }, [])


    return (
        <>
            <RouterProvider router={router} />
            <Toaster position="top-right" richColors />
        </>
    );
}

export default App;
