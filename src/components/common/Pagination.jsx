import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({
                        page,
                        totalPages,
                        onPageChange
                    }) {

    if (totalPages <= 1) {
        return null;
    }


    const pages = Array.from(
        { length: totalPages },
        (_, index) => index
    );


    return (

        <div className="mt-8 flex items-center justify-center">


            <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-sm">


                <button
                    disabled={page === 0}
                    onClick={() => onPageChange(page - 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-pink-50
                    disabled:cursor-not-allowed disabled:opacity-40"                >

                    <ChevronLeft size={18}/>

                </button>



                {
                    pages.map((item) => (

                        <button
                            key={item}
                            onClick={() => onPageChange(item)}
                            className={`h-9 min-w-9 rounded-full px-3 text-sm font-medium transition ${
                                page === item
                                    ? "bg-(--color-primary) text-white shadow"
                                    : "text-slate-600 hover:bg-pink-50"
                            }`}
                        >

                            {item + 1}

                        </button>

                    ))
                }



                <button
                    disabled={page === totalPages - 1}
                    onClick={() => onPageChange(page + 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-pink-50
                    disabled:cursor-not-allowed disabled:opacity-40"
                >

                    <ChevronRight size={18}/>

                </button>


            </div>


        </div>

    );

}

export default Pagination;