import { useCallback, useMemo, useState } from "react";
import { FileSpreadsheet, Printer } from "lucide-react";
import toast from "react-hot-toast";

import inventoryApi from "../api/inventoryApi.js";
import useReportData from "../hooks/useReportData.js";

import Button from "../components/common/Button.jsx";
import PageHeader from "../components/common/PageHeader";
import Loading from "../components/common/Loading.jsx";
import TableToolbar from "../components/common/TableToolbar";
import Pagination from "../components/common/Pagination.jsx";
import ReportFilters, {
    FilterField,
    FilterInput
} from "../components/reports/ReportFilters.jsx";
import ReportErrorState from "../components/reports/ReportErrorState.jsx";
import InventoryStats from "../components/inventory/InventoryStats.jsx";
import MaterialInventoryTable from "../components/inventory/MaterialInventoryTable.jsx";
import ProductInventoryTable from "../components/inventory/ProductInventoryTable.jsx";
import PrintInventoryModal from "../components/inventory/PrintInventoryModal.jsx";
import {
    exportInventoryToExcel,
    printInventory
} from "../components/inventory/inventoryExport.js";
import {
    firstDayOfMonthsAgo,
    today,
    unwrap
} from "../components/reports/reportUtils.js";

const PAGE_SIZE = 8;

function InventorySection({
                              title,
                              description,
                              warehouseName,
                              items,
                              loading,
                              error,
                              onRetry,
                              children
                          }) {

    return (

        <section className="space-y-4">

            <div>

                <h2 className="text-xl font-bold text-(--color-text)">
                    {title}
                </h2>

                <p className="mt-1 text-sm text-(--color-text-secondary)">
                    {description}
                </p>

            </div>

            {loading && <Loading rows={5} />}

            {!loading && error && (
                <ReportErrorState
                    message={error}
                    onRetry={onRetry}
                />
            )}

            {!loading && !error && (

                <>

                    {warehouseName && (
                        <p className="text-sm text-(--color-text-secondary)">
                            Kho: <span className="font-semibold text-(--color-text)">
                                {warehouseName}
                            </span>
                        </p>
                    )}

                    {children(items)}

                </>

            )}

        </section>

    );

}

