// infinite loop that that pulls from the queue and process them
import {Kafka} from 'kafkajs';
// const client= new PrismaClient();
const TOPIC_NAME="zap-events";
// init kafka
const kafka = new Kafka({
    clientId: 'outbox-processor',
    brokers: ['localhost:9092']
  })

async function main(){
    const consumer = kafka.consumer({
        groupId:'main-worker'
    });
    await consumer.connect();
    await consumer.subscribe({topic:TOPIC_NAME,fromBeginning:true})
    await consumer.run({
        autoCommit:false,
        eachMessage:async({topic,partition,message})=>{
            console.log({
                partition,
                offset: message.offset,
                value:message.value?.toString(),

            })
            // mitigate email sending process, we just simply stop the process for 1 second.
            await new Promise(r=>setTimeout(r,500));
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