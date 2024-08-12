import { ReactNode } from "react"

export const PrimaryButton=({children, onClick, size="small"}:{
    children:ReactNode,
    onClick:()=>void,
    size?:"big"|"small"
})=>{
    return <div onClick={onClick} className={`${size==="small"?"text-sm":"text-xl"}
    ${size==="small"?"px-8 py-2":"px-10 py-3"} bg-amber-700 
    cursor-pointer text-white rounded-full hover:shadow-md text-center flex justify-center flex-col`}>
        {children}
    </div>
}