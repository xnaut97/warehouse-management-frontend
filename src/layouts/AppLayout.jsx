import Sidebar from "../components/common/Sidebar.jsx";

function AppLayout({ children }) {
    return (
        <div className="flex h-screen bg-[var(--color-background)]">
            <Sidebar />

            <div className="flex flex-1 flex-col overflow-hidden">
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default AppLayout;