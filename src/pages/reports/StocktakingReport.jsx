import { useEffect, useMemo, useState } from "react";
import { CircleDollarSign, ClipboardCheck, Scale } from "lucide-react";

import PageHeader from "../../components/common/PageHeader.jsx";
import StatCard from "../../components/common/StatCard.jsx";
import ReportFilters, { FilterField, FilterInput } from "../../components/reports/ReportFilters.jsx";
import StocktakingReportTable from "../../components/reports/StocktakingReportTable.jsx";
import { formatCurrency, formatNumber, unwrap } from "../../components/reports/reportUtils.js";
import reportApi from "../../api/reportApi.js";

function StocktakingReport() {
    const [mode, setMode] = useState("records");
    const [keyword, setKeyword] = useState("");
    const [records, setRecords] = useState([]);
    const [variances, setVariances] = useState([]);
    const [summary, setSummary] = useState({});

    useEffect(() => {
        const loadReport = async () => {
            const [recordsResponse, variancesResponse, summaryResponse] = await Promise.all([
                reportApi.getStocktaking(),
                reportApi.getStocktakingVariances(),
                reportApi.getStocktakingSummary()
            ]);

            setRecords(unwrap(recordsResponse, []));
            setVariances(unwrap(variancesResponse, []));
            setSummary(unwrap(summaryResponse, {}));
        };

        loadReport().catch(console.log);
    }, []);

    const filteredRecords = useMemo(() => {
        const value = keyword.toLowerCase();

        return records.filter((item) =>
            !value ||
            item.stocktakingNo?.toLowerCase().includes(value) ||
            item.warehouse?.toLowerCase().includes(value) ||
            item.createdBy?.toLowerCase().includes(value)
        );
    }, [records, keyword]);

    const filteredVariances = useMemo(() => {
        const value = keyword.toLowerCase();

        return variances.filter((item) =>
            !value ||
            item.stocktakingNo?.toLowerCase().includes(value) ||
            item.materialCode?.toLowerCase().includes(value) ||
            item.materialName?.toLowerCase().includes(value)
        );
    }, [variances, keyword]);

    return (
        <div>
            <PageHeader
                title="Báo cáo kiểm kê"
                description="Theo dõi phiếu kiểm kê, danh sách chênh lệch và tổng giá trị sai lệch."
            />

            <div className="mb-6 flex gap-3">
                <button
                    type="button"
                    onClick={() => setMode("records")}
                    className={`rounded-xl px-4 py-2 text-sm font-medium ${mode === "records" ? "bg-(--color-primary) text-white" : "bg-white text-gray-600"}`}
                >
                    Phiếu kiểm kê
                </button>
                <button
                    type="button"
                    onClick={() => setMode("variances")}
                    className={`rounded-xl px-4 py-2 text-sm font-medium ${mode === "variances" ? "bg-(--color-primary) text-white" : "bg-white text-gray-600"}`}
                >
                    Chênh lệch
                </button>
            </div>

            <ReportFilters>
                <FilterField label="Tìm kiếm">
                    <FilterInput
                        value={keyword}
                        placeholder="Mã phiếu, kho, vật tư hoặc người kiểm kê"
                        onChange={(event) => setKeyword(event.target.value)}
                    />
                </FilterField>
            </ReportFilters>

            <div className="mb-6 grid gap-6 md:grid-cols-3">
                <StatCard title="Tổng phiếu kiểm kê" value={formatNumber(summary.totalStocktaking)} icon={<ClipboardCheck size={24} className="text-pink-600" />} />
                <StatCard title="Tổng số lượng chênh lệch" value={formatNumber(summary.totalVarianceQuantity)} icon={<Scale size={24} className="text-orange-600" />} />
                <StatCard title="Tổng giá trị chênh lệch" value={formatCurrency(summary.totalVarianceValue)} icon={<CircleDollarSign size={24} className="text-emerald-600" />} />
            </div>

            <StocktakingReportTable
                mode={mode}
                records={filteredRecords}
                variances={filteredVariances}
            />
        </div>
    );
}

export default StocktakingReport;
