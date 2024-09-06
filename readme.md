# Video For Architecture Explaination and Demo:
[![Video Title](https://img.youtube.com/vi/ya45LzEkH4k/0.jpg)](https://youtu.be/ya45LzEkH4k)

https://www.youtube.com/watch?v=ya45LzEkH4k

(Recommendation: watch the video at 1.5x for better experience)



## **Table of content:**
1. project architecture
2. Details
3. Setup guide

## **Project architecture:**

The project consists of 4 *microservices* and a seperate frontend. 

![image](https://github.com/user-attachments/assets/86848e60-0bf6-4967-9f62-b5380048e606)

On the frontend, users can signup on their accounts, they can create their zaps that are then stored in the database by the primary backend.
Some hooks endpoints are exposed for the users using which the users can hit these endpoints which starts to put their actions one by one in the database. 
The processor microservice then pulls these actions from the database and put them on *kafka*, which are consumed by various workers to perform these actions.


**Details:**

Landing page

![image](https://github.com/user-attachments/assets/be05a22a-60ee-4ccc-af87-fd654be7043c)

Click on Signup and create an account

![image](https://github.com/user-attachments/assets/31dd9538-78c6-42cc-a4c3-398917b7fe3f)

Once you login, you will come to the home page where you can see and create new zap workflows, Click on create

![image](https://github.com/user-attachments/assets/4df869c6-e799-42f3-b553-27bc3888ce55)

Select the actions you want to be performed

![image](https://github.com/user-attachments/assets/cbe5f6be-fe11-4969-ad71-b04d2efa4a66)

Once you have created your workflow click on publish

![image](https://github.com/user-attachments/assets/1c494694-c63a-4206-b437-0eec2e1f24b9)

You will see your updated dashboard, with the given webhook urls.

![image](https://github.com/user-attachments/assets/b00d39a4-0f7b-41fa-a35a-9d3710c0f416)


We can now hit this webhook url via *postman* or other services (along with valid body) to trigger our workflows and they will start to perform the actions one by one.

![image](https://github.com/user-attachments/assets/f021a55e-a134-4075-8eb7-ed60082eff00)

Our worker consumes the actions from *kafka* which is also logged on the terminal.

![image](https://github.com/user-attachments/assets/9c6c7fb0-70c6-4922-85a2-a30111fcca96)



**Setup guide:**
Clone the project using: git clone https://github.com/atharv-asr-group/zapier-c.git

Add .env file to the hooks, primary-backend, worker, processor by following the commands:
1. cd worker->npm install->mkdir .env
2. cd primary-backend->npm install->mkdir .env
3. cd hooks->npm install->mkdir .env
4. cd processor->npm install->mkdir .env

Get a postgresql instance from any free service and get the connection url, you can use neon.tech for the same.
In the .env files, add DATABASE_URL="your_connection_url"

Go to the primary-backend and migrate the database: cd primary-backend -> npx prisma migrate dev

Generate the *prisma client* in worker, hooks, and processor by the following steps:
1. cd worker -> npx prisma generate
2. cd hooks -> npx prisma generate
3. cd processor -> npx prisma generate

The processor microservice is taking the actions from DB and producing it to the kafka queue, which means that we have to generate a ***kafka*** instance followed by creating a topic:
1. Open Docker desktop application
2. ***run docker run -p 9092:9092 -d apache/kafka:3.7.1***
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
