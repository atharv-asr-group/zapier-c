import { ReactNode } from "react"

export const SecondaryButton=({children, onClick, size="small"}:{
    children:ReactNode,
    onClick:()=>void,
    size?:"big"|"small"
})=>{
    return <div className={`${size==="small"?"text-sm":"text-xl"}
    ${size==="small"?"px-8 pt-2":"px-10 py-3"}  
    cursor-pointer text-black rounded-full border hover:shadow-md border-black`}>
        {children}
    </div>
}