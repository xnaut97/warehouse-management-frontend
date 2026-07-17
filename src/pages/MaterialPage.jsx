import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import materialApi from "../api/materialApi.js";

import PageHeader from "../components/common/PageHeader.jsx";
import TableToolbar from "../components/common/TableToolbar.jsx";
import Modal from "../components/common/Modal.jsx";
import Pagination from "../components/common/Pagination.jsx";

import MaterialTable from "../components/materials/MaterialTable.jsx";
import MaterialForm from "../components/materials/MaterialForm.jsx";

function MaterialPage() {

    const [pageData, setPageData] = useState(null);

    const [materials, setMaterials] = useState([]);

    const [search, setSearch] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [selectedMaterial, setSelectedMaterial] = useState(null);

    const [page, setPage] = useState(0);

    const [pageSize, setPageSize] = useState(8);

    const [totalPages, setTotalPages] = useState(0);

    const loadMaterials = async () => {

        try {

            const response =
                await materialApi.getAllMaterials({
                    page,
                    size: pageSize,
                });

            const data = response.data.data;

            setPageData(
                data
            );

            setMaterials(
                data.content
            );

            setTotalPages(data.totalPages);

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        loadMaterials();

    }, [page, pageSize]);

    const filteredMaterials = materials.filter((material) => {

        const keyword = search.toLowerCase();

        return (

            material.name.toLowerCase().includes(keyword) ||

            material.code.toLowerCase().includes(keyword) ||

            material.unit.toLowerCase().includes(keyword) ||

            material.supplierName.toLowerCase().includes(keyword)

        );

    });

    return (

        <div>

            <PageHeader

                title="Nguyên vật liệu"

                description="Quản lý nguyên vật liệu."

                actionLabel="Thêm nguyên vật liệu"

                actionIcon={
                    <Plus size={18}/>
                }

                onAction={() => {

                    setSelectedMaterial(null);

                    setShowForm(true);

                }}

            />

            <TableToolbar

                search={search}

                setSearch={setSearch}

            />

            <MaterialTable

                materials={filteredMaterials}

                onEdit={(material) => {

                    setSelectedMaterial(material);

                    setShowForm(true);

                }}

                onRefresh={loadMaterials}

            />

            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />

            {

                showForm &&

                <Modal

                    title={
                        selectedMaterial
                            ? "Chỉnh sửa nguyên vật liệu"
                            : "Thêm nguyên vật liệu"
                    }

                    onClose={() =>
                        setShowForm(false)
                    }

                >

                    <MaterialForm

                        material={selectedMaterial}

                        onCancel={() =>
                            setShowForm(false)
                        }

                        onSuccess={() => {

                            setShowForm(false);

                            loadMaterials();

                        }}

                    />

                </Modal>

            }

        </div>

    );

}

export default MaterialPage;
