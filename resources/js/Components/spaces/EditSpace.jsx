import ReactDom from "react-dom";

export default function EditWorkspace( { open, onClose, children} ) {
    

    return ReactDom.createPortal(
        <div 
            onClick={onClose} 
            className={`fixed inset-0 flex justify-center items-center bg-black/20 transition-colors ${open ? "visible" : "invisible"}`}

        >
            
            {/* Modal page */}
            <div 
                onClick={(e) => e.stopPropagation()}
                className={`
                bg-white rounded-xl shadow p-6 transition-all w-[600px] min-h-[350px]
                ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
                `}>
                {children}  

            </div>
            
        </div>,
        document.getElementById("modal-root")
    );
}