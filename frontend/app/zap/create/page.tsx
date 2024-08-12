'use client';
import { Appbar } from "@/components/Appbar";
import { LinkButton } from "@/components/buttons/LinkButton";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { ZapCell } from "@/components/ZapCell";
import { useState } from "react";

export default function(){
    const [selectedTrigger, setSelectedTrigger]=useState("");
    const [selectedAction, setSelectedAction]=useState<{
        availableActionId:string,
        availableActionName:string
    }[]>([]);

    return <div>
            <Appbar></Appbar>
            <div className="w-full min-h-screen bg-slate-200 flex flex-col justify-center ">
                <div className="flex justify-center w-full">
                    <ZapCell name={selectedTrigger?selectedTrigger:"Trigger"} index={1}></ZapCell>
                </div>
                <div className="w-full pt-2 pb-2 ">
                    {selectedAction.map((action,index)=><div className="flex justify-center py-1">
                        <ZapCell name={action.availableActionName? action.availableActionName
                        :"Action"} index={2+index}></ZapCell>
                    </div>
                )}
                </div>
                <div className="w-4">

                </div>
                <div className="flex justify-center">                
                    <div className="">
                        <PrimaryButton onClick={()=>{
                            setSelectedAction(a=>[...a,{
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
    </div>
}