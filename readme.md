Table of content:
1. project architecture
2. User interface
3. Setup guide

Project architecture:
The project consists of 4 microservices and a seperate frontend. 
![image](https://github.com/user-attachments/assets/86848e60-0bf6-4967-9f62-b5380048e606)

On the frontend, users can signup on their accounts, they can create their zaps that are then stored in the database by the primary backend.
Some hooks endpoints are exposed for the users using which the users can hit these endpoints which starts to put their actions one by one in the database. 
The processor microservice then pulls these actions from the database and put them on kafka, which are consumed by various workers to perform these actions.


User interface:


Setup guide:
Clone the project using: git clone 
Add .env file to the hooks, primary-backend, worker, processor by following the commands:
1. cd worker->npm install->mkdir .env
2. cd primary-backend->npm install->mkdir .env
3. cd hooks->npm install->mkdir .env
4. cd processor->npm install->mkdir .env
Get a postgresql instance from any free service and get the connection url, you can use neon.tech for the same.
In the .env files, add DATABASE_URL="your_connection_url"
Go to the primary-backend and migrate the database: cd primary-backend -> npx prisma migrate dev
Generate the prisma client in worker, hooks, and processor as well by:
1. cd worker -> npx prisma generate
2. cd hooks -> npx prisma generate
3. cd processor -> npx prisma generate
The processor microservice is taking the actions from DB and producing it to the kafka queue, which means that we have to generate a kafka instance followed by creating a topic:
1. Open Docker desktop application
2. run docker run -p 9092:9092 -d apache/kafka:3.8.0
3. docker exec {container_id of kafka} /bin/bash
4. cd /opt/kafka/bin
5. ./kafka-topics.sh --create --topic zap-events --bootstrap-server localhost:9092          (this will create a topic named zap-events)
6. exit

Now we are ready to start all the microservices and the frontend, write the following steps in different terminal windows:
1. cd primary-backend -> npm run dev
2. cd frontend -> npm run dev
3. cd hooks -> npm run start
4. cd processor -> npm run start
5. cd worker -> npm run start
