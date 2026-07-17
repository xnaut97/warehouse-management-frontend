import {NavLink, useNavigate} from "react-router-dom";
import {sidebarItems} from "../../utils/sidebarItems.js";
import authStore from "../../store/authStore.js";
import {LogOut, X} from "lucide-react";

function Sidebar({ isOpen = false, onClose }) {

    const user = authStore((state) => state.user);
    const logout = authStore((state) => state.logout);

    console.log(user);

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        onClose?.();
        navigate("/login", {replace: true});
    };

    return (
        <>
            <div
                onClick={onClose}
                className={`fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden ${
                    isOpen
                        ? "opacity-100"
                        : "pointer-events-none opacity-0"
                }`}
                aria-hidden="true"
            />

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex h-screen w-72 max-w-[85vw] flex-col border-r border-(--color-border) bg-white transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0 ${
                    isOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                }`}
            >

            <div className="border-b border-(--color-border) p-5">
                <div className="mb-4 flex justify-end lg:hidden">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition hover:bg-pink-50 hover:text-(--color-primary)"
                        aria-label="Đóng menu"
                    >
                        <X size={22} />
                    </button>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-pink-50 p-3">

                    <div
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-(--color-primary) font-semibold text-white">
                        {user?.username?.charAt(0).toUpperCase()}
                    </div>

                    <div>

                        <p className="font-medium">
                            {user?.username}
                        </p>

                        <p className="text-sm text-gray-500">
                            {user?.fullName}
                        </p>

                    </div>

                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pt-6">
                {sidebarItems.map((section) => (
                    <div key={section.title} className="mb-8">
                        <p className="mb-3 px-4 text-xs font-semibold tracking-widest text-gray-400">
                            {section.title}
                        </p>

                        <div className="space-y-1">
                            {section.items.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        end={item.path === "/reports"}
                                        onClick={onClose}
                                        className={({isActive}) =>
                                            `flex items-center gap-3 rounded-xl px-4 py-3 
                                            text-sm font-medium transition-all duration-200
                                            ${
                                                isActive
                                                    ? "bg-pink-100 text-(--color-primary)"
                                                    : "text-gray-600 hover:bg-pink-50 hover:text-(--color-primary)"
                                            }
        `
                                        }
                                    >
                                        <Icon size={20}/>
                                        <span>{item.label}</span>
                                    </NavLink>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t border-(--color-border) p-5">
                <button
                    onClick={handleLogout}
                    className="
            mt-3 flex w-full items-center justify-center gap-2
            rounded-xl border border-(--color-border)
            px-4 py-3 text-sm font-medium text-(--color-primary)
            transition hover:bg-pink-50 hover:text-(--color-primary-hover)"
                >
                    <LogOut size={18}/>
                    Đăng xuất
                </button>
            </div>
        </aside>
        </>
    );
}

export default Sidebar;
