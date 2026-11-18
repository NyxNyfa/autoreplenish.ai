---
name: autoreplenish-prd-architecture
description: >-
  Use this skill when implementing or updating interactive simulators, product copy,
  architecture diagrams, ROI metrics, Telegram Bot HITL flows, or mock data in AutoReplenish.ai
  to ensure strict alignment with PRD.md.
---

# AutoReplenish.ai PRD & Domain Architecture Skill

Use [PRD.md](../../PRD.md) and [src/data/mockPrd.ts](../../src/data/mockPrd.ts) as the single source of truth for domain logic, metrics, and interactive simulations.

## 1. Core System Stack (Single Source of Truth)

Do not introduce alternative cloud providers or frameworks in architecture diagrams, simulators, or copy:
- **Scheduler**: Amazon EventBridge (scheduled stock evaluation trigger)
- **Orchestrator**: AWS Lambda (Python 3.11)
- **Reasoning Engine**: AWS Bedrock — **Claude 3.5 Sonnet** (contextual multi-variable reasoning)
- **State, Cache & Audit Store**: Amazon DynamoDB (weather cache, Telegram session state, full audit trace)
- **Secrets Management**: AWS Secrets Manager
- **System of Record (ERP)**: SAP S/4HANA MM OData API (stock check, lead time, automated Purchase Requisition creation)
- **External Signals**: OpenWeatherMap API + internal promo & holiday calendar
- **Human-in-the-Loop (HITL)**: Telegram Bot interactive approval cards (`Approve`, `Edit Qty`, `Reject`)
- **Control Center**: React.js Dashboard

## 2. Target Business & Product Metrics

- **Stockout Reduction**: `35% – 40%`
- **Spoilage / Expiry Reduction**: `50%` (for perishable SKUs)
- **Working Capital Efficiency**: `20% – 30%`
- **Store Manager Operational Efficiency**: `+60%`
- **Recommendation Latency**: `< 30 seconds` per SKU batch
- **Telegram Approval Rate**: `> 70%`
- **SAP PR Creation Success Rate**: `> 99%`
- **Agent Reasoning Trace Completeness**: `100%`
- **Weather API Cache Hit Ratio**: `> 80%`

## 3. Key Interactive Sections

- [src/components/LiveSimulator.tsx](../../src/components/LiveSimulator.tsx): Multi-variable AI replenishment calculation simulator.
- [src/components/TelegramSimulator.tsx](../../src/components/TelegramSimulator.tsx): Interactive Store Manager (Persona: Budi) approval workflow (`Approve`, `Ubah Jumlah`, `Tolak`) triggering SAP S/4HANA PR creation.
- [src/components/WorkflowSection.tsx](../../src/components/WorkflowSection.tsx) & [src/components/ArchitectureSection.tsx](../../src/components/ArchitectureSection.tsx): End-to-end 9-step AWS + SAP + Telegram pipeline.
- [src/components/RoiMetrics.tsx](../../src/components/RoiMetrics.tsx) & [src/components/ComparisonMatrix.tsx](../../src/components/ComparisonMatrix.tsx): Static Min-Max vs. Contextual Agentic AI comparison.
