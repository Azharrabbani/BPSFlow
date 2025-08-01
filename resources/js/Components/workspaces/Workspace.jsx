export default function Workspace( { open,  onClose, children} ) {
    return (

        <div
            onClick={onClose} 
            className={`absolute top-[100px]  z-50 ${open ? 'visible inset-0 flex justify-center scale-100 opacity-100' : 'invisible scale-125 opacity-0'} transition-all`}
        >
            <div 
                onClick={(e) => e.stopPropagation()}
                className={`
                    absolute w-full min-h-[580px] bg-white rounded-lg left-2
                    `}
            >
                {children}

            </div>
        </div>
    );
} 