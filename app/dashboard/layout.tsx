import Sidebar from '@/components/dashboard/Sidebar';
import AppHeader from '@/components/dashboard/AppHeader';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-[#F6F5FB] flex">
      {/* Floating vertical sidebar */}
      <Sidebar />

      {/* Main Content Container matching reference (soft white rounded container with generous spacing and large corner radii) */}
      <main className="flex-1 lg:pl-28 px-4 sm:px-6 py-6 pb-24 lg:pb-10 max-w-[1520px] mx-auto w-full transition-all">
        <div className="bg-white rounded-[24px] sm:rounded-[28px] border border-[#E7E6F0] shadow-soft p-5 sm:p-8 min-h-[calc(100dvh-3rem)]">
          <AppHeader />
          {children}
        </div>
      </main>
    </div>
  );
}