function InventoryPage() {

    const [fromDate, setFromDate] = useState(() => firstDayOfMonthsAgo(11));
    const [toDate, setToDate] = useState(today);
    const [search, setSearch] = useState("");
    const [materialPage, setMaterialPage] = useState(0);
    const [productPage, setProductPage] = useState(0);
    const [exporting, setExporting] = useState(false);
    const [showPrintModal, setShowPrintModal] = useState(false);

    const materialRequest = useCallback(
        () => inventoryApi.getSummary({
            stockGroup: "MATERIAL",
            fromDate,
            toDate
        }),
        [fromDate, toDate]
    );

    const productRequest = useCallback(
        () => inventoryApi.getSummary({
            stockGroup: "PRODUCT",
            fromDate,
            toDate
        }),
        [fromDate, toDate]
    );

    const materials = useReportData(materialRequest, [fromDate, toDate]);
    const products = useReportData(productRequest, [fromDate, toDate]);

    const filter = useCallback(
        (items) => {

            const keyword = search.trim().toLowerCase();

            if (!keyword) {
                return items;
            }

            return items.filter((item) =>
                (item.code || "").toLowerCase().includes(keyword) ||
                (item.name || "").toLowerCase().includes(keyword)
            );

        },
        [search]
    );

    const materialItems = useMemo(
        () => filter(materials.data?.items ?? []),
        [filter, materials.data]
    );

    const productItems = useMemo(
        () => filter(products.data?.items ?? []),
        [filter, products.data]
    );

    const materialTotalPages = Math.ceil(materialItems.length / PAGE_SIZE);
    const productTotalPages = Math.ceil(productItems.length / PAGE_SIZE);

    const materialPageIndex = Math.min(
        materialPage,
        Math.max(materialTotalPages - 1, 0)
    );

    const productPageIndex = Math.min(
        productPage,
        Math.max(productTotalPages - 1, 0)
    );

    const exportContext = useMemo(
        () => ({
            fromDate,
            toDate,
            search,
            materials: materialItems,
            products: productItems,
            materialWarehouseName: materials.data?.warehouseName,
            productWarehouseName: products.data?.warehouseName
        }),
        [
            fromDate,
            toDate,
            search,
            materialItems,
            productItems,
            materials.data,
            products.data
        ]
    );

    const busy = materials.loading || products.loading || exporting;

    const empty = materialItems.length === 0 && productItems.length === 0;

    const handleExportExcel = () => {

        if (busy) return;

        if (empty) {
            toast.error("Không có dữ liệu tồn kho để xuất.");
            return;
        }

        setExporting(true);

        try {

            exportInventoryToExcel(exportContext);

            toast.success("Đã xuất file Excel.");

        } catch {

            toast.error("Không thể xuất file Excel.");

        } finally {

            setExporting(false);

        }

    };

    const handlePrintSubmit = async ({ fromDate: printFromDate, toDate: printToDate }) => {
        try {
            const [matRes, prodRes] = await Promise.all([
                inventoryApi.getSummary({
                    stockGroup: "MATERIAL",
                    fromDate: printFromDate,
                    toDate: printToDate
                }),
                inventoryApi.getSummary({
                    stockGroup: "PRODUCT",
                    fromDate: printFromDate,
                    toDate: printToDate
                })
            ]);

            const matData = unwrap(matRes, null);
            const prodData = unwrap(prodRes, null);

            const matItems = filter(matData?.items ?? []);
            const prodItems = filter(prodData?.items ?? []);

            if (matItems.length === 0 && prodItems.length === 0) {
                toast.error("Không có dữ liệu tồn kho trong khoảng thời gian đã chọn.");
                return;
            }

            printInventory({
                fromDate: printFromDate,
                toDate: printToDate,
                search,
                materials: matItems,
                products: prodItems,
                materialWarehouseName: matData?.warehouseName,
                productWarehouseName: prodData?.warehouseName
            });

            toast.success("Đã tạo báo cáo in tổng hợp Nhập - Xuất - Tồn");
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu báo cáo in:", error);
            toast.error("Không thể mở bản in.");
            throw error;
        }
    };

    return (

        <div>

            <PageHeader
                title="Tồn kho"
                description="Theo dõi tồn đầu, nhập, xuất, tồn cuối và giá trị vốn tồn của kho nguyên vật liệu và kho sản phẩm trong kỳ."
            />

            <InventoryStats
                materials={materials.data?.items ?? []}
                products={products.data?.items ?? []}
            />

            <ReportFilters>

                <FilterField label="Từ ngày">
                    <FilterInput
                        type="date"
                        value={fromDate}
                        max={toDate}
                        onChange={(event) => setFromDate(event.target.value)}
                    />
                </FilterField>

                <FilterField label="Đến ngày">
                    <FilterInput
                        type="date"
                        value={toDate}
                        min={fromDate}
                        onChange={(event) => setToDate(event.target.value)}
                    />
                </FilterField>

            </ReportFilters>

            <TableToolbar
                search={search}
                setSearch={(value) => {
                    setSearch(value);
                    setMaterialPage(0);
                    setProductPage(0);
                }}
            >

                <Button
                    variant="secondary"
                    onClick={handleExportExcel}
                    disabled={busy}
                >
                    <FileSpreadsheet size={18} />
                    Xuất Excel
                </Button>

                <Button
                    variant="secondary"
                    onClick={() => setShowPrintModal(true)}
                    disabled={busy}
                >
                    <Printer size={18} />
                    In
                </Button>

            </TableToolbar>

            <div className="space-y-10">

                <InventorySection
                    title="KHO NVL"
                    description="Tồn kho nguyên vật liệu trong kỳ, trạng thái so với định mức tồn tối thiểu và tối đa."
                    warehouseName={materials.data?.warehouseName}
                    items={materialItems}
                    loading={materials.loading}
                    error={materials.error}
                    onRetry={materials.reload}
                >

                    {(items) => (

                        <>

                            <MaterialInventoryTable
                                items={items.slice(
                                    materialPageIndex * PAGE_SIZE,
                                    materialPageIndex * PAGE_SIZE + PAGE_SIZE
                                )}
                            />

                            <Pagination
                                page={materialPageIndex}
                                totalPages={materialTotalPages}
                                onPageChange={setMaterialPage}
                            />

                        </>

                    )}

                </InventorySection>

                <InventorySection
                    title="KHO SẢN PHẨM"
                    description="Tồn kho thành phẩm trong kỳ. Chọn một sản phẩm để xem chi tiết các lô còn tồn theo thứ tự hạn dùng."
                    warehouseName={products.data?.warehouseName}
                    items={productItems}
                    loading={products.loading}
                    error={products.error}
                    onRetry={products.reload}
                >

                    {(items) => (

                        <>

                            <ProductInventoryTable
                                items={items.slice(
                                    productPageIndex * PAGE_SIZE,
                                    productPageIndex * PAGE_SIZE + PAGE_SIZE
                                )}
                            />

                            <Pagination
                                page={productPageIndex}
                                totalPages={productTotalPages}
                                onPageChange={setProductPage}
                            />

                        </>

                    )}

                </InventorySection>

            </div>

            <PrintInventoryModal
                open={showPrintModal}
                onClose={() => setShowPrintModal(false)}
                onSubmit={handlePrintSubmit}
            />

        </div>

    );

}

export default InventoryPage;
