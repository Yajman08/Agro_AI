import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas lg:flex">
      <Sidebar />
      <div className="flex-1 min-w-0 pb-20 lg:pb-0">
        <main className="px-4 sm:px-6 lg:px-8 pb-10">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
