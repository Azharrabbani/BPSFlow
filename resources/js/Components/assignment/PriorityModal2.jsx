export default function PriorityModal2( { open, onClose, children} ) {

    return (
        <div 
            onClick={onClose} 
            className={`
                fixed z-50 top-[-150px] left-[90rem] inset-0 flex justify-center items-center transition-colors ${open ? "visible" : "invisible"}
            `}>
            
            {/* Modal page */}
            <div 
                onClick={(e) => e.stopPropagation()}
                className={`
                bg-white rounded-xl shadow p-6 transition-all w-[230px] min-h-[190px]
                ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
                `}>
                {children}  

            </div>
            
        </div>
    );
}