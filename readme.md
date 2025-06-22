# Zapier-C Master Project

This project is a microservices-based architecture that allows users to create and manage workflows (zaps). It consists of four microservices and a separate frontend built with Next.js. The project integrates with Kafka for message queuing and PostgreSQL for database management.

---

## **Table of Contents**
1. [Project Architecture](#project-architecture)
2. [Details](#details)
3. [Setup Guide](#setup-guide)
4. [Running the Project](#running-the-project)
5. [Deployment](#deployment)
6. [Learn More](#learn-more)

---

## **Project Architecture**

The project consists of the following components:

![image](https://github.com/user-attachments/assets/86848e60-0bf6-4967-9f62-b5380048e606)

- **Frontend**: A Next.js application where users can sign up, create workflows (zaps), and manage them.
- **Primary Backend**: Handles user authentication and stores workflows in the database.
- **Hooks Microservice**: Exposes endpoints for triggering workflows and storing actions in the database.
- **Processor Microservice**: Pulls actions from the database and pushes them to Kafka.
- **Worker Microservice**: Consumes actions from Kafka and performs the required tasks.

### Workflow Overview:

1. Users create workflows on the frontend.
2. Workflows are stored in the database by the primary backend.
3. Hooks endpoints allow users to trigger workflows, storing actions in the database.
4. The processor microservice pushes actions to Kafka.
5. Workers consume actions from Kafka and execute them.

---

## **Details**

### Landing Page
![Landing Page](https://github.com/user-attachments/assets/be05a22a-60ee-4ccc-af87-fd654be7043c)

### Workflow Creation
![Workflow Creation](https://github.com/user-attachments/assets/4df869c6-e799-42f3-b553-27bc3888ce55)

### Dashboard
![Dashboard](https://github.com/user-attachments/assets/1c494694-c63a-4206-b437-0eec2e1f24b9)

### Kafka Integration
The processor microservice pushes actions to Kafka, and workers consume these actions to perform tasks.

---

## **Setup Guide**

### Prerequisites
- Node.js installed
- Docker installed
- PostgreSQL instance (e.g., from [neon.tech](https://neon.tech))

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/atharv-asr-group/zapier-c.git
   cd zapier-c
   ```

2. Install dependencies and create `.env` files:
   ```bash
   cd primary-backend
   npm install
   mkdir .env
   ```

   Repeat the above steps for `hooks`, `processor`, and `worker`.

3. Add the following to each `.env` file:
   ```
   DATABASE_URL="your_connection_url"
   ```

4. Migrate the database:
   ```bash
   cd primary-backend
   npx prisma migrate dev
   ```

5. Generate Prisma clients:
   ```bash
   cd worker
   npx prisma generate

   cd hooks
   npx prisma generate

   cd processor
   npx prisma generate
   ```

6. Set up Kafka:
   ```bash
   docker run -p 9092:9092 -d apache/kafka:3.7.1
   ```

7. Create a Kafka topic:
   ```bash
   docker exec {container_id_of_kafka} /bin/bash
   cd /opt/kafka/bin
   ./kafka-topics.sh --create --topic zap-events --bootstrap-server localhost:9092
   exit
   ```

---

## **Running the Project**

Start each service in a separate terminal window:

1. **Primary Backend**:
   ```bash
   cd primary-backend
   npm run dev
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Hooks Microservice**:
   ```bash
   cd hooks
   npm run start
   ```

4. **Processor Microservice**:
   ```bash
   cd processor
   npm run start
   ```

5. **Worker Microservice**:
   ```bash
   cd worker
   npm run start
   ```

Access the frontend at [http://localhost:3000](http://localhost:3000).

---

## **Deployment**

### Frontend
The easiest way to deploy the frontend is via [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

### Backend and Microservices
Deploy the backend and microservices on a cloud provider or container orchestration platform like Kubernetes or Docker Swarm.

---

## **Learn More**

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [Kafka Documentation](https://kafka.apache.org/documentation/) - Learn about Kafka.
- [Prisma Documentation](https://www.prisma.io/docs/) - Learn about Prisma.

---
