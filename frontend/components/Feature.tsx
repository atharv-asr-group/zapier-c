export const Feature = ({title, subtitle}:{
    title:string,
    subtitle:string
})=>{
    return <div className="flex pl-4 pt-4">
        <Check/>
        <div className="pl-1 flex flex-col justify-center">
            <div className="flex">
                <div className=" font-bold text-sm">
                    {title}
                </div>
                <div className="pl-1 text-sm">
                    {subtitle}
                </div>
            </div>
        </div>
        

    </div>
}
// Heroicons is good site for icons.
function Check(){
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-4">
    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
  
}