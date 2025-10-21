import { StrictMode, Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { router } from '@/routes';
import { AuthProvider } from '@/auth/AuthContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <Suspense fallback={null}>
                <RouterProvider router={router} />
            </Suspense>
        </AuthProvider>
    </StrictMode>
);