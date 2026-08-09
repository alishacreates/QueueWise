# QueueWise — Adaptive Fairness-Based Service Request Prioritization System

## 1. Project Overview

**QueueWise** is a web-based service request prioritization system built using **Next.js, TypeScript, React, and CSS**.

The purpose of QueueWise is to improve how service requests are ordered in a queue. Instead of using only a simple **First-Come-First-Served (FCFS)** approach or ranking requests only by urgency, QueueWise considers multiple factors before deciding which request should be handled first.

The system evaluates every request using:

- Urgency
- Waiting time
- Dependency impact
- Number of previous deferrals

It then calculates a final priority score and automatically ranks all requests.

A key feature of QueueWise is its **anti-starvation fairness mechanism**. If a request is repeatedly deferred, its fairness score gradually increases so that it does not remain at the bottom of the queue forever.

---

## 2. Problem Statement

Traditional queues often rely on one of two approaches:

1. **First-Come-First-Served** — requests are handled only according to arrival order.
2. **Urgency-Based Priority** — requests with the highest urgency are always handled first.

Both approaches can create problems.

For example, an urgent request should normally receive priority, but a less urgent request may remain pending for a very long time if new urgent requests continuously arrive.

QueueWise addresses this by combining urgency with waiting duration, dependency impact, and fairness.

The objective is to create a queue that is:

- Priority-aware
- Fair
- Explainable
- Deterministic
- Resistant to request starvation

---

## 3. Technology Stack

QueueWise is implemented using:

- **Next.js**
- **React**
- **TypeScript**
- **CSS**
- React Hooks such as `useState` and `useMemo`

The current version does not require:

- A database
- External APIs
- Authentication
- Third-party AI services

This keeps the application lightweight and focused on the prioritization algorithm.

---

## 4. QueueWise Priority Model

QueueWise uses the following priority model:

```text
Priority Score = U + W + D + F
```

where:

```text
U = Urgency contribution
W = Waiting-time contribution
D = Dependency contribution
F = Fairness contribution
```

### 4.1 Urgency Contribution

Urgency is entered on a scale of **1 to 5**.

```text
Urgency Score = Urgency × 4
```

Maximum contribution:

```text
5 × 4 = 20
```

---

### 4.2 Waiting-Time Contribution

The longer a request has been waiting, the more priority it receives.

```text
Waiting Score = min(Days Waiting × 2, 15)
```

The contribution is capped at **15 points** so that waiting time does not completely dominate the queue.

---

### 4.3 Dependency Contribution

Some requests may affect other users, tasks, services, or activities.

```text
Dependency Score = min(Number of Dependencies × 3, 15)
```

The dependency score is capped at **15 points**.

---

### 4.4 Fairness Contribution

The fairness component is the main anti-starvation mechanism in QueueWise.

```text
Fairness Score = min(Times Deferred × 4, 20)
```

Every time a request is deferred, its fairness contribution increases by **4 points**.

The maximum fairness contribution is **20 points**.

The cap is intentional. Without a cap, a repeatedly deferred request could eventually gain an excessively large score and permanently dominate the queue.

---

## 5. Complete Priority Formula

The implementation in QueueWise is:

```ts
function calculateScore(item: RequestItem): ScoreBreakdown {
  const urgencyScore = item.urgency * 4;
  const waitingScore = Math.min(item.daysWaiting * 2, 15);
  const dependencyScore = Math.min(item.dependencies * 3, 15);
  const fairnessScore = Math.min(item.timesDeferred * 4, 20);

  return {
    urgencyScore,
    waitingScore,
    dependencyScore,
    fairnessScore,
    total:
      urgencyScore +
      waitingScore +
      dependencyScore +
      fairnessScore,
  };
}
```

This makes the scoring process transparent because every contribution can be displayed separately.

---

## 6. Priority Categories

After calculating the score, QueueWise assigns a readable priority level.

```text
Score >= 35       Critical
Score 25–34       High
Score 15–24       Medium
Score below 15    Low
```

The code used is:

```ts
function priorityLabel(score: number) {
  if (score >= 35) return 'Critical';
  if (score >= 25) return 'High';
  if (score >= 15) return 'Medium';

  return 'Low';
}
```

---

## 7. Deterministic Tie-Breaking

Two requests can occasionally receive the same final priority score.

Instead of allowing their order to depend on an arbitrary sort result, QueueWise uses a deterministic tie-breaking sequence.

When two requests have equal scores, QueueWise compares them in this order:

1. **Longer waiting time**
2. **Higher urgency**
3. **Greater dependency impact**
4. **Older request**

The ranking logic is:

