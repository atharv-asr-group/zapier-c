import express from 'express';
import { PrismaClient } from '@prisma/client';
const app = express();



const client = new PrismaClient();
app.use(express.json());
// const app = express(;)
app.post("/hooks/catch/:userId/:zapId",async (req,res)=>{
    const userId= req.params.userId;
    const zapId= req.params.zapId;
    // body is to abstract everything into body
    const body= req.body;

    // store in db a new trigger
    await client.$transaction(async tx=>{
        const run = await client.zapRun.create({
            data:{
                zapId:zapId,
                metadata:body
            }
        });
        await client.zapRunOutbox.create({
            data:{
                zapRunId: run.id
            }
        })
    })
    res.json({
        message:"webhook recieved"
    })
    
    // push it onto a queue- kafka or redis.
    
});
app.listen(3000);