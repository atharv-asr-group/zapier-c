'use client';
import { Appbar } from "@/components/Appbar";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { CheckFeature } from "@/components/CheckFeature";
import { Input } from "@/components/Input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BACKEND_URL } from "../config";
import axios from "axios";

export default function(){
    const router= useRouter();

    const [email,setEmail]=useState("");
    const [password, setPassword]=useState("");

    return <div>
        <Appbar></Appbar>
        <div className="flex justify-center">
            <div className="flex pt-8 max-w-4xl">
                <div className="flex-1 pt-20 px-4">
                    <div className="font-semibold text-3xl pb-8">
                        Join millions worldwide who automate their work using Zapier.
                    </div>
                    <CheckFeature label={"Easy setup, no coding required"}></CheckFeature>
                    <CheckFeature label={"Free forever for core features"}></CheckFeature>
 
                    <CheckFeature label={"14-day trial of premium features & apps"}></CheckFeature>
                </div>
                <div className="flex-1 pt-6 mt-12 pb-6 border px-4" >
                    
                    
                    <Input label={"Email"} type="text" placeholder="Your Email" onChange={e=>{
                        setEmail(e.target.value);
                    }}></Input>
                    <Input label={"Password"} type="password" placeholder="Password" onChange={e=>{
                        setPassword(e.target.value);
                    }}></Input>
                <div className="py-2"></div>
                <PrimaryButton size="big" onClick={async ()=>{
                    const res= await axios.post(`${BACKEND_URL}/api/v1/user/signup`,{
                        username:email,
                        password,
                    });
                    localStorage.setItem("token",res.data.token);
                    router.push("/dashboard");
                }}>
                    Get Started free
                </PrimaryButton>
                </div>
                
            </div>
        </div>
    </div>
}