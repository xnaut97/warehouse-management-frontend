import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

import bomApi from "../api/bomApi.js";

import PageHeader from "../components/common/PageHeader.jsx";
import TableToolbar from "../components/common/TableToolbar.jsx";
import Loading from "../components/common/Loading.jsx";
import Modal from "../components/common/Modal.jsx";
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";
import EmptyState from "../components/common/EmptyState.jsx";

import MaterialBOMTable from "../components/material-bom/MaterialBOMTable.jsx";
import MaterialBOMDetail from "../components/material-bom/MaterialBOMDetail.jsx";
import MaterialBOMForm from "../components/material-bom/MaterialBOMForm.jsx";

import { unwrapData } from "../utils/apiResponse.js";

function MaterialBOMPage() {

    const [boms, setBoms] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    const [failed, setFailed] = useState(false);

    const [selectedBom, setSelectedBom] = useState(null);

    const [showDetail, setShowDetail] = useState(false);

    const [showForm, setShowForm] = useState(false);

    const [pendingStatus, setPendingStatus] = useState(null);

    const loadBoms = () => {

        const keyword = search.trim();

        const request = keyword
            ? bomApi.search(keyword)
            : bomApi.getAll();

        return request

            .then((response) => {

                setBoms(unwrapData(response) ?? []);

                setFailed(false);

            })

            .catch((error) => {

                toast.error(
                    error.response?.data?.message ||
                    "Không thể tải danh sách định mức nguyên vật liệu"
                );

                setBoms([]);

                setFailed(true);

            })

            .finally(() => {

                setLoading(false);

            });

    };

    useEffect(() => {

        const timer = setTimeout(loadBoms, 300);

        return () => clearTimeout(timer);

    }, [search]);

    const refreshSelected = async (id) => {

        try {

            const response = await bomApi.getById(id);

            setSelectedBom(unwrapData(response));

        } catch {

            setSelectedBom(null);

            setShowDetail(false);

        }

    };

    const handleSelect = (bom) => {

        setSelectedBom(bom);

        setShowDetail(true);

    };

    const handleToggleStatus = async () => {

        const bom = pendingStatus;

        setPendingStatus(null);

        try {

            if (bom.enabled) {

                await bomApi.disable(bom.id);

                toast.success("Đã ngừng áp dụng định mức");

            } else {

                await bomApi.enable(bom.id);

                toast.success("Đã áp dụng lại định mức");

            }

            await loadBoms();

            await refreshSelected(bom.id);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Thao tác thất bại"
            );

        }

    };

    return (

        <div>

            <PageHeader
                title="Định mức nguyên vật liệu"
                description="Quản lý định mức tiêu hao nguyên vật liệu (BOM) theo từng sản phẩm."
                actionLabel="Thêm BOM"
                actionIcon={<Plus size={18} />}
                onAction={() => {
                    setSelectedBom(null);
                    setShowForm(true);
                }}
            />

            <TableToolbar
                search={search}
                setSearch={setSearch}
            />

            {loading ? (

                <Loading rows={6} />

            ) : failed ? (

                <EmptyState
                    title="Không tải được dữ liệu"
                    description="Vui lòng thử lại hoặc kiểm tra kết nối tới hệ thống."
                />

            ) : (

                <MaterialBOMTable
                    boms={boms}
                    onSelect={handleSelect}
                />

            )}

            {showDetail && selectedBom && (

                <Modal
                    title={`Định mức ${selectedBom.code}`}
                    size="lg"
                    onClose={() => {
                        setShowDetail(false);
                        setSelectedBom(null);
                    }}
                >

                    <MaterialBOMDetail
                        bom={selectedBom}
                        onEdit={() => {
                            setShowDetail(false);
                            setShowForm(true);
                        }}
                        onToggleStatus={() => setPendingStatus(selectedBom)}
                    />

                </Modal>

            )}

            {showForm && (

                <Modal
                    title={selectedBom ? "Cập nhật định mức" : "Thêm định mức"}
                    size="lg"
                    onClose={() => {
                        setShowForm(false);
                        setSelectedBom(null);
                    }}
                >

                    <MaterialBOMForm
                        bom={selectedBom}
                        onSuccess={async () => {
                            setShowForm(false);
                            setSelectedBom(null);
                            await loadBoms();
                        }}
                        onCancel={() => {
                            setShowForm(false);
                            setSelectedBom(null);
                        }}
                    />

                </Modal>

            )}

            {pendingStatus && (

                <ConfirmDialog
                    title={
                        pendingStatus.enabled
                            ? "Ngừng áp dụng định mức"
                            : "Áp dụng lại định mức"
                    }
                    message={
                        pendingStatus.enabled
                            ? `Ngừng áp dụng định mức ${pendingStatus.code}?`
                            : `Áp dụng lại định mức ${pendingStatus.code}?`
                    }
                    confirmText={
                        pendingStatus.enabled
                            ? "Ngừng áp dụng"
                            : "Áp dụng lại"
                    }
                    danger={pendingStatus.enabled}
                    onConfirm={handleToggleStatus}
                    onCancel={() => setPendingStatus(null)}
                />

            )}

        </div>

    );

}

export default MaterialBOMPage;
