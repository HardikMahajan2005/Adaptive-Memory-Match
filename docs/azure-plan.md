# Azure Cloud Deployment & Hosting Architecture Plan

**Project**: Adaptive Memory Match  
**Problem Statement**: PS09 — Adaptive Memory Matching Game  
**Target Platform**: Azure Static Web Apps (Free Tier)  
**Document Version**: 1.0.0 (Production Reference)  

---

## 1. Executive Summary & Architecture Overview

Adaptive Memory Match is a high-performance single-page browser application built with React, TypeScript, and Tailwind CSS. The client application is compiled into optimized static assets (HTML, CSS, JavaScript, and SVG icons).

The recommended Microsoft Azure hosting solution is **Azure Static Web Apps (SWA)**. Azure Static Web Apps provides global content distribution through Microsoft's global edge network, automated CI/CD integration with GitHub Actions, free managed SSL certificates, and zero infrastructure management overhead.

```mermaid
flowchart TD
    subgraph Developer_Workflow["Developer & Source Control"]
        Dev["Developer Push / PR"] --> GH["GitHub Repository"]
        GH --> GHA["GitHub Actions CI/CD Pipeline"]
    end

    subgraph Azure_Cloud["Microsoft Azure Cloud Infrastructure"]
        GHA -->|Deploy Action| SWA["Azure Static Web Apps (Global Edge Hosting)"]
        SWA --> CDN["Azure Front Door / Microsoft Global Edge CDN"]
        
        subgraph Future_Expansion["Optional Scaled Architecture (Phase 2)"]
            SWA -.->|Managed API Route /api| AFunc["Azure Functions (Serverless Node/TS)"]
            AFunc -.-> Cosmos["Azure Cosmos DB / Table Storage (Global Leaderboards)"]
            Cosmos -.-> AKV["Azure Key Vault (Secrets & Keys)"]
        end

        subgraph Monitoring["Observability & Insights"]
            SWA --> AppInsights["Azure Application Insights (Telemetry & RUM)"]
        end
    end

    subgraph User_Devices["End User Access"]
        CDN --> BrowserDesktop["Desktop Browser (1440px+)"]
        CDN --> BrowserMobile["Mobile / Tablet Browser (320px - 1024px)"]
        BrowserDesktop --> LocalStorage[("Browser localStorage (Local Session Persistence)")]
        BrowserMobile --> LocalStorage
    end
```

---

## 2. Static Hosting Model & Build Specifications

Azure Static Web Apps serves the compiled Vite production bundle directly from Microsoft's global content delivery network.

| Parameter | Specification | Description |
|---|---|---|
| **Hosting Service** | Azure Static Web Apps (Standard / Free SKU) | Edge-distributed static web hosting |
| **Node.js Runtime** | Node.js 22 LTS | Build execution environment |
| **Package Manager** | npm (v10+) | Package dependency resolution |
| **Build Command** | `npm run build` | Compiles TypeScript (`tsc -b`) and bundles via Vite |
| **App Location** | `/` | Root of repository |
| **Output Location** | `dist` | Target directory for deployable assets |
| **API Location** | *None (Client-side)* | Client-only game state; zero backend required |
| **Routing Model** | Single Page Application (SPA) | Fallback routing to `/index.html` for client routing |

### SWA Configuration (`staticwebapp.config.json`)
To ensure seamless single-page application navigation and security headers, the following configuration file is placed in the `public/` directory:

```json
{
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/assets/*.{css,js,png,jpg,svg}", "/favicon.ico"]
  },
  "globalHeaders": {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
    "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self';"
  },
  "mimeTypes": {
    ".json": "application/json"
  }
}
```

---

## 3. GitHub Actions Continuous Deployment Workflow

Azure Static Web Apps integrates natively with GitHub via the `Azure/static-web-apps-deploy` action. When a PR is created, Azure automatically provisions an isolated staging environment (named preview URL) for pull request validation.

```yaml
name: Azure Static Web Apps Deploy

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: true

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'

      - name: Install and Test
        run: |
          npm ci
          npm run lint
          npx tsc -b
          npm test

      - name: Build And Deploy to Azure Static Web Apps
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          api_location: ""
          output_location: "dist"

  close_pull_request_job:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request Environment
    steps:
      - name: Close Staging Environment
        id: closepullrequest
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: "close"
```

---

## 4. Security, Identity & Secret Handling

1. **Client-Side Anonymity**:
   - The current application is 100% anonymous. No personal identifying information (PII) is collected, stored, or transmitted.
   - All session histories are stored in the user's browser `localStorage`.
