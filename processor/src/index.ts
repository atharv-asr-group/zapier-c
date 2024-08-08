import { PrismaClient } from "@prisma/client";
import {Kafka} from 'kafkajs';
const client= new PrismaClient();
const TOPIC_NAME="zap-events";
// init kafka
const kafka = new Kafka({
    clientId: 'outbox-processor',
    brokers: ['localhost:9092']
  })

// the use of the processor is to take out actions from the outbox, 
// put them in kafka,and delete the process from outbox db.
async function main(){
    const producer= kafka.producer();
    await producer.connect();

    while(1){
        const pendingRows= await client.zapRunOutbox.findMany({
            where:{},
            take:10
        })
        // pendingRows look like this
        // [{
        //     id:"1",
        //     zapRunId:"2"
        // },{
        //     id:"2",
        //     zapRunId:"3"
        // }]
        producer.send({
            topic:TOPIC_NAME,
            messages: pendingRows.map(r=>{
                return {
                    value: r.zapRunId
                }
        })
            ,
        })
        await client.zapRunOutbox.deleteMany({
            where:{
                id:{
                    in: pendingRows.map(x=>x.id)
                }
            }
        })
        
    }
}
main();