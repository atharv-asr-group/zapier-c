import { ReactNode } from "react"

export const PrimaryButton=({children, onClick, size="small"}:{
    children:ReactNode,
    onClick:()=>void,
    size?:"big"|"small"
})=>{
    return <div className={`${size==="small"?"text-sm":"text-xl"}
    ${size==="small"?"px-8 pt-2":"px-10 py-3"} bg-amber-700 
    cursor-pointer text-white rounded-full hover:shadow-md`}>
        {children}
    </div>
}