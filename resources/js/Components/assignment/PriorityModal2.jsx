export default function PriorityModal2( { open, onClose, children} ) {

    return (
        <div 
            onClick={onClose} 
            className={`
                absolute top-[200px] lg:left-[900px] z-50  inset-0 flex justify-center items-center transition-colors ${open ? "visible" : "invisible"}
            `}>
            
            {/* Modal page */}
            <div 
                onClick={(e) => e.stopPropagation()}
                className={`
                bg-white rounded-xl shadow p-6 transition-all w-[300px] min-h-[150px]
                ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
                `}>
                {children}  

            </div>
            
        </div>
    );
}