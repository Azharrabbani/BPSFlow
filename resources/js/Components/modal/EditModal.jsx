export default function EditModal({ open, onClose, children }) {
    return (
         <div
            onClick={onClose}
            className={`fixed z-50 inset-0 flex cursor-default justify-center items-center transition-colors ${open ? "visible" : "invisible"}`}
        >

            <div 
                className={`
                bg-white absolute left-[280px] top-[300px] rounded-xl shadow p-6 transition-all w-[300px] min-h-[120px]
                ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
                `}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>

        </div>
    )
}