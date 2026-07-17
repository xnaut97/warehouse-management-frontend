import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import productApi from "../api/productApi.js";

import PageHeader from "../components/common/PageHeader.jsx";
import TableToolbar from "../components/common/TableToolbar.jsx";
import Modal from "../components/common/Modal.jsx";

import ProductForm from "../components/products/ProductForm.jsx";
import ProductTable from "../components/products/ProductTable.jsx";

function ProductPage() {

    const [products, setProducts] = useState([]);

    const [search, setSearch] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [selectedProducts, setSelectedProducts] = useState(null);

    const loadProducts = async () => {

        try {

            const response =
                await productApi.getProducts();

            setProducts(response.data.data.content);

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        loadProducts();

    }, []);

    const filteredProducts = products.filter((products) => {

        const keyword = search.toLowerCase();

        return (

            products.name.toLowerCase().includes(keyword) ||

            products.code.toLowerCase().includes(keyword) ||

            (products.address || "")
                .toLowerCase()
                .includes(keyword) ||

            (products.managerName || "")
                .toLowerCase()
                .includes(keyword)

        );

    });

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

            <TableToolbar

                search={search}

                setSearch={setSearch}

            />

            <ProductTable

                products={filteredProducts}

                onEdit={(product) => {

                    setSelectedProducts(product);

                    setShowForm(true);

                }}

                onRefresh={loadProducts}

            />

            {

                showForm &&

                <Modal

                    title={

                        selectedProducts

                            ? "Chỉnh sửa sản phẩm"

                            : "Thêm sản phẩm"

                    }

                    onClose={() =>

                        setShowForm(false)

                    }

                >

                    <ProductForm

                        product={selectedProducts}

                        onCancel={() =>

                            setShowForm(false)

                        }

                        onSuccess={() => {

                            setShowForm(false);

                            loadProducts();

                        }}

                    />

                </Modal>

            }

        </div>

    );

}

export default ProductPage;
