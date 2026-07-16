import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

import inventoryApi from "../../api/inventoryApi";

import InventoryDetailCard from "../../components/inventory/InventoryDetailCard";

function InventoryDetail() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [inventory, setInventory] = useState(null);

    const [loading, setLoading] = useState(true);

    const loadInventory = async () => {

        try {

            const response = await inventoryApi.getDetail(id);

            setInventory(response.data.data);

        } catch (error) {

            toast.error("Không thể tải thông tin tồn kho.");

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadInventory();

    }, [id]);

    if (loading) {

        return (

            <div className="p-6">

                Đang tải...

            </div>

        );

    }

    if (!inventory) {

        return (

            <div className="p-6">

                Không tìm thấy dữ liệu.

            </div>

        );

    }

    return (

        <div className="space-y-6 p-10">

            <button
                onClick={() => navigate("/inventories")}
                className="flex items-center gap-2 text-slate-600 transition hover:text-blue-600"
            >

                <ArrowLeft size={18} />

                Quay lại

            </button>

            <div>

                <h1 className="text-3xl font-bold text-slate-800">

                    Chi tiết tồn kho

                </h1>

                <p className="mt-1 text-slate-500">

                    Thông tin chi tiết tồn kho của nguyên vật liệu.

                </p>

            </div>

            <InventoryDetailCard inventory={inventory} />

        </div>

    );

}

export default InventoryDetail;