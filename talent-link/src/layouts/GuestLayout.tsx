import { Outlet } from 'react-router-dom';
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export default function GuestLayout({
    children,
}: {
    children?: React.ReactNode;
}) {
    return (
        <div className="flex h-lvh min-h-lvh flex-col overflow-x-clip">
            <Header />

            <main className="mx-auto w-full grow">
                {children ?? <Outlet />}
            </main>
            <Footer />
        </div>
    )
}
