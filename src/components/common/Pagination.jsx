import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({
                        page,
                        totalPages,
                        onPageChange
                    }) {

    if (totalPages <= 1) {
        return null;
    }


    const getPages = () => {

        const pages = [];

        const start = Math.max(0, page - 2);

        const end = Math.min(totalPages - 1, page + 2);

        if (start > 0) {

            pages.push(0);

            if (start > 1) {

                pages.push("left");

            }

        }

        for (let i = start; i <= end; i++) {

            pages.push(i);

        }

        if (end < totalPages - 1) {

            if (end < totalPages - 2) {

                pages.push("right");

            }

            pages.push(totalPages - 1);

        }

        return pages;

    };

    const pages = getPages();


    return (

        <div className="mt-8 flex items-center justify-center overflow-x-auto px-1">


            <div className="flex max-w-full flex-wrap items-center justify-center gap-1 rounded-3xl border border-slate-200 bg-white p-1 shadow-sm sm:rounded-full">


                <button
                    disabled={page === 0}
                    onClick={() => onPageChange(page - 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-pink-50
                    disabled:cursor-not-allowed disabled:opacity-40"                >

                    <ChevronLeft size={18}/>

                </button>



                {
                    pages.map((item) => {

                        if (item === "left" || item === "right") {

                            return (

                                <span
                                    key={item + Math.random()}
                                    className="px-2 text-slate-400"
                                >
                    ...
                </span>

                            );

                        }

                        return (

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

                        );

                    })
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
