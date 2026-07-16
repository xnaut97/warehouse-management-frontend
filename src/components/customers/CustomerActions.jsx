import { Edit, Lock, Unlock, Trash2 } from "lucide-react";


function CustomerActions({
                             customer,
                             onEdit,
                             onToggleStatus,
                             onDelete
                         }) {

    return (

        <div className="flex justify-center gap-2">

            <button
                onClick={() => onEdit(customer)}
                className="rounded-xl p-2 text-gray-500 transition hover:bg-pink-50 hover:text-[var(--color-primary)]"
            >
                <Edit size={17}/>
            </button>


            <button
                onClick={() => onToggleStatus(customer)}
                className="rounded-xl p-2 text-gray-500 transition hover:bg-pink-50 hover:text-[var(--color-primary)]"
            >

                {
                    customer.enabled
                        ? <Lock size={17}/>
                        : <Unlock size={17}/>
                }

            </button>


            <button
                onClick={() => onDelete(customer)}
                className="rounded-xl p-2 text-gray-500 transition hover:bg-pink-50 hover:text-[var(--color-primary)]"
            >
                <Trash2 size={17}/>
            </button>

        </div>

    );

}

export default CustomerActions;