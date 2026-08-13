import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import productApi from "../api/productApi.js";
import useSort from "../hooks/useSort.js";

import PageHeader from "../components/common/PageHeader.jsx";
import TableToolbar from "../components/common/TableToolbar.jsx";
import Modal from "../components/common/Modal.jsx";
import Pagination from "../components/common/Pagination.jsx";
import ProductForm from "../components/products/ProductForm.jsx";
import ProductTable from "../components/products/ProductTable.jsx";

function ProductPage() {

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [page, setPage] = useState(0);
    const [pageSize] = useState(8);
    const [totalPages, setTotalPages] = useState(0);

    const { sortField, sortDir, onSort, sortParam } = useSort("name", "asc");

    const loadProducts = async () => {
        try {
            const response = await productApi.getProducts({
                keyword: search.trim(),
                page,
                size: pageSize,
                sort: sortParam,
            });

            const data = response.data.data;

            setProducts(data.content ?? []);
            setTotalPages(data.totalPages ?? 0);
        } catch (error) {
            console.error(error);

            setProducts([]);
            setTotalPages(0);
        }
    };

    useEffect(() => {
        setPage(0);
    }, [sortParam, search]);

    useEffect(() => {
        loadProducts();
    }, [page, pageSize, sortParam, search]);

    return (
        <div>

            <PageHeader
                title="Sản phẩm"
                description="Quản lý sản phẩm."
                actionLabel="Thêm sản phẩm"
                actionIcon={<Plus size={18}/>}
                onAction={() => {
                    setSelectedProducts(null);
                    setShowForm(true);
                }}
            />

            <TableToolbar search={search} setSearch={setSearch} />

            <ProductTable
                products={products}
                onEdit={(product) => {
                    setSelectedProducts(product);
                    setShowForm(true);
                }}
                onRefresh={loadProducts}
                sortField={sortField}
                sortDir={sortDir}
                onSort={onSort}
                startIndex={page * pageSize}
            />

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

            {showForm && (
                <Modal
                    title={selectedProducts ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}
                    onClose={() => setShowForm(false)}
                >
                    <ProductForm
                        product={selectedProducts}
                        onCancel={() => setShowForm(false)}
                        onSuccess={() => {
                            setShowForm(false);
                            loadProducts();
                        }}
                    />
                </Modal>
            )}

        </div>
    );
}

export default ProductPage;
