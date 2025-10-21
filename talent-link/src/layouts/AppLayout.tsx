import { Outlet } from 'react-router-dom';

export default function AppLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* sidebar/nav here */}
      <main className="flex-1">{children ?? <Outlet />}</main>
    </div>
  );
}