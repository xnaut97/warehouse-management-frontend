import { useState } from "react";
import { Menu } from "lucide-react";

import Sidebar from "../components/common/Sidebar.jsx";

function AppLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[var(--color-background)]">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[var(--color-border)] bg-white px-4 py-3 lg:hidden">
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(true)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] text-[var(--color-text)] transition hover:bg-pink-50"
                        aria-label="Mở menu"
                    >
                        <Menu size={22} />
                    </button>

                    <span className="truncate text-base font-semibold text-[var(--color-text)]">
                        Warehouse Management
                    </span>
                </header>

                <main className="min-w-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default AppLayout;
