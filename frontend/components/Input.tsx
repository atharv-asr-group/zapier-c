'use client';
export const Input = ({label, placeholder, onChange,type="text"}:{
    label:string,
    placeholder:string,
    onChange:(e:any)=>void,
    type?:"text"|"password"
})=>{
    return <div>
        <div className="text-md pb-2 pt-2">
        <label >* {label}</label>
        </div>
        <input type={type} className="border border-black rounded px-4 py-2 w-full" 
        onChange={onChange} />
    </div>
}