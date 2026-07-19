import {
    Lock,
    Unlock,
    Edit
} from "lucide-react";

import { toast } from "react-hot-toast";

import materialApi from "../../api/materialApi.js";

function MaterialActions({

                             material,

                             onEdit,

                             onRefresh

                         }) {

    const handleToggleStatus = async () => {

        const confirmed = window.confirm(

            material.enabled
                ? "Khóa nguyên vật liệu này?"
                : "Mở khóa nguyên vật liệu này?"

        );

        if (!confirmed) {

            return;

        }

        try {

            if (material.enabled) {

                await materialApi.disableMaterial(
                    material.id
                );

                toast.success(
                    "Đã khóa nguyên vật liệu thành công"
                );

            } else {

                await materialApi.enableMaterial(
                    material.id
                );

                toast.success(
                    "Đã mở khóa nguyên vật liệu thành công"
                );

            }

            onRefresh();

        } catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Thao tác thất bại"

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
                onClick={() => onEdit(material)}
                className="rounded-xl p-2 text-gray-500 transition hover:bg-pink-50 hover:text-[var(--color-primary)]"
            >

                <Edit size={18}/>

            </button>

            <button

                onClick={handleToggleStatus}

                className="rounded-xl p-2 text-gray-500 transition hover:bg-pink-50 hover:text-[var(--color-primary)]"

            >

                {

                    material.enabled

                        ? <Lock size={18}/>

                        : <Unlock size={18}/>

                }

            </button>

        </div>

    );

}

export default MaterialActions;
