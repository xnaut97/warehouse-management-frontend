import Badge from "../common/Badge.jsx";
import UserActions from "./UserActions.jsx";
import SortableHeader from "../common/SortableHeader.jsx";

function UserTable({ users, onEdit, onToggleStatus, onResetPassword, sortField, sortDir, onSort }) {
    const sortProps = { sortField, sortDir, onSort };

    const roleLabels = {
        ADMIN: "Quản trị viên",
        WAREHOUSE_MANAGER: "Quản lý kho",
        WAREHOUSE_STAFF: "Nhân viên kho",
        EXECUTIVE_BOARD: "Giám đốc",
    };

    return (
        <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-white shadow-sm">
            <table className="min-w-[820px] w-full">
                <thead className="border-b border-pink-100">
                <tr>
                    <SortableHeader field="username" label="Tên đăng nhập" {...sortProps} className="text-left" />
                    <SortableHeader field="email"    label="Email"         {...sortProps} className="text-left" />
                    <SortableHeader field="role"     label="Vai trò"       {...sortProps} className="text-left" />
                    <SortableHeader field="enabled"  label="Trạng thái"    {...sortProps} className="text-left" />
                    <th className="px-6 py-4 text-center font-semibold text-slate-700">Thao tác</th>
                </tr>
                </thead>

                <tbody>
                {users.map((user) => (
                    <tr
                        key={user.id}
                        className="border-t border-(--color-border) transition hover:bg-pink-50/50"
                    >
                        <td className="px-6 py-4">
                            <p>{user.username}</p>
                        </td>

                        <td className="px-6 py-4 text-gray-600">{user.email}</td>

                        <td className="px-6 py-4">
                            <Badge color="pink">
                                {roleLabels[user.role] || user.role}
                            </Badge>
                        </td>

                        <td className="px-6 py-4">
                            <Badge color={user.enabled ? "green" : "red"}>
                                {user.enabled ? "Hoạt động" : "Đã khóa"}
                            </Badge>
                        </td>

                        <td className="px-6 py-4">
                            <UserActions
                                user={user}
                                onEdit={onEdit}
                                onToggleStatus={onToggleStatus}
                                onResetPassword={onResetPassword}
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserTable;
