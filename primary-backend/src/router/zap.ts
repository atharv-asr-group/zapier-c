import {Router} from "express";
import { authMiddleware } from "./middleware";
import { ZapCreateSchema } from "../types";
import { prismaClient } from "../db";
const router = Router();

router.post("/",authMiddleware,async (req,res)=>{
    // console.log("create a zap");
    // @ts-ignore
    const id:string =req.id;
    const body = req.body;
    const parsedData=ZapCreateSchema.safeParse(body);

    if(!parsedData.success){
        return res.status(411).json({
            message:"Incorrect inputs"
        })
    }

    // in the transaction we create a zap with correct actions
    // but with empty triggerid, I then make a trigger and 
    // then I update the triggerid in the zap to form a correct zap.
    const zapId= await prismaClient.$transaction(async tx=>{
        const zap= await prismaClient.zap.create({
            data:{
                userId: parseInt(id),
                triggerId:"",
                actions:{
                    create: parsedData.data.actions.map((x,index)=>({
                        actionId: x.availableActionId,
                        sortingOrder: index
                    }))
                }
            }
        })

        const trigger= await tx.trigger.create({
            data:{
                triggerId: parsedData.data.availableTriggerId,
                zapId: zap.id
            }
        });
        await prismaClient.zap.update({
            where:{
                id:zap.id
            },
            data:{
                triggerId:trigger.id
            }
        })
        return zap.id;
    })
    return res.json({
        zapId
    })
})

router.get("/",authMiddleware,async (req,res)=>{
    
    // @ts-ignore
    const id = req.id;
    const zaps = await prismaClient.zap.findMany({
        where:{
            userId:id
        },
        include:{
            actions:{
                include:{
                    type:true
                }
            },
            trigger:{
                include:{
                    type:true,
                }
            }
        }
    })
    // console.log("zaps handler");
    return res.json({
        zaps
    })
})

router.get("/:zapId",authMiddleware,async (req,res)=>{
    // console.log("signin handler");
    // @ts-ignore
    const id = req.id;
    const zapId= req.params.zapId;

    const zap = await prismaClient.zap.findFirst({
        where:{
            id:zapId,
            userId:id,
            
        },
        include:{
            actions:{
                include:{
                    type:true
                }
            },
            trigger:{
                include:{
                    type:true,
                }
            }
        }
    })
    // console.log("zaps handler");
    return res.json({
        zap
    })
})

export const zapRouter=router;