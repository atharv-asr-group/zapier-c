import {Router} from "express";
import { authMiddleware } from "./middleware";
import { ZapCreateSchema } from "../types";
import { prismaClient } from "../db";
const router = Router();

router.get("/available",async (req,res)=>{
    const availableActions=await prismaClient.availableAction.findMany({});
    res.json({
        availableActions
    })
})

export const actionRouter=router;