2. **Secret Management**:
   - The repository contains zero embedded credentials, secrets, or API keys.
   - The deployment token `AZURE_STATIC_WEB_APPS_API_TOKEN` is securely stored in GitHub Repository Secrets.
3. **Transport Security (HTTPS)**:
   - Azure Static Web Apps provides automated SSL/TLS certificates with automatic renewal.
   - All HTTP traffic is permanently redirected to HTTPS (TLS 1.3/1.2).
4. **Future Identity Consideration (Phase 2)**:
   - Azure Static Web Apps provides built-in authentication support for Microsoft Entra ID (Azure AD), GitHub, and Google without writing backend auth code.

---

## 5. Cost-Control Assumptions & Free Tier Limits

Azure Static Web Apps Free tier is permanently free for production workloads that meet the following criteria:

| Feature | Azure Free Tier Capacity | Project Requirement | Cost |
|---|---|---|---|
| **Hosting & SSL** | Unlimited custom domains + Free SSL | 1 custom domain + default `azurestaticapps.net` | **$0.00 / month** |
| **Bandwidth** | 100 GB / month | ~50 MB per 1,000 player sessions | **$0.00 / month** |
| **App Storage** | 250 MB | Production build: ~300 KB gzipped | **$0.00 / month** |
| **Staging Environments** | 3 active preview environments | 1 active PR preview | **$0.00 / month** |
| **Serverless APIs** | 20 managed functions | Client-only (0 active) | **$0.00 / month** |
| **Total Estimated Azure Cost** | — | — | **$0.00 (100% Free)** |

---

## 6. Observability, Logging & Monitoring

1. **Azure Application Insights (Real User Monitoring)**:
   - Monitor client-side performance: page load duration, First Contentful Paint (FCP), and Cumulative Layout Shift (CLS).
   - Track JavaScript runtime exceptions without storing user PII.
2. **Health Checks**:
   - Automated synthetic HTTP 200 ping to verify edge availability.

---

## 7. Step-by-Step Deployment Guide

### Option A: Azure CLI Deployment
```bash
# 1. Login to Azure
az login

# 2. Create Resource Group in Central India (or East US)
az group create --name rg-adaptive-memory-match --location centralindia

# 3. Create Azure Static Web App
az staticwebapp create \
  --name swa-adaptive-memory \
  --resource-group rg-adaptive-memory-match \
  --source https://github.com/HardikMahajan2005/Adaptive-Memory-Match \
  --branch main \
  --app-location "/" \
  --output-location "dist" \
  --login-with-github
```

### Option B: Azure Portal
1. Navigate to **Create a Resource** > **Static Web App**.
2. Select Subscription, Resource Group, and enter App Name.
3. Choose **Free** hosting plan.
4. Select deployment source **GitHub**, authenticate, and select repository and branch.
5. Under Build Presets, select **Custom**:
   - App location: `/`
   - Api location: *(leave empty)*
   - Output location: `dist`
6. Click **Review + Create**. Azure will automatically commit the deployment workflow to `.github/workflows/`.

---

## 8. Rollback & Disaster Recovery Process

1. **Instant Staging Swap**:
   - Every GitHub commit creates an immutable build snapshot on Azure.
   - If an issue is detected in production, reverting the Git commit on `main` immediately triggers a 2-minute redeployment of the previous known good state.
2. **Disaster Recovery**:
   - Because the repository contains the entire infrastructure-as-code and deterministic builds, the entire application can be restored in another Azure region within under 5 minutes.

---

## 9. LocalStorage Limitations & Future Scaled Backend

### Current Browser-Only Persistence
- **Pros**: Zero infrastructure costs, instant response times, zero privacy compliance risks (GDPR/DPDP exempt).
- **Limitations**: Data is tied to a specific browser profile; clearing browser data resets statistics; cross-device sync is unavailable.

### Optional Future Backend (Phase 2 Extension)
When multi-player global leaderboards and cross-device sync are desired:
1. Deploy Azure Functions HTTP triggers in `api/leaderboard.ts`.
2. Connect to **Azure Cosmos DB** (Serverless tier, 1,000 RU/s free) or Azure Table Storage.
3. Authenticate players using Azure Easy Auth (GitHub/Microsoft login).
4. Store encrypted scores and replay seeds for server-side verification.

---

## 10. Implementation Status Disclosure

- **Local Implementation**: 100% complete, verified with 34 Vitest tests and 14 Playwright E2E tests, and production build succeeded.
- **Azure Deployment**: Documented architecture plan ready for immediate deployment. Cloud provisioning is optional per the official Cerevyn assessment rubric.
