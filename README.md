# Full-Stack API Rate Limit Visualizer & Load Tester

[![Backend - FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![Frontend - Vite / React](https://img.shields.io/badge/Frontend-Vite%20%2F%20React-646CFF.svg)](https://vitejs.dev/)
[![Container - Docker Compose](https://img.shields.io/badge/Container-Docker%20Compose-2496ED.svg)](https://www.docker.com/)

An enterprise-grade, full-stack API load tester and real-time rate-limiting visualizer reference layout. The tool allows developers and DevOps engineers to orchestrate concurrent request spikes against target API endpoints, analyze threshold degradation boundaries, and visualize rate-limiting policies (such as Token Bucket, Leaky Bucket, or Fixed Window algorithms) live through an interactive dashboard.

By pairing a non-blocking asynchronous Python worker architecture with a highly reactive UI, the application isolates load generation from web metrics streaming, allowing you to accurately capture status distributions, latency heatmaps, and throttling limits without bottlenecking the diagnostic node.

---

## 🏗️ System Architecture & Modularity

The workspace is split into two cleanly decoupled services, managed holistically via Docker configurations:

### 1. Asynchronous Backend (`/backend`)
Built using an optimized async framework (FastAPI) paired with decoupled task distribution tracking:
* **`main.py`:** Main API application server exposing control routes for load-testing triggers, configuration management, and streaming metrics.
* **`tasks.py`:** Houses asynchronous background execution tasks tasked with firing high-volume, concurrent request threads against target URLs.
* **`schemas.py` & `config.py`:** Enforces strict Pydantic data schemas for incoming payload data and maps systemic parameters cleanly.
* **`Dockerfile`:** Containerizes the backend layer to match absolute environment execution parameters downstream.

### 2. Live Dashboard Frontend (`/frontend`)
A highly responsive client dashboard built using Vite:
* **`src/`:** Contains core components managing data stream parsing, responsive request configurations, quick-test endpoint shortcuts, and modular metric graphs.
* **`vite.config.js` & `package.json`:** Leverages ultra-fast HMR tools ensuring optimal bundle footprints and rapid communication channels.

---

## 📁 Repository Blueprint

As captured in `image_a716f0.png`, `image_a7174b.png`, and `image_a717ab.png`:

```text
.
├── backend/                  # Asynchronous Python execution layer
│   ├── Dockerfile            # Container definition for backend service
│   ├── config.py             # Systemic environment settings
│   ├── main.py               # FastAPI orchestrator server
│   ├── requirements.txt      # Python dependencies
│   ├── schemas.py            # Pydantic data schemas
│   └── tasks.py              # Background execution task queue
├── frontend/                 # Reactive visualization client
│   ├── src/                  # Components, charts, and API connection logic
│   ├── index.html            # Single-page template root
│   ├── package.json          # Node scripts and UI dependencies
│   └── vite.config.js        # Vite compilation tool configuration
└── docker-compose.yml        # Unified multi-container deployment manifest



##🛠️ Key Technical Features
Real-time Rate Limit Demarcation: Instantly map out when target nodes respond with 429 Too Many Requests statuses, and visualize token exhaustion profiles live.

Decoupled Stress Generation: Offloads load loops to an auxiliary background task infrastructure (tasks.py), preventing concurrent network worker requests from locking up UI rendering.

Dynamic Target Injection: Native quick-test shortcut selectors coupled with variable input parameters allow testers to sweep target URLs across adjustable request thresholds dynamically.

Unified Environment Orchestration: A standardized docker-compose.yml configuration enables entire network, caching, database, and backend systems to spawn reliably inside a single environment shell.

🚀 Getting Started & Local Setup
The entire architecture is designed to initialize simultaneously via a unified multi-container system container manager.

Prerequisites
Make sure you have Docker and Docker Compose installed locally.

Unified Deployment (The Production Way)
Simply run this single command in the repository root directory to pull base images, build your Python environments, bundle your Vite compilation components, and fire up the system:

docker-compose up --build


The FastAPI Backend Swagger Portal will mount at: http://localhost:8000/docs

The Vite Live Visualization Dashboard will sit ready at: http://localhost:8080 (or the mapped forwarding port defined in your compose script).

⚖️ License
Distributed under the MIT License. See LICENSE for more details.
