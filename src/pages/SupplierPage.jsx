import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import supplierApi from "../api/supplierApi.js";

import PageHeader from "../components/common/PageHeader.jsx";
import TableToolbar from "../components/common/TableToolbar.jsx";

import SupplierTable from "../components/suppliers/SupplierTable.jsx";

import Modal from "../components/common/Modal.jsx";
import SupplierForm from "../components/suppliers/SupplierForm.jsx";

function SupplierPage() {

    const [showForm, setShowForm] = useState(false);

    const [selectedSupplier, setSelectedSupplier] = useState(null);

    const [suppliers, setSuppliers] = useState([]);

    const [search, setSearch] = useState("");

    const loadSuppliers = async () => {

        try {

            const response = await supplierApi.getAllSuppliers();

            console.log("Response:", response);
            console.log("Response.data:", response.data);

            setSuppliers(response.data.data.content);

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        loadSuppliers();

    }, []);

    const filteredSuppliers = suppliers.filter((supplier) => {

        const keyword = search.toLowerCase();

        return (

            supplier.name.toLowerCase().includes(keyword) ||

            supplier.code.toLowerCase().includes(keyword) ||

            supplier.contactPerson.toLowerCase().includes(keyword)

        );

    });

    return (

        <div>

            <PageHeader
                title="Nhà cung cấp"
                description="Quản lý thông tin nhà cung cấp."
                actionLabel="Thêm nhà cung cấp"
                actionIcon={<Plus size={18} />}
                onAction={() => {

                    setSelectedSupplier(null);

                    setShowForm(true);

                }}
            />

            <TableToolbar
                search={search}
                setSearch={setSearch}
            />

            <SupplierTable

                suppliers={filteredSuppliers}

                onEdit={(supplier) => {

                    setSelectedSupplier(supplier);

                    setShowForm(true);

                }}

                onRefresh={loadSuppliers}

            />

            {
                showForm &&

                <Modal

                    title={
                        selectedSupplier
                            ? "Chỉnh sửa nhà cung cấp"
                            : "Thêm nhà cung cấp"
                    }

                    onClose={() => setShowForm(false)}

                >

                    <SupplierForm

                        supplier={selectedSupplier}

                        onCancel={() => setShowForm(false)}

                        onSuccess={() => {

                            setShowForm(false);

                            loadSuppliers();

                        }}

                    />

                </Modal>

            }

        </div>

    );

}

export default SupplierPage;
