# QueueWise

QueueWise is an adaptive fairness-based service request prioritization system built with Next.js and TypeScript.

## Core idea
Instead of ranking requests by urgency alone, QueueWise calculates a transparent score from four components:

- Urgency: urgency x 4
- Waiting time: min(days waiting x 2, 15)
- Dependency impact: min(dependencies x 3, 15)
- Fairness boost: min(times deferred x 4, 20)

The fairness boost is designed to reduce starvation: repeatedly deferred requests gradually gain priority.

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Copyright-oriented description
QueueWise is a web-based service request prioritization system that ranks requests through a deterministic weighted model combining urgency, waiting duration, dependency impact and a bounded fairness boost for repeatedly deferred requests. The interface also explains each ranking by exposing the score contribution of every factor.
