---
layout: post
long: true
title: Agent Swarm Architecture
excerpt: Multi-agent swarm behavior seems to result in architectural convergence, namely the planner/worker/judge separation. 
date: 2026-01-20 18:10:04
tags:
  - blog
---

I just finished reading [Simon Willison's blog post](https://simonwillison.net/2026/Jan/19/scaling-long-running-autonomous-coding/) about [Wilson Lin's team's work at Cursor](https://cursor.com/blog/scaling-agents). I found myself nodding along as I read it—not just because the work is impressive, but because the architectural conclusions they reached felt remarkably familiar.

---

Eight months ago, I built [MeshSeeks](https://github.com/twalichiewicz/meshseeks), an MCP server designed to coordinate AI coding agents. Reading about Cursor's journey felt like watching someone else get punched in the face by the exact same problems I encountered. Interestingly, we both arrived at nearly identical solutions.

I believe anyone who seriously tackles multi-agent coordination will eventually converge on this specific architecture. The problem space itself seems to have strong opinions on how it wants to be solved.

## The Architecture of Convergence

Wilson Lin describes Cursor’s final system as a recursive machine: planners explore the codebase and create tasks, often spawning sub-planners to handle specific areas in parallel. Workers pick up these tasks with a singular focus on execution, and at the end of each cycle, a judge agent determines whether the work meets the standard.

When I looked at what I had built in MeshSeeks, the reflection was almost perfect.

```
                      COORDINATION LAYER
┌─────────────────────────────────────────────────────────────┐
│                  SwarmOrchestrator                          │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐     │
│  │ SessionMgr  │  │CheckpointMgr│  │ AgentPoolManager │     │
│  │ (week-long) │  │(persistence)│  │ (1-500 agents)   │     │
│  └─────────────┘  └─────────────┘  └──────────────────┘     │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │        HierarchicalPlanner (Recursive)               │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │      JudgeSystem (Automated Verification Loop)       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
                  AGENT EXECUTION LAYER
┌─────────────────────────────────────────────────────────────┐
│             AgentPool (100+ concurrent)                     │
│                                                             │
│  🔍 Analysis    ⚙️ Implement    🧪 Test      📝 Doc         │
│  🐛 Debug       🎯 Judge        📋 Plan                     │
└─────────────────────────────────────────────────────────────┘
```

The parallels were striking. Where Cursor solved planning scale by having planners spawn sub-planners, I had implemented a `HierarchicalPlanner` with a recursive decomposition method. We both solved the "lazy worker" problem by enforcing strict role specialization—separating the "deciding" from the "doing." And perhaps most importantly, we both realized that you can't have a human in the loop for every decision, nor can you trust an agent to grade its own homework. You need a dedicated Judge.

Neither of us planned it this way from the start. We evolved into it because every other option failed.

## The Failures That Teach You

The most valuable part of Cursor’s post was their honest accounting of those failures. Their initial approach gave agents equal status, letting them self-coordinate via a shared file. This is the obvious first attempt, and it is almost always the wrong one.

Cursor found that locking mechanisms became throughput killers, noting that "twenty agents would slow down to the effective throughput of two or three." I hit this exact wall in MeshSeeks. My first iteration had agents coordinating through a shared task queue that quickly became a massive chokepoint. Agents spent more time checking the queue and locking resources than actually working, causing the coordination overhead to scale quadratically.

The fix was to abandon the flat structure entirely in favor of strict hierarchy. In MeshSeeks, the `HierarchicalPlanner` owns the task tree. Workers don't talk to each other; they receive tasks from the planner and report results back. This simple change reduced coordination overhead from O(n^2) to O(n).

```typescript
// From hierarchical-planner.ts
interface HierarchicalTask {
  id: string;
  parentId: string | null;
  depth: number;              // 0 = root, max 5
  children: string[];         // Child task IDs
  status: TaskStatus;
  // Workers don't see other workers' tasks
  // They only see their assignment
}
```

Beyond performance, the flat structure created a fascinating behavioral problem: risk aversion. Cursor noted that without hierarchy, "agents became risk-averse," avoiding difficult tasks to make small, safe changes instead. I saw the same game-theoretic nightmare. When agents are peers, the Nash equilibrium is a swarm of agents effectively bikeshedding on easy tasks while the hard problems rot. Hierarchy solves this by removing the choice. The planner decides what needs to happen, and the worker executes. There is no opportunity for strategic avoidance.

We also both learned that conflict resolution cannot happen in real-time. Cursor tried an "integrator" role to manage conflicts but found it became a bottleneck. I learned the same lesson and built a `JudgeSystem` instead.

In MeshSeeks, the judge acts less like a manager and more like a CI/CD pipeline with an opinion. It runs unit tests, checks linting, and performs a semantic review against the original requirements. If the tests pass but the logic is brittle, the Judge rejects the task with specific rework instructions. The distinction is critical: an integrator sits in the critical path (push-based), while a judge evaluates completed work asynchronously (pull-based).

```typescript
// From judge-system.ts
interface JudgeCriterion {
  type: 'correctness' | 'completeness' | 'quality' | 'testing';
  weight: number;
  enabled: boolean;
  passThreshold: number;
}
```

## Why Recursive Planning Matters

Complex software projects have a fractal structure. A goal like "build a browser" decomposes into subsystems, which decompose into components, which decompose into functions. A single planner trying to enumerate every leaf task upfront will inevitably fail—it will miss details, plan too abstractly, or simply time out.

Recursive planning allows you to parallelize the planning itself. The top-level planner spawns a sub-planner for the CSS subsystem, which spawns a sub-planner for the layout engine, and so on.

```typescript
// Simplified from hierarchical-planner.ts
async decompose(task: HierarchicalTask, context: PlanningContext): Promise<DecompositionResult> {
  if (task.depth >= context.maxDepth) {
    return { tasks: [task], strategy: 'none' };
  }

  // Analyze task complexity
  const analysis = await this.analyzeTask(task);

  if (analysis.shouldDecompose) {
    const subtasks = await this.createSubtasks(task, analysis);

    // Recursive: subtasks may themselves be decomposed
    for (const subtask of subtasks) {
      if (this.shouldSpawnSubPlanner(subtask)) {
        // Sub-planner handles this branch of the tree
        await this.spawnSubPlanner(subtask, context);
      }
    }

    return { tasks: subtasks, strategy: analysis.strategy };
  }

  return { tasks: [task], strategy: 'none' };
}
```

## The Checkpoint Problem

Solving the coordination problem allows the swarm to run effectively, but it exposes a new class of infrastructure challenges. When you run agents for weeks (or even days), you are no longer writing a script; you are building a database. You need crash recovery. In MeshSeeks, the `CheckpointStore` uses atomic writes—writing to a temp file and renaming it—to ensure state is never corrupted, even if the process dies mid-save.

```typescript
// From checkpoint-store.ts
async save(state: SessionState): Promise<string> {
  const checkpointId = `checkpoint-${Date.now()}-${randomBytes(4).toString('hex')}`;
  const tempPath = join(this.checkpointDir, `${checkpointId}.tmp`);
  const finalPath = join(this.checkpointDir, `${checkpointId}.json`);

  // Write to temp file first
  await fs.writeFile(tempPath, JSON.stringify(state), 'utf-8');

  // Atomic rename - the database durability pattern
  await fs.rename(tempPath, finalPath);

  return checkpointId;
}
```

## Insights I Missed

While our architectures converged, Cursor’s team had insights I missed, particularly regarding model selection. They found that different models excel at different roles—for example, GPT-5.2 is better for planning, while other models might be better suited for raw coding. I had built MeshSeeks to be model-agnostic, but I hadn't optimized the model-to-role fit. This is a clear area for improvement.

They also reinforced that prompts matter more than architecture. I spent more time tuning system prompts than writing coordination logic. If you get the prompt wrong, the agent ignores your fancy architecture and reverts to its base training.

## The Sweet Spot

If you are coordinating more than a handful of agents on a complex project, the problem forces you into a specific shape. You need hierarchical planning to handle the scope, role separation to keep agents focused, and an asynchronous judge to ensure quality. You need checkpoints because systems crash. And you need to eliminate peer-to-peer coordination because it doesn't scale.

It’s not about being clever. It’s about survival. Flat structures don't scale, unguided agents are lazy, and synchronous integration is a bottleneck. Cursor’s post is validating because it suggests this architecture is robust enough for arbitrarily complex projects.

The question is no longer "Can we coordinate hundreds of agents?" but "How do we standardize the protocol between them?" If we can agree on the interface for a Planner, Worker, and Judge, we might finally move beyond building swarms and start building the operating system that runs them.

---

*MeshSeeks is open source at [github.com/twalichiewicz/meshseeks](https://github.com/twalichiewicz/meshseeks).*
