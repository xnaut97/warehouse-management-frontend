import {
    Edit,
    Pencil,
    Trash2
} from "lucide-react";

import { toast } from "react-hot-toast";

import supplierApi from "../../api/supplierApi.js";

function SupplierActions({

                             supplier,

                             onEdit,

                             onRefresh

                         }) {

    const handleDelete = async () => {

        const confirmed = window.confirm(
            "Xóa nhà cung cấp này?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await supplierApi.deleteSupplier(
                supplier.id
            );

            toast.success(
                "Đã xóa nhà cung cấp thành công"
            );

            onRefresh();

        } catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Xóa thất bại"

            );

        }

    };

    return (

        <div className="flex items-center justify-center gap-3">

            <button

                onClick={() => onEdit(supplier)}
                className="rounded-xl p-2 text-gray-500 transition hover:bg-pink-50 hover:text-[var(--color-primary)]"
                title="Chỉnh sửa"

            >

                <Edit size={18} />

            </button>

            <button

                onClick={handleDelete}
                className="rounded-xl p-2 text-gray-500 transition hover:bg-pink-50 hover:text-[var(--color-primary)]"
                title="Xóa"
            >

                <Trash2 size={18} />

            </button>

        </div>

    );

}

export default SupplierActions;
