# My Fullstack App

Welcome to the **My Fullstack App** repository. This project is a modern, containerized full-stack web application featuring a robust, scalable, and secure deployment architecture hosted on Amazon Web Services (AWS). 

The application utilizes a React frontend and a Spring Boot API backend, orchestrated via Kubernetes and fully automated with a Jenkins CI/CD pipeline.


## Technology Stack

*   **Frontend:** React (JavaScript/TypeScript)
*   **Backend:** Spring Boot (Java)
*   **Database:** MySql (Amazon RDS)
*   **Containerization:** Docker (OCI Images)
*   **Orchestration:** Kubernetes (Amazon EKS)
*   **CI/CD:** Jenkins
*   **Cloud Infrastructure:** AWS (VPC, ALB, NAT Gateway, ECR, EC2, RDS)

## System Architecture

The application infrastructure is designed with a strong emphasis on security, high availability, and separation of concerns. 

### 1. Network & Infrastructure Architecture 


The system is deployed within a custom **AWS VPC (10.0.0.0/16)** partitioned into public and private subnets to secure backend resources.

*   **Public Subnet (10.0.1.0/24):** 
    *   **AWS ALB (Application Load Balancer):** Acts as the public entry point, accepting internet traffic via HTTPS (Port 443) and routing it securely to the private worker nodes.
    *   **NAT Gateway:** Provides secure, outbound-only internet access (Egress) for resources in the private subnet.
*   **Private Subnet (10.0.2.0/24):** 
    *   **EKS EC2 Worker Nodes:** Hosts the React UI and Spring Boot API containers, isolated from direct internet access.
    *   **Amazon RDS PostgreSQL:** Serves as the primary relational database, communicating with the Spring Boot API over SQL (Port 5432).
    *   **Jenkins EC2:** A dedicated build server for continuous integration and delivery.

### 2. Container Lifecycle & Deployment 
*(Reference: `image_8ef8e6.png`)*

The deployment lifecycle is highly automated, leveraging Docker and Kubernetes to ensure consistent environments from development to production.

*   **CI/CD Pipeline (Jenkins):** Running on an EC2 instance in the private subnet, the Jenkins server utilizes a Docker Daemon to compile source code and build OCI (Docker) images. 
*   **Image Registry (Amazon ECR):** Built images are pushed to the Amazon Elastic Container Registry (ECR) for secure storage and versioning.
*   **Kubernetes Orchestration (EKS):** 
    *   The AWS Managed EKS Control Plane handles scheduling and cluster state.
    *   On the EC2 Worker Nodes, the **Kubelet** agent commands the Container Runtime (containerd/Docker) to pull the latest images from ECR.
*   **Pod Isolation Layer:** The application runs in isolated Kubernetes Pods:
    *   **Spring Boot Pod:** Exposes the backend API on Port 8080.
    *   **React Web Pod:** Exposes the frontend interface on Ports 80/443.

