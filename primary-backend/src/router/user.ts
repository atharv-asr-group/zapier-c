import {Router} from "express";
import { authMiddleware } from "./middleware";
import { SignupSchema } from "../types";
const router = Router();

router.post("/signup",(req,res)=>{
    // console.log("signup handler");
    const body = req.body.username;
    const parsedData=SignupSchema.safeParse(body);
    if(!parsedData.success){
        return res.status(411).json({
            message:"Incorrect inputs"
        })
    }
    // const userExists
})
router.post("signin",(req,res)=>{
    console.log("signin handler");
})
router.get("/user",authMiddleware,(req,res)=>{
    console.log("signin handler");
})
export const userRouter=router;