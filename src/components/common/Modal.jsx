function Modal({
                   title,
                   children,
                   onClose
               }) {


    return (

        <div className="
            fixed
            inset-0
            bg-black/40
            flex
            items-center
            justify-center
        ">


            <div className="
                bg-white
                rounded-xl
                shadow-lg
                w-[500px]
                p-6
            ">


                <div className="
                    flex
                    justify-between
                    items-center
                    mb-5
                ">

                    <h2 className="
                        text-xl
                        font-bold
                    ">
                        {title}
                    </h2>


                    <button
                        onClick={onClose}
                        className="
                            text-gray-500
                        "
                    >
                        ✕
                    </button>


                </div>


                {children}


            </div>


        </div>

    )

}


export default Modal;