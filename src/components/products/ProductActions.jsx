import {
    Edit,
    Pencil,
    Trash2
} from "lucide-react";

import toast from "react-hot-toast";

import productApi from "../../api/productApi.js";

function ProductActions({

                              product,

                              onEdit,

                              onRefresh

                          }) {

    const handleDelete = async () => {

        const confirmed = window.confirm(
            `Xóa sản phẩm "${product.name}"?`
        );

        if (!confirmed) {

            return;

        }

        try {

            await productApi.deleteProduct(
                product.id
            );

            toast.success(
                "Đã xóa sản phẩm thành công"
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

        <div className="
            flex
            items-center
            justify-center
            gap-2
        ">

            <button

                onClick={() => onEdit(product)}
                className="rounded-xl p-2 text-gray-500 transition hover:bg-pink-50 hover:text-[var(--color-primary)]"
            >

                <Edit size={18}/>

            </button>

            <button

                onClick={handleDelete}
                className="rounded-xl p-2 text-gray-500 transition hover:bg-pink-50 hover:text-[var(--color-primary)]"
            >

                <Trash2 size={18}/>

            </button>

        </div>

    );

}

export default ProductActions;
