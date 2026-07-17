import Badge from "../common/Badge.jsx";
import { formatDate } from "./reportUtils.js";

function actionLabel(action) {
    const labels = {
        CREATE: "Tạo mới",
        READ: "Xem",
        UPDATE: "Cập nhật",
        DELETE: "Xóa",
        LOGIN: "Đăng nhập"
    };

    return labels[action] ?? action;
}

function actionColor(action) {
    if (action === "CREATE" || action === "LOGIN") return "green";
    if (action === "UPDATE") return "yellow";
    if (action === "DELETE") return "red";

    return "gray";
}

function AuditLogTable({ logs = [] }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-(--color-border) bg-white shadow-sm">
            <table className="w-full">
                <thead className="border-b border-pink-100">
                <tr>
                    <th className="px-6 py-4 text-left">Thời gian</th>
                    <th className="px-6 py-4 text-left">Người dùng</th>
                    <th className="px-6 py-4 text-left">Hành động</th>
                    <th className="px-6 py-4 text-left">Đối tượng</th>
                    <th className="px-6 py-4 text-left">Mô tả</th>
                    <th className="px-6 py-4 text-left">Địa chỉ IP</th>
                </tr>
                </thead>
                <tbody>
                {logs.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                            Không có dữ liệu nhật ký hệ thống
                        </td>
                    </tr>
                ) : logs.map((log) => (
                    <tr key={log.id} className="border-b border-pink-100 transition hover:bg-pink-50">
                        <td className="px-6 py-4 text-sm text-slate-700">{formatDate(log.createdAt)}</td>
                        <td className="px-6 py-4 text-sm text-slate-700">{log.username}</td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                            <Badge color={actionColor(log.action)}>
                                {actionLabel(log.action)}
                            </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">{log.entityName}</td>
                        <td className="px-6 py-4 text-sm text-slate-700">{log.description}</td>
                        <td className="px-6 py-4 text-sm text-slate-700">{log.ipAddress}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default AuditLogTable;
