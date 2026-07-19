import Badge from "../common/Badge.jsx";
import { formatDate } from "./reportUtils.js";
import SortableHeader from "../common/SortableHeader.jsx";


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

function AuditLogTable({ logs = [], sortField, sortDir, onSort }) {
    const sortProps = { sortField, sortDir, onSort };

    return (
        <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-white shadow-sm">
            <table className="min-w-[980px] w-full">
                <thead className="border-b border-pink-100">
                <tr>
                    <SortableHeader field="createdAt"  label="Thời gian"  {...sortProps} className="text-left" />
                    <SortableHeader field="username"   label="Người dùng" {...sortProps} className="text-left" />
                    <SortableHeader field="action"     label="Hành động"  {...sortProps} className="text-left" />
                    <SortableHeader field="entityType" label="Đối tượng"  {...sortProps} className="text-left" />
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">Mô tả</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">Địa chỉ IP</th>
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
