import { useEffect, useMemo, useState } from "react";
import { Archive, CircleDollarSign, Warehouse } from "lucide-react";

import PageHeader from "../../components/common/PageHeader.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import StatCard from "../../components/common/StatCard.jsx";
import ReportFilters, { FilterField, FilterInput } from "../../components/reports/ReportFilters.jsx";
import InventoryReportTable from "../../components/reports/InventoryReportTable.jsx";
import { firstDayOfMonth, formatCurrency, formatNumber, sumBy, today } from "../../components/reports/reportUtils.js";
import reportApi from "../../api/reportApi.js";

function InventoryReport() {
    const [mode, setMode] = useState("inventory");
    const [filters, setFilters] = useState({
        warehouse: "",
        material: "",
        fromDate: firstDayOfMonth(),
        toDate: today()
    });
    const [inventories, setInventories] = useState([]);
    const [history, setHistory] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize] = useState(8);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const loadReport = async () => {
            const [inventoryResponse, historyResponse] = await Promise.all([
                reportApi.getInventoryRawMaterials({ page, size: pageSize }),
                reportApi.getInventoryHistory({
                    fromDate: filters.fromDate,
                    toDate:   filters.toDate,
                    page,
                    size: pageSize,
                })
            ]);

            const inventoryData = inventoryResponse.data.data;
            const historyData   = historyResponse.data.data;

            setInventories(inventoryData.content);
            setHistory(historyData.content);
            setTotalPages(mode === "inventory"
                ? inventoryData.totalPages
                : historyData.totalPages);
        };

        loadReport().catch(console.log);
    }, [page, pageSize, mode, filters.fromDate, filters.toDate]);

    const filteredInventories = useMemo(() => {
        const warehouse = filters.warehouse.toLowerCase();
        const material  = filters.material.toLowerCase();

        return inventories.filter((item) => {
            const matchWarehouse = !warehouse || item.warehouse?.toLowerCase().includes(warehouse);
            const matchMaterial  =
                !material ||
                item.materialCode?.toLowerCase().includes(material) ||
                item.materialName?.toLowerCase().includes(material);

            return matchWarehouse && matchMaterial;
        });
    }, [inventories, filters]);

    const filteredHistory = useMemo(() => {
        const warehouse = filters.warehouse.toLowerCase();
        const material  = filters.material.toLowerCase();

        return history.filter((item) => {
            const matchWarehouse = !warehouse || item.warehouse?.toLowerCase().includes(warehouse);
            const matchMaterial  =
                !material ||
                item.materialCode?.toLowerCase().includes(material) ||
                item.materialName?.toLowerCase().includes(material);

            return matchWarehouse && matchMaterial;
        });
    }, [history, filters]);

    return (
        <div>
            <PageHeader
                title="Báo cáo tồn kho"
                description="Theo dõi tồn nguyên vật liệu, giá trị tồn và biến động theo khoảng thời gian."
            />

            <div className="mb-6 flex gap-3">
                <button
                    type="button"
                    onClick={() => { setMode("inventory"); setPage(0); }}
                    className={`rounded-xl px-4 py-2 text-sm font-medium ${mode === "inventory" ? "bg-(--color-primary) text-white" : "bg-white text-gray-600"}`}
                >
                    Tồn hiện tại
                </button>
                <button
                    type="button"
                    onClick={() => { setMode("history"); setPage(0); }}
                    className={`rounded-xl px-4 py-2 text-sm font-medium ${mode === "history" ? "bg-(--color-primary) text-white" : "bg-white text-gray-600"}`}
                >
                    Lịch sử tồn kho
                </button>
            </div>

            <ReportFilters>
                <FilterField label="Kho">
                    <FilterInput
                        value={filters.warehouse}
                        placeholder="Tìm theo kho"
                        onChange={(e) => setFilters({ ...filters, warehouse: e.target.value })}
                    />
                </FilterField>
                <FilterField label="Nguyên vật liệu / thành phẩm">
                    <FilterInput
                        value={filters.material}
                        placeholder="Tìm theo mã hoặc tên"
                        onChange={(e) => setFilters({ ...filters, material: e.target.value })}
                    />
                </FilterField>
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
            </ReportFilters>

            <div className="mb-6 grid gap-6 md:grid-cols-3">
                <StatCard title="Mặt hàng tồn"    value={formatNumber(filteredInventories.length)} icon={<Archive size={24} className="text-pink-600" />} />
                <StatCard title="Số kho"           value={formatNumber(new Set(filteredInventories.map((i) => i.warehouse)).size)} icon={<Warehouse size={24} className="text-sky-600" />} />
                <StatCard title="Tổng giá trị tồn" value={formatCurrency(sumBy(filteredInventories, "inventoryValue"))} icon={<CircleDollarSign size={24} className="text-emerald-600" />} />
            </div>

            <InventoryReportTable
                mode={mode}
                inventories={filteredInventories}
                history={filteredHistory}
            />

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
    );
}

export default InventoryReport;
