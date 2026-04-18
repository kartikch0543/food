# Food Delivery Web Application

This project is a comprehensive food delivery web application built with the MERN stack (MongoDB, Express, React, Node.js). 

## Deployment & Infrastructure

Developed and deployed the web application using Docker and Amazon Web Services (AWS) EC2 with an automated CI/CD pipeline. Integrated the project with GitHub Actions so that every code push automatically builds a Docker image and deploys the updated application to the server.

This project helped in understanding how real-world applications are deployed with automation, reducing manual work and ensuring faster updates.

## Tech Stack

*   **CI/CD:** GitHub Actions
*   **Containerization:** Docker
*   **Cloud:** Amazon EC2 (Amazon Web Services)
*   **Backend:** Node.js / Express
*   **Frontend:** React.js
*   **Registry:** Docker Hub

## CI/CD Pipeline details
The pipeline is located in `.github/workflows/ci-cd.yml`. It handles:
1. Docker build and push to Docker Hub for frontend and backend.
2. SSH into AWS EC2 and automated deployment via Docker Compose.
