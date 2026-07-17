import { useEffect, useMemo, useState } from "react";
import { ArrowDownToLine, CircleDollarSign, PackageCheck } from "lucide-react";

import PageHeader from "../../components/common/PageHeader.jsx";
import StatCard from "../../components/common/StatCard.jsx";
import ReportFilters, { FilterField, FilterInput } from "../../components/reports/ReportFilters.jsx";
import ReceiptReportTable from "../../components/reports/ReceiptReportTable.jsx";
import { firstDayOfMonth, formatCurrency, formatNumber, pageContent, sumBy, today, unwrap } from "../../components/reports/reportUtils.js";
import reportApi from "../../api/reportApi.js";
import receiptApi from "../../api/receiptApi.js";

function ReceiptReport() {
    const [filters, setFilters] = useState({
        fromDate: firstDayOfMonth(),
        toDate: today(),
        supplier: ""
    });
    const [receipts, setReceipts] = useState([]);
    const [daily, setDaily] = useState({});
    const [monthly, setMonthly] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    const loadReport = async () => {
        const year = new Date(filters.fromDate || today()).getFullYear();

        const [
            receiptsResponse,
            dailyResponse,
            monthlyResponse,
            suppliersResponse
        ] = await Promise.all([
            receiptApi.getAll({ page: 0, size: 200 }),
            reportApi.getReceiptDaily({ date: filters.toDate || today() }),
            reportApi.getReceiptMonthly({ year }),
            reportApi.getReceiptSuppliers({
                fromDate: filters.fromDate,
                toDate: filters.toDate
            })
        ]);

        setReceipts(pageContent(receiptsResponse));
        setDaily(unwrap(dailyResponse, {}));
        setMonthly(unwrap(monthlyResponse, []));
        setSuppliers(unwrap(suppliersResponse, []));
    };

    useEffect(() => {
        loadReport().catch(console.log);
    }, [filters.fromDate, filters.toDate]);

    const filteredReceipts = useMemo(() => {
        const supplier = filters.supplier.toLowerCase();

        return receipts.filter((receipt) => {
            const inDateRange =
                (!filters.fromDate || receipt.receiptDate >= filters.fromDate) &&
                (!filters.toDate || receipt.receiptDate <= filters.toDate);
            const matchSupplier =
                !supplier ||
                receipt.supplier?.toLowerCase().includes(supplier);

            return inDateRange && matchSupplier;
        });
    }, [receipts, filters]);

    const monthlyTotalAmount = sumBy(monthly, "totalAmount");

    return (
        <div>
            <PageHeader
                title="Báo cáo nhập kho"
                description="Theo dõi nhập kho theo ngày, theo tháng và theo nhà cung cấp."
            />

            <ReportFilters>
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
                <FilterField label="Nhà cung cấp">
                    <FilterInput
                        value={filters.supplier}
                        placeholder="Tìm theo nhà cung cấp"
                        onChange={(event) => setFilters({ ...filters, supplier: event.target.value })}
                    />
                </FilterField>
            </ReportFilters>

            <div className="mb-6 grid gap-6 md:grid-cols-3">
                <StatCard title="Phiếu nhập trong ngày" value={formatNumber(daily.totalReceipts)} icon={<ArrowDownToLine size={24} className="text-emerald-600" />} />
                <StatCard title="Tổng số lượng" value={formatNumber(daily.totalQuantity)} icon={<PackageCheck size={24} className="text-pink-600" />} />
                <StatCard title="Tổng tiền theo tháng" value={formatCurrency(monthlyTotalAmount)} icon={<CircleDollarSign size={24} className="text-sky-600" />} />
            </div>

            <div className="mb-6 grid gap-6 xl:grid-cols-2">
                <div className="rounded-2xl border border-(--color-border) bg-white p-5 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold text-gray-800">Báo cáo theo tháng</h2>
                    <div className="space-y-3">
                        {monthly.map((item) => (
                            <div key={item.month} className="flex items-center justify-between rounded-xl bg-pink-50 px-4 py-3 text-sm">
                                <span>Tháng {item.month}</span>
                                <span className="font-semibold">{formatCurrency(item.totalAmount)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border border-(--color-border) bg-white p-5 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold text-gray-800">Báo cáo theo nhà cung cấp</h2>
                    <div className="space-y-3">
                        {suppliers.map((item) => (
                            <div key={item.supplierId} className="flex items-center justify-between rounded-xl bg-pink-50 px-4 py-3 text-sm">
                                <span>{item.supplierName}</span>
                                <span className="font-semibold">{formatCurrency(item.totalAmount)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <ReceiptReportTable receipts={filteredReceipts} />
        </div>
    );
}

export default ReceiptReport;
