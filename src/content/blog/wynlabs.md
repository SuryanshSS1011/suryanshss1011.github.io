---
title: "Wynlabs: an industrial copilot for the plant floor"
description: "Founding-engineer notes from a year of shipping multi-agent AI workflows over live SCADA, PLC, MQTT, and SQL Server data."
date: 2026-05-20T12:00:00
tags: ["Engineering", "AI Systems", "Industrial"]
---

## What Wynlabs is

Wynlabs is a cross-institutional AI software platform that builds an industrial copilot for manufacturing. Multi-agent workflows run over live plant-floor data and produce KPI predictions, time-series analytics, and Grafana reports. I was founding engineer from January 2025 to March 2026.

## The shape of the work

A few things I've learned shipping AI workflows on real plant data that you don't learn from RAG demos.

**The data isn't text.** It's SCADA telemetry, PLC tag dumps, MQTT streams, SQL Server tables. The "knowledge graph" abstraction the agents reason over is built from those sources, not from documents. Per-deployment graphs run 2k to 5k nodes and get rebuilt nightly. LangChain orchestrates the agents on top.

**The KPI question is the deployment.** Customers don't pay for chat. They pay for a forecast of throughput, defect rate, downtime, or energy use, tied to the actual sensors on a specific line. Every POC is a per-deployment data integration job before it's an AI job. I've scoped, built, and deployed 15+ of those in the past year, often embedded with the customer's manufacturing team on a tight timeline.

**Provisioning is half the system.** Workflows ship as Dockerized pipelines on AWS and Kubernetes. I built a FastAPI service and a provisioning CLI so a new deployment is a config + a CLI call, not a bespoke YAML edit. Grafana reports generate via API-triggered workflows that drop straight into the customer's dashboard.

**Frontend deserves to be a package.** Across multiple client apps we kept rebuilding the same UI components. I maintain a shared frontend NPM package so the look and behavior stay consistent. It's not the fun part of the job. It's the part that saves the most engineering time over twelve months.

## Stack

Python, FastAPI, LangChain, Docker, Kubernetes, AWS, Grafana, SCADA/PLC/MQTT integrations, SQL Server, TypeScript.

## Why it's not public

Source code is private (commercial product). What's public is the result on the plant floor.

## Links

- [wynlabs.ai](https://wynlabs.ai)
