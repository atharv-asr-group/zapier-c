export const ZapCell=({
    name,
    index
}:{
    name?:string,
    index:number
})=>{
    return <div className="flex justify-center border border-black py-8 px-8 w-[300px]">
        <div className="flex text-xl">
            <div className="font-bold">
                {index}. 
            </div>
            <div>
                {name}
            </div>
        </div>        
    </div>
}