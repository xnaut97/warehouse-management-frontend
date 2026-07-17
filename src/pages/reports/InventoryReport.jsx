import { useEffect, useMemo, useState } from "react";
import { Archive, CircleDollarSign, Warehouse } from "lucide-react";

import PageHeader from "../../components/common/PageHeader.jsx";
import StatCard from "../../components/common/StatCard.jsx";
import ReportFilters, { FilterField, FilterInput } from "../../components/reports/ReportFilters.jsx";
import InventoryReportTable from "../../components/reports/InventoryReportTable.jsx";
import { firstDayOfMonth, formatCurrency, formatNumber, sumBy, today, unwrap } from "../../components/reports/reportUtils.js";
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

    const loadReport = async () => {
        const [inventoryResponse, historyResponse] = await Promise.all([
            reportApi.getInventoryRawMaterials(),
            reportApi.getInventoryHistory({
                fromDate: filters.fromDate,
                toDate: filters.toDate
            })
        ]);

        setInventories(unwrap(inventoryResponse, []));
        setHistory(unwrap(historyResponse, []));
    };

    useEffect(() => {
        loadReport().catch(console.log);
    }, [filters.fromDate, filters.toDate]);

    const filteredInventories = useMemo(() => {
        const warehouse = filters.warehouse.toLowerCase();
        const material = filters.material.toLowerCase();

        return inventories.filter((item) => {
            const matchWarehouse = !warehouse || item.warehouse?.toLowerCase().includes(warehouse);
            const matchMaterial =
                !material ||
                item.materialCode?.toLowerCase().includes(material) ||
                item.materialName?.toLowerCase().includes(material);

            return matchWarehouse && matchMaterial;
        });
    }, [inventories, filters]);

    const filteredHistory = useMemo(() => {
        const warehouse = filters.warehouse.toLowerCase();
        const material = filters.material.toLowerCase();

        return history.filter((item) => {
            const matchWarehouse = !warehouse || item.warehouse?.toLowerCase().includes(warehouse);
            const matchMaterial =
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
                    onClick={() => setMode("inventory")}
                    className={`rounded-xl px-4 py-2 text-sm font-medium ${mode === "inventory" ? "bg-(--color-primary) text-white" : "bg-white text-gray-600"}`}
                >
                    Tồn hiện tại
                </button>
                <button
                    type="button"
                    onClick={() => setMode("history")}
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
                        onChange={(event) => setFilters({ ...filters, warehouse: event.target.value })}
                    />
                </FilterField>
                <FilterField label="Nguyên vật liệu / thành phẩm">
                    <FilterInput
                        value={filters.material}
                        placeholder="Tìm theo mã hoặc tên"
                        onChange={(event) => setFilters({ ...filters, material: event.target.value })}
                    />
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

            <div className="mb-6 grid gap-6 md:grid-cols-3">
                <StatCard title="Mặt hàng tồn" value={formatNumber(filteredInventories.length)} icon={<Archive size={24} className="text-pink-600" />} />
                <StatCard title="Số kho" value={formatNumber(new Set(filteredInventories.map((item) => item.warehouse)).size)} icon={<Warehouse size={24} className="text-sky-600" />} />
                <StatCard title="Tổng giá trị tồn" value={formatCurrency(sumBy(filteredInventories, "inventoryValue"))} icon={<CircleDollarSign size={24} className="text-emerald-600" />} />
            </div>

            <InventoryReportTable
                mode={mode}
                inventories={filteredInventories}
                history={filteredHistory}
            />
        </div>
    );
}

export default InventoryReport;
