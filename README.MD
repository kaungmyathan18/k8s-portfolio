# Kubernetes Production Platform

A production-grade Kubernetes platform built from scratch, demonstrating
senior DevOps engineering practices across the full infrastructure lifecycle.

## Architecture

\`\`\`
Developer → GitHub → GitHub Actions (CI) → Docker Image
                                              ↓
                                         ArgoCD (GitOps)
                                              ↓
                              ┌───────────────────────────────┐
                              │     Kubernetes Cluster         │
                              │                               │
                              │  dev namespace  prod namespace │
                              │  ┌──────────┐  ┌──────────┐  │
                              │  │  my-api  │  │  my-api  │  │
                              │  │ (1 pod)  │  │ (3+ pods)│  │
                              │  └──────────┘  └──────────┘  │
                              │                               │
                              │  NetworkPolicies (Calico)     │
                              │  HPA (autoscaling 3-20 pods)  │
                              │  Prometheus + Grafana          │
                              │  SLO alerting                 │
                              └───────────────────────────────┘
                                              ↓
                                     Vault (vault-lab)
                                     S3 Backups (Velero)
\`\`\`

## What's Demonstrated

| Practice | Implementation |
|----------|---------------|
| **GitOps** | ArgoCD — automated sync, self-heal, git revert rollbacks |
| **CI/CD** | GitHub Actions — test → build → Trivy scan → deploy |
| **Secret Management** | HashiCorp Vault — agent sidecar injection, zero K8s secrets |
| **Observability** | Prometheus + Grafana — golden signals, SLO dashboards |
| **Security** | Network Policies — zero-trust pod networking with Calico |
| **Autoscaling** | HPA — CPU-based scaling, proven with k6 load testing |
| **Disaster Recovery** | Velero — S3 backups, tested RTO < 15 minutes |
| **Multi-environment** | Helm — dev/prod values, templated manifests |
| **SRE Practices** | SLOs, error budgets, burn rate alerting |

## Stack

**App:** Node.js · Express · prom-client  
**Container:** Docker (multi-stage, non-root)  
**Orchestration:** Kubernetes · Helm  
**GitOps:** ArgoCD  
**CI/CD:** GitHub Actions · Trivy  
**Observability:** Prometheus · Grafana · kube-prometheus-stack  
**Security:** HashiCorp Vault · Calico CNI · NetworkPolicies  
**Autoscaling:** HPA · Metrics Server  
**Backup:** Velero · AWS S3  

## Key Design Decisions

See [docs/adr/](docs/adr/) for Architecture Decision Records explaining
why each tool was chosen over alternatives.

## Running Locally

**Prerequisites:** minikube, helm, kubectl, docker

\`\`\`bash
# Start cluster with Calico
minikube start --driver=docker --memory=3500 --cpus=4 --cni=calico

# Build app image
eval $(minikube docker-env)
docker build -t my-api:local .

# Deploy dev environment
helm install my-api-dev charts/my-api \
  --values charts/my-api/values.yaml \
  --values charts/my-api/values-dev.yaml \
  --namespace dev --create-namespace

# Access the app
kubectl port-forward -n dev svc/my-api-service 8080:80
curl http://localhost:8080/health
\`\`\`

## Load Testing

\`\`\`bash
# Port forward prod service
kubectl port-forward -n prod svc/my-api-service 8080:80

# Run k6 load test
k6 run load-test.js
\`\`\`

## Blog Posts

Technical writeups for each component:

- [CI/CD Pipeline with Kubernetes](docs/blog/devops-day3-blog-post.md)
- [Observability with Prometheus & Grafana](docs/blog/devops-day4-blog-post.md)
- [GitOps with ArgoCD](docs/blog/devops-day5-blog-post.md)
- [Helm Multi-Environment Packaging](docs/blog/devops-day6-blog-post.md)
- [HashiCorp Vault Secret Management](docs/blog/devops-day7-blog-post.md)
- [Zero-Trust Networking with Calico](docs/blog/devops-day8-blog-post.md)
- [HPA Autoscaling with k6](docs/blog/devops-day9-blog-post.md)
- [Disaster Recovery with Velero](docs/blog/devops-day10-blog-post.md)
