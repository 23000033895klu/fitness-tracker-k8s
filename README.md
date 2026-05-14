# Kubernetes-Deployed Full-Stack Fitness Tracker on AWS

![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=flat&logo=kubernetes&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![Ansible](https://img.shields.io/badge/Ansible-EE0000?style=flat&logo=ansible&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-232F3E?style=flat&logo=amazon-aws&logoColor=white)

A containerized full-stack fitness tracking app deployed on AWS EC2 using Kubernetes for orchestration, Ansible for provisioning, and CloudWatch for observability.

## Architecture

```
User → LoadBalancer (K8s)
           ↓
    ┌──────────────────────────────────┐
    │        Kubernetes Cluster         │
    │  ┌─────────────┐  ┌───────────┐ │
    │  │ React (x2)  │  │ Node (x2) │ │
    │  └─────────────┘  └─────┬─────┘ │
    │                         │        │
    │               ┌─────────▼──────┐ │
    │               │  MongoDB (SS)  │ │
    │               └────────────────┘ │
    └──────────────────────────────────┘
              ↓
       AWS CloudWatch (Metrics, Logs, Alerts)
```

## Quick Start

### 1. Provision servers with Ansible
```bash
cd ansible
ansible-playbook -i inventory/hosts.yml playbook.yml --private-key ~/.ssh/your-key.pem
```

### 2. Build and push Docker images
```bash
# Backend
docker build -t YOUR_ECR/fitness-backend:latest ./backend
docker push YOUR_ECR/fitness-backend:latest

# Frontend
docker build --build-arg REACT_APP_API_URL=http://YOUR_BACKEND_URL \
  -t YOUR_ECR/fitness-frontend:latest ./frontend
docker push YOUR_ECR/fitness-frontend:latest
```

### 3. Deploy to Kubernetes
```bash
# Update image names in k8s/deployment.yaml, then:
kubectl apply -f k8s/deployment.yaml

# Check rollout
kubectl rollout status deployment/backend  -n fitness-app
kubectl rollout status deployment/frontend -n fitness-app
```

### 4. Set GitHub Secrets
| Secret | Description |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key |
| `ECR_REGISTRY` | ECR registry URL |
| `K8S_MASTER_HOST` | K8s master EC2 IP |
| `EC2_SSH_KEY` | EC2 SSH private key |
| `API_URL` | Backend public URL |

Push to `main` to trigger the full pipeline.

## Project Structure
```
.
├── backend/                  # Node.js + Express + MongoDB
│   ├── src/server.js
│   ├── package.json
│   └── Dockerfile
├── frontend/                 # React.js
│   ├── src/App.jsx
│   └── Dockerfile
├── k8s/                      # Kubernetes manifests
│   └── deployment.yaml       # Deployments, Services, HPA
├── ansible/                  # Server provisioning
│   └── playbook.yml
├── monitoring/               # CloudWatch config
│   ├── cloudwatch-agent-config.json
│   └── cloudwatch-alarms.tf
└── .github/workflows/        # CI/CD pipeline
    └── deploy.yml
```

## Tech Stack
Kubernetes · Docker · Ansible · AWS EC2 · AWS S3 · AWS CloudWatch · React.js · Node.js · MongoDB · GitHub Actions
"# fitness-tracker-k8s" 
