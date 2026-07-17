import {NavLink, useNavigate} from "react-router-dom";
import {sidebarItems} from "../../utils/sidebarItems.js";
import authStore from "../../store/authStore.js";
import {LogOut} from "lucide-react";

function Sidebar() {

    const user = authStore((state) => state.user);
    const logout = authStore((state) => state.logout);

    console.log(user);

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login", {replace: true});
    };

    return (
        <aside className="flex h-screen w-72 flex-col border-r border-(--color-border) bg-white">

            <div className="border-b border-(--color-border) p-5">
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
    );
}

export default Sidebar;
