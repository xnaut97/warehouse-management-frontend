import { useEffect, useMemo, useState } from "react";
import { FileClock, Pencil, Plus, Trash2 } from "lucide-react";

import PageHeader from "../../components/common/PageHeader.jsx";
import StatCard from "../../components/common/StatCard.jsx";
import ReportFilters, { FilterField, FilterInput, FilterSelect } from "../../components/reports/ReportFilters.jsx";
import AuditLogTable from "../../components/reports/AuditLogTable.jsx";
import { firstDayOfMonth, formatNumber, today, unwrap } from "../../components/reports/reportUtils.js";
import reportApi from "../../api/reportApi.js";

function AuditLog() {
    const [filters, setFilters] = useState({
        username: "",
        action: "",
        fromDate: firstDayOfMonth(),
        toDate: today()
    });
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const loadLogs = async () => {
            const response = await reportApi.getAuditLogs({
                username: filters.username || undefined,
                action: filters.action || undefined,
                fromDate: filters.fromDate,
                toDate: filters.toDate
            });

            setLogs(unwrap(response, []));
        };

        loadLogs().catch(console.log);
    }, [filters]);

    const counts = useMemo(() => ({
        create: logs.filter((item) => item.action === "CREATE").length,
        update: logs.filter((item) => item.action === "UPDATE").length,
        delete: logs.filter((item) => item.action === "DELETE").length
    }), [logs]);

    return (
        <div>
            <PageHeader
                title="Nhật ký hệ thống"
                description="Theo dõi lịch sử đăng nhập và các thao tác tạo, cập nhật, xóa trong hệ thống."
            />

            <ReportFilters>
                <FilterField label="Người dùng">
                    <FilterInput
                        value={filters.username}
                        placeholder="Tìm theo người dùng"
                        onChange={(event) => setFilters({ ...filters, username: event.target.value })}
                    />
                </FilterField>
                <FilterField label="Hành động">
                    <FilterSelect
                        value={filters.action}
                        onChange={(event) => setFilters({ ...filters, action: event.target.value })}
                    >
                        <option value="">Tất cả</option>
                        <option value="CREATE">Tạo mới</option>
                        <option value="UPDATE">Cập nhật</option>
                        <option value="DELETE">Xóa</option>
                        <option value="LOGIN">Đăng nhập</option>
                    </FilterSelect>
                </FilterField>
                <FilterField label="Từ ngày">
                    <FilterInput
                        type="date"
                        value={filters.fromDate}
                        onChange={(event) => setFilters({ ...filters, fromDate: event.target.value })}
                    />
                </FilterField>
                <FilterField label="Đến ngày">
                    <FilterInput
                        type="date"
                        value={filters.toDate}
                        onChange={(event) => setFilters({ ...filters, toDate: event.target.value })}
                    />
                </FilterField>
            </ReportFilters>

            <div className="mb-6 grid gap-6 md:grid-cols-4">
                <StatCard title="Tổng nhật ký" value={formatNumber(logs.length)} icon={<FileClock size={24} className="text-pink-600" />} />
                <StatCard title="Create" value={formatNumber(counts.create)} icon={<Plus size={24} className="text-emerald-600" />} />
                <StatCard title="Update" value={formatNumber(counts.update)} icon={<Pencil size={24} className="text-orange-600" />} />
                <StatCard title="Delete" value={formatNumber(counts.delete)} icon={<Trash2 size={24} className="text-red-600" />} />
            </div>

            <AuditLogTable logs={logs} />
        </div>
    );
}

export default AuditLog;
