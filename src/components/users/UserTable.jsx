import Badge from "../common/Badge.jsx";
import UserActions from "./UserActions.jsx";

function UserTable({
                       users,
                       onEdit,
                       onToggleStatus,
                       onResetPassword,
                   }) {
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
                    <th className="px-6 py-4 text-left">
                        Tên đăng nhập
                    </th>

                    <th className="px-6 py-4 text-left">
                        Email
                    </th>

                    <th className="px-6 py-4 text-left">
                        Vai trò
                    </th>

                    <th className="px-6 py-4 text-left">
                        Trạng thái
                    </th>

                    <th className="px-6 py-4 text-center">
                        Thao tác
                    </th>

                </tr>
                </thead>

                <tbody>
                {users.map((user) => (
                    <tr
                        key={user.id}
                        className="border-t border-(--color-border) transition hover:bg-pink-50/50"
                    >
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">

                                <div>
                                    <p className="">
                                        {user.username}
                                    </p>
                                </div>
                            </div>
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                            {user.email}
                        </td>

                        <td className="px-6 py-4">
                            <Badge color="pink">
                                {roleLabels[user.role] || user.role}
                            </Badge>
                        </td>

                        <td className="px-6 py-4">
                            <Badge
                                color={
                                    user.enabled
                                        ? "green"
                                        : "red"
                                }
                            >
                                {user.enabled
                                    ? "Hoạt động"
                                    : "Đã khóa"}
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