```ts
.sort((a, b) => {
  if (b.score.total !== a.score.total) {
    return b.score.total - a.score.total;
  }

  if (b.item.daysWaiting !== a.item.daysWaiting) {
    return b.item.daysWaiting - a.item.daysWaiting;
  }

  if (b.item.urgency !== a.item.urgency) {
    return b.item.urgency - a.item.urgency;
  }

  if (b.item.dependencies !== a.item.dependencies) {
    return b.item.dependencies - a.item.dependencies;
  }

  return a.item.id - b.item.id;
});
```

This ensures that the queue produces a predictable and explainable result.

---

## 8. Anti-Starvation Defer Mechanism

A major feature added to QueueWise is the interactive **Defer** action.

When the user clicks **Defer** on a request:

```text
timesDeferred = timesDeferred + 1
```

The fairness contribution is recalculated immediately.

The implementation is:

```ts
function deferRequest(id: number) {
  setRequests((previous) =>
    previous.map((item) =>
      item.id === id
        ? {
            ...item,
            timesDeferred: item.timesDeferred + 1,
          }
        : item
    )
  );

  setSelectedId(id);
}
```

Because the ranked queue is calculated from the latest request data, React automatically recalculates and redisplays the ranking after a defer action.

### Example

Suppose a request starts with:

```text
Fairness = +4
Total Score = 25
```

After one defer:

```text
Fairness = +8
Total Score = 29
```

After another defer:

```text
Fairness = +12
Total Score = 33
```

After another:

```text
Fairness = +16
Total Score = 37
Priority = Critical
```

Eventually the fairness score reaches its cap:

```text
Fairness = +20
```

Further deferrals do not increase the fairness component.

---

## 9. Explainable Ranking

QueueWise does not only display the final score.

When a request is selected, the interface shows a full score breakdown:

```text
Urgency contribution
Waiting-time contribution
Dependency contribution
Fairness contribution
Final priority score
```

This makes the ranking explainable to the user.

Instead of only saying:

```text
Request A has score 32
```

QueueWise can show exactly where the score came from.

This makes the algorithm easier to understand, evaluate, and demonstrate.

---

## 10. Live Queue Re-Ranking

The ranked queue is calculated using React's `useMemo`.

```ts
const ranked = useMemo(() => {
  return [...requests]
    .map((item) => ({
      item,
      score: calculateScore(item),
    }))
    .sort(/* QueueWise ranking rules */);
}, [requests]);
```

Whenever the `requests` state changes, the priority scores and ranking are calculated again.

This occurs when:

- A new request is added
- A request is deferred

As a result, the table always represents the current QueueWise ranking.

---

## 11. Request Input

A request contains the following information:

```ts
type RequestItem = {
  id: number;
  title: string;
  description: string;
  urgency: number;
  daysWaiting: number;
  dependencies: number;
  timesDeferred: number;
};
```

Each field has a specific purpose in the ranking system.

| Field | Purpose |
|---|---|
| `id` | Unique identifier and final age-based tie-breaker |
| `title` | Name of the service request |
| `description` | Description of the issue |
| `urgency` | Immediate importance on a 1–5 scale |
| `daysWaiting` | Number of days the request has remained pending |
| `dependencies` | Number of other tasks/services affected |
| `timesDeferred` | Number of times the request has been postponed |

---

## 12. Dashboard Statistics

The application also calculates basic queue statistics:

- Total number of requests
- Number of Critical requests
- Number of requests waiting more than three days
- Number of requests receiving a fairness boost

These values are recalculated automatically from the current request list.

---

## 13. What Was Added and Improved During Development

The project was developed as a compact prioritization application and then improved with several important algorithmic changes.

### Initial Functionality

The initial QueueWise version already supported:

- Adding service requests
- Entering urgency
- Entering waiting duration
- Entering dependencies
- Entering previous deferrals
- Calculating a weighted priority score
- Automatically sorting requests
- Showing priority categories
- Showing an explanation of score contributions

### Improvement 1 — Deterministic Tie Resolution

The original sorting approach primarily ranked requests according to their total score.

A more complete tie-resolution policy was added:

```text
Score
↓
Waiting time
↓
Urgency
↓
Dependencies
↓
Request age
```

This ensures equal-score requests are handled consistently.

### Improvement 2 — Interactive Defer Action

Previously, the number of deferrals could be entered manually.

A **Defer** button was added directly to each queue item.

Clicking this button:

1. Increments the request's defer count
2. Increases its fairness contribution
3. Recalculates its total priority
4. Re-ranks the entire queue

This turns the fairness mechanism into an observable dynamic feature.

### Improvement 3 — Anti-Starvation Behaviour

The fairness component was explicitly designed as an anti-starvation mechanism.

Repeatedly ignored requests gradually gain priority, but the contribution remains capped to prevent fairness from overpowering all other criteria.

### Improvement 4 — Explainable Priority System

The interface was structured so users can inspect the individual contribution of every scoring factor.

This makes the ranking transparent rather than functioning as a hidden or unexplained score.

### Improvement 5 — Algorithm Versioning

