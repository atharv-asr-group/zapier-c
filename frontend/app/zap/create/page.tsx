'use client';
import { Appbar } from "@/components/Appbar";
import { LinkButton } from "@/components/buttons/LinkButton";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { ZapCell } from "@/components/ZapCell";
import { useState } from "react";

export default function(){
    const [selectedTrigger, setSelectedTrigger]=useState<{
        id:string,
        name:string
    }>();
    const [selectedAction, setSelectedAction]=useState<{
        index:number;
        availableActionId:string,
        availableActionName:string
    }[]>([]);

    const [selectedModalIndex, setSelectedModalIndex]=useState<null|number>(null);


    return <div>
            <Appbar></Appbar>
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
                                availableActionName:""
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
            {selectedModalIndex && <Modal index={selectedModalIndex} onSelect={(props:null|{name:string; id:string})=>{
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
                            availableActionId:props.id
                        }
                        return newActions;
                    })
                }

                
            }}/>}
    </div>
}

function Modal({ index, onSelect}:{index:number, onSelect:(props:null|{name:string; id:string})=>void}){
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
                    fijeif
                </div>
            </div>
        </div>
    </div>
}