'use client';
import { BACKEND_URL } from "@/app/config";
import { Appbar } from "@/components/Appbar";
import { LinkButton } from "@/components/buttons/LinkButton";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { Input } from "@/components/Input";
import { ZapCell } from "@/components/ZapCell";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


function useAvailableActionsAndTriggers(){
    const [availableActions,setAvailableActions]=useState([]);
    const [availableTriggers,setAvailableTriggers]=useState([]);

    useEffect(()=>{
        axios.get(`${BACKEND_URL}/api/v1/trigger/available`)
        .then(x=>setAvailableTriggers(x.data.availableTriggers));

        axios.get(`${BACKEND_URL}/api/v1/action/available`)
        .then(x=>setAvailableActions(x.data.availableActions));

    },[])
    return {
        availableActions,
        availableTriggers
    }
}


export default function(){
    const {availableActions, availableTriggers}=useAvailableActionsAndTriggers();
    const [selectedTrigger, setSelectedTrigger]=useState<{
        id:string,
        name:string
    }>();
    const [selectedAction, setSelectedAction]=useState<{
        index:number;
        availableActionId:string;
        availableActionName:string;
        metadata:any;

    }[]>([]);

    const [selectedModalIndex, setSelectedModalIndex]=useState<null|number>(null);
    const router = useRouter();

    return <div>
            <Appbar></Appbar>
            <div className="flex justify-end bg-slate-200 py-8">
                <PrimaryButton onClick={async ()=>{
                    const response = await axios.post(`${BACKEND_URL}/api/v1/zap`,{
                        "availableTriggerId":selectedTrigger?.id,
                        "triggerMetadata":{},
                        "actions":selectedAction.map(a=>({
                            availableActionId:a.availableActionId,
                            actionMetadata:a.metadata,
                        }))
                    },{
                        headers:{
                            Authorization:localStorage.getItem("token")
                        }
                    })
                    router.push("/dashboard");
                }}>Publish</PrimaryButton>
            </div>
            <div className="w-full min-h-screen bg-slate-200 flex flex-col justify-center ">
                <div className="flex justify-center w-full">
                    <ZapCell name={selectedTrigger?.name?selectedTrigger.name:"Trigger"} index={1} onClick={()=>{
                        setSelectedModalIndex(1);
                    }}></ZapCell>
                </div>
                <div className="w-full pt-2 pb-2 ">
                    {selectedAction.map((action,index)=><div className="flex justify-center py-1">
                        <ZapCell name={action.availableActionName? action.availableActionName
                        :"Action"} index={action.index} onClick={()=>{
                            setSelectedModalIndex(action.index);
                        }}></ZapCell>
                    </div>
                )}
                </div>
                <div className="w-4">

                </div>
                <div className="flex justify-center">                
                    <div className="">
                        <PrimaryButton onClick={()=>{
                            setSelectedAction(a=>[...a,{
                                index:a.length+2,
                                availableActionId:"",
                                availableActionName:"",
                                metadata:{}
                            }])
                        }}>
                            <div className="text-2xl">
                                +
                            </div>
                        </PrimaryButton>
                    </div>
                    </div>
            </div>
            {/* this will show modal on screen */}
            {selectedModalIndex && <Modal availableItems={selectedModalIndex===1?availableTriggers:availableActions} index={selectedModalIndex}
             onSelect={(props:null|{name:string; id:string; metadata:any})=>{
                if(props===null){
                    // close the modal
                    setSelectedModalIndex(null);
                    return;
                }
                if(selectedModalIndex===1){
                    // setting the trigger
                    setSelectedTrigger({
                        id:props.id,
                        name:props.name
                    })
                }else{
                    setSelectedAction(a=>{
                        let newActions=[...a];
                        newActions[selectedModalIndex-2]={
                            index:selectedModalIndex,
                            availableActionName:props.name,
                            availableActionId:props.id,
                            metadata:props.metadata
                        }
                        return newActions;
                    })
                }     
                setSelectedModalIndex(null);           
            }} />}
    </div>
}

function Modal({ index, onSelect, availableItems}:{index:number, onSelect:(props:null|{name:string; id:string, metadata:any})=>void,
    availableItems:{
        id: string, name:string, image:string
}[]}){
    const [step,setStep]=useState(0);
    const [selectedAction,setSelectedAction]=useState<{
        id: string;
        name:string;
    }>();
    const isTrigger=index===1;

        
    return <div className="fixed top-0 right-0 left-0 z-50 justify-center flex items-center w-full 
    md:inset-0 h-[calc(100%-1rem)] max-h-full bg-slate-100 bg-opacity-70">
        <div className="relative p-4 w-full max-w-2xl max-h-full">
            
            <div className="relative bg-white rounded-lg shadow ">
               
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
                    <div className="text-xl">
                        Select {index===1?"Trigger":"Action"}
                    </div>
                    <button onClick={()=>{
                        onSelect(null);
                    }} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="default-modal">
                        <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                <div className="p-4 md:p-5 space-y-4">
                {JSON.stringify(selectedAction)}
                {step===1 && selectedAction?.id ==="email" && <EmailSelector setMetadata={(metadata)=>{
                    onSelect({
                        ...selectedAction,
                        metadata
                    })
                }}/>}
                {(step===1 && selectedAction?.id ==="send-sol") && <SolanaSelector setMetadata={(metadata)=>{
                    onSelect({
                        ...selectedAction,
                        metadata
                    })
                }}/>}

                {step===0 && <div>
                    {availableItems.map(({id,name,image})=>{
                        return <div onClick={()=>{
                            if(isTrigger){
                                onSelect({
                                    id,
                                    name,
                                    metadata:{}
                                    
                                })
                            }else{
                                setStep(s => s+1);
                                setSelectedAction({
                                    id,
                                    name
                                })
                            }
                        }} className="flex border py-2 hover:bg-orange-100">
                            <img src={image} width={30}/> 
                            <div className="px-1">
                                {name}
                            </div>
                            
                        </div>
                    })}
                    </div>}

                
                    
                </div>
            </div>
        </div>
    </div>
}


function EmailSelector({setMetadata}:{
    setMetadata:(params:any)=>void
}){
    const [email,setEmail]=useState("");
    const [body, setBody]=useState("");
    return <div>
        <Input type={"text"} placeholder="To" label={"To"} onChange={(e)=>{
            setEmail(e.target.value)
        }}></Input>
        <Input type={"text"} placeholder="Body" label={"Body"} onChange={(e)=>{
            setBody(e.target.value)
        }}></Input>
        <PrimaryButton onClick={()=>{
            setMetadata({
                email,
                body
            })
        }}>Submit</PrimaryButton>

    </div>
}
function SolanaSelector({setMetadata}:{
    setMetadata:(params:any)=>void
}){
    const [amount, setAmount]=useState("");
    const [address, setAddress]=useState("");

    return <div>
        <Input type={"text"} placeholder="To" label={"To"} onChange={(e)=>{
            setAddress(e.target.value)
        }}></Input>
        <Input type={"text"} placeholder="Amount" label={"Amount"} onChange={(e)=>{
            setAmount(e.target.value)
        }}></Input>
        <PrimaryButton onClick={()=>{
            setMetadata({
                amount,
                address
            })
        }}>Submit</PrimaryButton>
    </div>
}