function InventoryDetailCard({ inventory }) {

    return (

        <div className="rounded-xl border border-pink-100 bg-white p-6 shadow-sm">

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                <div>

                    <p className="text-sm text-slate-500">

                        Kho

                    </p>

                    <p className="mt-1 text-lg font-semibold">

                        {inventory.warehouse}

                    </p>

                </div>

                <div>

                    <p className="text-sm text-slate-500">

                        Mã nguyên vật liệu

                    </p>

                    <p className="mt-1 text-lg font-semibold">

                        {inventory.materialCode}

                    </p>

                </div>

                <div>

                    <p className="text-sm text-slate-500">

                        Tên nguyên vật liệu

                    </p>

                    <p className="mt-1 text-lg font-semibold">

                        {inventory.materialName}

                    </p>

                </div>

                <div>

                    <p className="text-sm text-slate-500">

                        Số lượng tồn

                    </p>

                    <p className="mt-1 text-2xl font-bold text-blue-600">

                        {inventory.quantity}

                    </p>

                </div>

            </div>

        </div>

    );

}

export default InventoryDetailCard;