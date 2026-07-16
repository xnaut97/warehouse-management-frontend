import {
    Edit,
    KeyRound,
    Lock,
    Unlock,
} from "lucide-react";

function UserActions({
                         user,
                         onEdit,
                         onToggleStatus,
                         onResetPassword,
                     }) {
    return (
        <div className="flex items-center justify-center gap-2">
            <button
                onClick={() => onEdit(user)}
                className="rounded-xl p-2 text-gray-500 transition hover:bg-pink-50 hover:text-[var(--color-primary)]"
                title="Chỉnh sửa người dùng"
            >
                <Edit size={18} />
            </button>

            <button
                onClick={() => onToggleStatus(user)}
                className="rounded-xl p-2 text-gray-500 transition hover:bg-pink-50 hover:text-[var(--color-primary)]"
                title={user.enabled ? "Khóa người dùng" : "Mở khóa người dùng"}
            >
                {user.enabled ? (
                    <Lock size={18} />
                ) : (
                    <Unlock size={18} />
                )}
            </button>

            <button
                onClick={() => onResetPassword(user)}
                className="rounded-xl p-2 text-gray-500 transition hover:bg-pink-50 hover:text-[var(--color-primary)]"
                title="Đặt lại mật khẩu"
            >
                <KeyRound size={18} />
            </button>
        </div>
    );
}

export default UserActions;
