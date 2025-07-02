import { useEffect, useState } from "react"

export default function  ProgressBar({value, className = '', assignments, completedAss}) {
    const [percent, setPercent] = useState(value);

    useEffect(() => {
        if (percent < value) {
            setTimeout(() => setPercent(newVal => newVal + 1), 200);
            return () => clearTimeout(timeout); 
        }
    }, [percent]);

    return(
        <div className={`h-3 w-full border border-solid border-blue-500 bg-stone-50 rounded-lg ${className}`}>
            <div className={`h-full transition ease-in-out bg-blue-500`} style={{ width: `${percent}%` }}>

            </div>
            <p className="text-center text-sm pt-2"><b>progress: {completedAss} / {assignments}</b></p>
        </div>
    )
}