The interface identifies the current model as:

```text
QW-1.1
```

This provides a simple way to identify and document the current version of the QueueWise ranking rules.

---

## 14. QueueWise Workflow

The main system flow is:

```text
User creates service request
        ↓
QueueWise receives request attributes
        ↓
Urgency score calculated
        ↓
Waiting score calculated
        ↓
Dependency score calculated
        ↓
Fairness score calculated
        ↓
Final priority score produced
        ↓
Requests sorted by score
        ↓
Tie-breaking rules applied if required
        ↓
Prioritized queue displayed
        ↓
Request may be deferred
        ↓
Fairness value increases
        ↓
Queue automatically recalculates and re-ranks
```

---

## 15. Main Distinguishing Feature

The key distinguishing feature of QueueWise is the combination of:

- Weighted multi-factor priority scoring
- Capped anti-starvation fairness boosting
- Deterministic tie resolution
- Explainable score decomposition
- Dynamic queue re-ranking after defer actions

A conventional queue may prioritize requests based only on arrival time or urgency.

QueueWise instead attempts to balance:

```text
Immediate importance
        +
Time already spent waiting
        +
Impact on dependent work
        +
Fairness toward repeatedly deferred requests
```

---

## 16. Example Scenario

Consider two requests:

### Request A

```text
Urgency = 5
Waiting = 1 day
Dependencies = 3
Deferred = 0
```

Score:

```text
Urgency       = 5 × 4 = 20
Waiting       = 1 × 2 = 2
Dependencies  = 3 × 3 = 9
Fairness      = 0 × 4 = 0

Total = 31
```

### Request B

```text
Urgency = 2
Waiting = 6 days
Dependencies = 0
Deferred = 3
```

Score:

```text
Urgency       = 2 × 4 = 8
Waiting       = 6 × 2 = 12
Dependencies  = 0
Fairness      = 3 × 4 = 12

Total = 32
```

Even though Request A has much higher urgency, Request B receives a slightly higher score because it has already waited for a long time and has been repeatedly deferred.

This demonstrates the fairness principle behind QueueWise.

---

## 17. Current Scope

The current version intentionally focuses on the prioritization system itself.

It does not currently include:

- User authentication
- Persistent database storage
- Multi-user accounts
- External integrations
- Cloud synchronization
- AI-generated prioritization

These features are outside the current scope because the purpose of the project is to demonstrate the QueueWise prioritization model clearly and directly.

---

## 18. Possible Future Improvements

Future versions could include:

- Resolve / Complete request actions
- Persistent database storage
- Queue history
- Administrator dashboards
- Different scoring profiles for different service environments
- Custom weight configuration
- Request creation timestamps
- Automatic waiting-time calculation
- Priority-change history
- Analytics showing fairness intervention
- Exportable queue reports

These are potential extensions and are not required for the current QueueWise core algorithm.

---

## 19. Short Project Description

**QueueWise is an adaptive fairness-based service request prioritization system that ranks pending requests using urgency, waiting duration, dependency impact, and a capped fairness contribution for repeated deferrals. The application dynamically recalculates the queue whenever request conditions change and uses deterministic tie-breaking rules to resolve equal scores. Its anti-starvation mechanism helps ensure that repeatedly deferred requests gradually gain priority without allowing fairness to completely dominate urgent work.**

---

## 20. One-Minute Explanation

If asked to explain QueueWise briefly:

> QueueWise is a service request prioritization system. Instead of using only urgency or first-come-first-served ordering, it calculates priority using four factors: urgency, waiting time, dependency impact, and previous deferrals. The deferral factor works as an anti-starvation mechanism, so a request that keeps getting postponed gradually receives a higher score. I also added deterministic tie-breaking, so if two requests have the same score, the system compares waiting time, urgency, dependencies, and finally request age. The interface shows the contribution of every factor, making the ranking transparent and explainable.

---

## 21. Algorithm Summary

```text
QUEUEWISE QW-1.1

Priority =
    urgency × 4
  + min(daysWaiting × 2, 15)
  + min(dependencies × 3, 15)
  + min(timesDeferred × 4, 20)

If scores are equal:

1. Longer waiting time wins
2. Higher urgency wins
3. More dependencies wins
4. Older request wins

On defer:

timesDeferred = timesDeferred + 1

Then:

Recalculate score
→ Re-sort queue
→ Display updated rank
```

---

## 22. Conclusion

QueueWise demonstrates a compact but complete adaptive queue prioritization approach.

The software combines a transparent weighted scoring model with fairness-aware scheduling. Its anti-starvation component increases the priority of repeatedly deferred requests, while caps preserve balance between fairness and urgency.

The addition of deterministic tie-breaking and explainable score breakdowns makes the system predictable and understandable.

The result is a lightweight service request queue that demonstrates how priority, impact, waiting time, and fairness can be combined in a single ranking model.
