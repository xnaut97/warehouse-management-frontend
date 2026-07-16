import { NavLink } from "react-router-dom";
import { sidebarItems } from "../../utils/sidebarItems.js";

function Sidebar() {
    return (
        <aside className="flex h-screen w-72 flex-col border-r border-(--color-border) bg-white">

            <div className="flex-1 overflow-y-auto px-4 pb-6 pt-10">
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
                                        className={({ isActive }) =>
                                            `
                                            flex items-center gap-3 rounded-xl px-4 py-3
                                            text-sm font-medium transition-all duration-200
                                            ${
                                                isActive
                                                    ? "bg-pink-100 text-(--color-primary)"
                                                    : "text-gray-600 hover:bg-pink-50 hover:text-(--color-primary)"
                                            }
                                            `
                                        }
                                    >
                                        <Icon size={20} />

                                        <span>{item.label}</span>
                                    </NavLink>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t border-(--color-border) p-5">
                <div className="flex items-center gap-3 rounded-2xl bg-pink-50 p-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-(--color-primary) font-semibold text-white">
                        A
                    </div>

                    <div>
                        <p className="font-medium">Quản trị viên</p>

                        <p className="text-sm text-gray-500">
                            Quản trị hệ thống
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
