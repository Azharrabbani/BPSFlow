import { createContext, useState } from "react"

export const toggleContext = createContext();

export default function TogglePage({ children }) {
    const [toggle, setToggle] = useState(null);

    return (
        <toggleContext.Provider value={{toggle, setToggle}}>
            {children}
        </toggleContext.Provider>
    )
}