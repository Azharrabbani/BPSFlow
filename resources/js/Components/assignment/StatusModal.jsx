export default function StatusModal( { open, onClose, children} ) {

    return (
        <div 
            onClick={onClose} 
            className={`
                absolute top-[200px] lg:left-[600px] z-50 inset-0 flex justify-center items-center transition-colors ${open ? "visible" : "invisible"}
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