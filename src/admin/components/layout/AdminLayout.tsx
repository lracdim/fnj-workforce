import type { ReactNode } from 'react';
import Sidebar from './Sidebar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F9F8F5]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}