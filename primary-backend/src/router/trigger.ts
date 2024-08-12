import {Router} from "express";
import { authMiddleware } from "./middleware";
import { ZapCreateSchema } from "../types";
import { prismaClient } from "../db";
const router = Router();

router.get("/available",(req,res)=>{
    
})

export const triggerRouter=router;