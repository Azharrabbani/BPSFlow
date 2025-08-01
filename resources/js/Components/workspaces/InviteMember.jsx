export default function InviteMember( { open, onClose, children } ) {

    return (
        <div 
            onClick={onClose} 
            className={`
                fixed inset-0 flex z-50 justify-center items-center transition-colors ${open ? "visible bg-black/20" : "invisible"}
            `}>
            
            {/* Modal page */}
            <div 
                onClick={(e) => e.stopPropagation()}
                className={`
                bg-white rounded-xl shadow p-6 transition-all w-[600px] h-[400px]
                ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
                `}>
                {children}  

            </div>
            
        </div>
    )
}