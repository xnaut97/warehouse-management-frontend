import { useEffect, useMemo, useState } from "react";
import { ArrowUpFromLine, CircleDollarSign, PackageCheck } from "lucide-react";

import PageHeader from "../../components/common/PageHeader.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import StatCard from "../../components/common/StatCard.jsx";
import ReportFilters, { FilterField, FilterInput } from "../../components/reports/ReportFilters.jsx";
import IssueReportTable from "../../components/reports/IssueReportTable.jsx";
import { firstDayOfMonth, formatCurrency, formatNumber, today, unwrap } from "../../components/reports/reportUtils.js";
import reportApi from "../../api/reportApi.js";
import issueApi from "../../api/issueApi.js";

function IssueReport() {
    const [filters, setFilters] = useState({
        fromDate: firstDayOfMonth(),
        toDate: today(),
        customer: "",
        material: ""
    });
    const [issues, setIssues] = useState([]);
    const [daily, setDaily] = useState({});
    const [customers, setCustomers] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize] = useState(8);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const loadReport = async () => {
            const [
                issuesResponse,
                dailyResponse,
                customersResponse,
                materialsResponse
            ] = await Promise.all([
                issueApi.getAll({ page, size: pageSize }),
                reportApi.getIssueDaily({ date: filters.toDate || today() }),
                reportApi.getIssueCustomers({ fromDate: filters.fromDate, toDate: filters.toDate }),
                reportApi.getIssueMaterials({ fromDate: filters.fromDate, toDate: filters.toDate })
            ]);

            const data = issuesResponse.data.data;
            setIssues(data.content);
            setTotalPages(data.totalPages);
            setDaily(unwrap(dailyResponse, {}));
            setCustomers(unwrap(customersResponse, []));
            setMaterials(unwrap(materialsResponse, []));
        };

        loadReport().catch(console.log);
    }, [page, pageSize, filters.fromDate, filters.toDate]);

    const filteredMaterials = materials.filter((item) => {
        const keyword = filters.material.toLowerCase();
        return !keyword ||
            item.materialCode?.toLowerCase().includes(keyword) ||
            item.materialName?.toLowerCase().includes(keyword);
    });

    return (
        <div>
            <PageHeader
                title="Báo cáo xuất kho"
                description="Theo dõi xuất kho theo ngày, theo khách hàng và theo mặt hàng."
            />

            <ReportFilters>
                <FilterField label="Từ ngày">
                    <FilterInput
                        type="date"
                        value={filters.fromDate}
                        onChange={(e) => { setPage(0); setFilters({ ...filters, fromDate: e.target.value }); }}
                    />
                </FilterField>
                <FilterField label="Đến ngày">
                    <FilterInput
                        type="date"
                        value={filters.toDate}
                        onChange={(e) => { setPage(0); setFilters({ ...filters, toDate: e.target.value }); }}
                    />
                </FilterField>
                <FilterField label="Khách hàng">
                    <FilterInput
                        value={filters.customer}
                        placeholder="Tìm theo khách hàng"
                        onChange={(e) => setFilters({ ...filters, customer: e.target.value })}
                    />
                </FilterField>
                <FilterField label="Thành phẩm">
                    <FilterInput
                        value={filters.material}
                        placeholder="Tìm theo mã hoặc tên"
                        onChange={(e) => setFilters({ ...filters, material: e.target.value })}
                    />
                </FilterField>
            </ReportFilters>

            <div className="mb-6 grid gap-6 md:grid-cols-3">
                <StatCard title="Phiếu xuất trong ngày" value={formatNumber(daily.totalIssues)} icon={<ArrowUpFromLine size={24} className="text-orange-600" />} />
                <StatCard title="Tổng số lượng" value={formatNumber(daily.totalQuantity)} icon={<PackageCheck size={24} className="text-pink-600" />} />
                <StatCard title="Tổng tiền" value={formatCurrency(daily.totalAmount)} icon={<CircleDollarSign size={24} className="text-sky-600" />} />
            </div>

            <div className="mb-6 grid gap-6 xl:grid-cols-2">
                <div className="rounded-2xl border border-(--color-border) bg-white p-5 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold text-gray-800">Báo cáo theo khách hàng</h2>
                    <div className="space-y-3">
                        {customers.map((item) => (
                            <div key={item.customerId} className="flex items-center justify-between rounded-xl bg-pink-50 px-4 py-3 text-sm">
                                <span>{item.customerName}</span>
                                <span className="font-semibold">{formatCurrency(item.totalAmount)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border border-(--color-border) bg-white p-5 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold text-gray-800">Báo cáo theo thành phẩm</h2>
                    <div className="space-y-3">
                        {filteredMaterials.map((item) => (
                            <div key={item.materialId} className="flex items-center justify-between rounded-xl bg-pink-50 px-4 py-3 text-sm">
                                <span>{item.materialCode} - {item.materialName}</span>
                                <span className="font-semibold">{formatCurrency(item.totalAmount)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <IssueReportTable issues={filters.customer} />

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
    );
}

export default IssueReport;
