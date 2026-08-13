import { useEffect, useState } from "react";
import { ArrowLeft, Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import productApi from "../api/productApi.js";

import ProductDetailCard from "../components/products/ProductDetailCard.jsx";
import Modal from "../components/common/Modal.jsx";
import ProductForm from "../components/products/ProductForm.jsx";

function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const loadProduct = async () => {
        try {
            const response = await productApi.getProduct(id);

            setProduct(response.data?.data);
        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Không thể tải sản phẩm"
            );
        }
    };

    useEffect(() => {
        loadProduct();
    }, [id]);

    if (!product) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-slate-500">
                    Đang tải dữ liệu...
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 bg-(--color-background) px-4 py-6 sm:px-6 lg:px-12 lg:py-10">

            <button
                type="button"
                onClick={() => navigate("/products")}
                className="group flex items-center gap-2 text-base font-medium text-slate-600 transition hover:text-(--color-primary-hover)"
            >
                <ArrowLeft
                    size={18}
                    className="transition group-hover:-translate-x-1"
                />

                Quay lại danh sách sản phẩm
            </button>

            <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                            {product.name}
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            {product.code}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowForm(true)}
                        className="flex items-center justify-center gap-2 rounded-lg bg-(--color-primary) px-5 py-3 font-medium text-white transition hover:bg-(--color-primary-hover)"
                    >
                        <Pencil size={18} />
                        Chỉnh sửa
                    </button>

                </div>
            </div>

            <ProductDetailCard product={product} />

            {showForm && (
                <Modal
                    title="Chỉnh sửa sản phẩm"
                    onClose={() => setShowForm(false)}
                >
                    <ProductForm
                        product={product}
                        onCancel={() => setShowForm(false)}
                        onSuccess={async () => {
                            setShowForm(false);
                            await loadProduct();
                        }}
                    />
                </Modal>
            )}

        </div>
    );
}

export default ProductDetailPage;