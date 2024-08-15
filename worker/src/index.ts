import { PrismaClient } from '@prisma/client';
// infinite loop that that pulls from the queue and process them
import {Kafka} from 'kafkajs';
// const client= new PrismaClient();
const TOPIC_NAME="zap-events";
// init kafka
const kafka = new Kafka({
    clientId: 'outbox-processor',
    brokers: ['localhost:9092']
  })
const prismaClient=new PrismaClient();
async function main(){
    const consumer = kafka.consumer({
        groupId:'main-worker'
    });
    await consumer.connect();

    const producer=kafka.producer();
    await producer.connect();

    await consumer.subscribe({topic:TOPIC_NAME,fromBeginning:true})
    await consumer.run({
        autoCommit:false,
        eachMessage:async({topic,partition,message})=>{
            console.log({
                partition,
                offset: message.offset,
                value:message.value?.toString(),
            })
            if(!message.value?.toString())return;
            
            const parsedValue=JSON.parse(message.value?.toString());
            const zapRunId=parsedValue.zapRunId;
            const stage=parsedValue.stage;
// send query to get back zap id, send query to get back actions associated to this zapId, find available actions

            const zapRunDetails=await prismaClient.zapRun.findFirst({
                where:{
                    id:zapRunId,
                },
                include:{
                    zap:{
                        include: {
                            actions: {
                                include:{
                                    type: true
                                }
                            }
                        }
                    }
                }
            });

            const currentAction=zapRunDetails?.zap.actions.find(x=>x.sortingOrder===stage);
            if(!currentAction){
                console.log("current action not found");
            }
            if(currentAction?.type.id==="email"){
                console.log("sending email")
            }
            if(currentAction?.type.id==="send-sol"){
                console.log("sending sol")
            }

            // mitigate email sending process, we just simply stop the process for 1 second.
            await new Promise(r=>setTimeout(r,500));

            const lastStage=(zapRunDetails?.zap.actions.length||1)-1
            if (lastStage!==stage){
                await producer.send({
                    topic:TOPIC_NAME,
                    messages:[{
                        value: JSON.stringify({
                            stage: stage+1,
                            zapRunId
                        })
                    }]
                })
            }

            console.log('processing done');
            await consumer.commitOffsets([{
                topic:TOPIC_NAME,
                partition:partition,
                offset: (parseInt(message.offset) + 1).toString()
            }])
        }
    })
}
main();