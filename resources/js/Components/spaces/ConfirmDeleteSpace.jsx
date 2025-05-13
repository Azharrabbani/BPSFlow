import ReactDom from "react-dom";

export default function ConfirmDeleteSpace( { open, onClose, children} ) {

    return (
        <div 
            onClick={onClose} 
            className={`
                fixed z-50 inset-0 flex justify-center items-center transition-colors ${open ? "visible bg-black/20" : "invisible"}
            `}>
            
            {/* Modal page */}
            <div 
                onClick={(e) => e.stopPropagation()}
                className={`
                bg-white absolute top-10 rounded-xl shadow p-6 transition-all w-[550px] min-h-[350px]
                ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
                `}>
                {children}  

            </div>
            
        </div>
    );
}