import {Router} from "express";
import { authMiddleware } from "./middleware";
import { ZapCreateSchema } from "../types";
import { prismaClient } from "../db";
const router = Router();

// /api/v1/trigger/available

router.get("/available",async (req,res)=>{
    const availableTriggers=await prismaClient.availableTrigger.findMany({});
    res.json({
        availableTriggers
    })
})

export const triggerRouter=router;