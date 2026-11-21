# Module 0: React & TypeScript Refresher (The Video Perspective)

Welcome to Module 0! Because you come from a **Python** background and your end goal is understanding **Remotion** (so you can review and prompt AI agents for video production), we won't teach generic web React. 

Instead, this guide focuses entirely on:
1. **Translating Python idioms to TypeScript equivalents.**
2. **Understanding JSX as a programmatic visual tree.**
3. **The strict functional discipline required for frame-by-frame rendering.**

---

## 1. Python to TypeScript: Mental Mapping

As a Python developer, you already understand types, data structures, and functional patterns. Here is how TypeScript maps to what you already know:

| Python Concept | TypeScript Equivalent | Notes & Video Relevance |
| :--- | :--- | :--- |
| `dict[str, Any]` or `dataclass` / Pydantic `BaseModel` | `interface` or `type` | In Remotion, every component, infographic widget, or video scene defines its input data using an `interface` or `type`. |
| `list[T]` | `T[]` or `Array<T>` | Arrays of data points (e.g., numbers for a bar chart). |
| `tuple[int, int]` | `[number, number]` | Common in Remotion for ranges, e.g., input/output animation bounds: `[0, 30]`. |
| `None` | `null` or `undefined` | Optional fields are marked with `?` (e.g. `subtitle?: string`). |
| `*args` and `**kwargs` | Rest & Spread `...` | Used heavily to unpack styling props or merge animation settings. |
| Functions (`def foo(x):`) | Arrow Functions `const foo = (x) => ...` | React components are just functions that take props and return visual trees. |

### Code Comparison: Data Contracts

In Python:
```python
from dataclasses import dataclass
from typing import Optional

@dataclass
class StatCardConfig:
    title: str
    target_value: float
    prefix: str = "$"
    color: Optional[str] = "#3b82f6"
```

In TypeScript:
```typescript
export interface StatCardConfig {
  title: string;
  targetValue: number;
  prefix?: string; // Optional (defaults if omitted)
  color?: string;
}
```

> **Why this matters for AI Agents:**
> When prompting an AI agent to build an infographic, if you declare the TypeScript interface first, the agent writes significantly more predictable, bug-free components.

---

## 2. What is JSX Really? (Demystifying the HTML lookalike)

In standard web development, people call JSX "HTML inside JavaScript". **For video rendering, throw that idea away.**

JSX is pure syntactic sugar for Python-like nested dictionaries or tree structures.

When you see:
```tsx
const Card = () => {
  return (
    <div style={{ backgroundColor: '#111', padding: 20 }}>
      <h1 style={{ color: '#fff' }}>Q3 Revenue</h1>
    </div>
  );
};
```

Under the hood, TypeScript/React compiles it into pure function calls:
```javascript
React.createElement('div', { style: { backgroundColor: '#111', padding: 20 } },
  React.createElement('h1', { style: { color: '#fff' } }, 'Q3 Revenue')
);
```

Think of a React component like a Python function that takes a dictionary of arguments (`props`) and outputs an object tree describing what shapes, colors, and text to place on a 2D canvas.

---

## 3. Props & Component Decomposition

In Remotion, an infographic is broken into smaller visual units (e.g., `Header`, `BarChart`, `MetricCard`, `Footer`).

### Passing Props
Props are just named arguments passed to the component function.

```tsx
interface MetricProps {
  label: string;
  value: number;
  isPositive?: boolean;
}

// In Python terms: def MetricCard(label: str, value: float, is_positive: bool = True):
export const MetricCard: React.FC<MetricProps> = ({ 
  label, 
  value, 
  isPositive = true 
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontSize: 18, color: '#888' }}>{label}</span>
      <span style={{ fontSize: 36, color: isPositive ? '#22c55e' : '#ef4444' }}>
        {value}%
      </span>
    </div>
  );
};
```

---

## 4. The Critical Video Rule: Functional Purity

This is where traditional React web developers get tripped up, and where your Python scripting background is actually an **advantage**.

### The Normal Web Loop vs. Remotion Frame Render

```
Traditional Web React:
User Clicks / API Returns ──> State Changes (useState) ──> Re-render ──> DOM Updates asynchronously

Remotion Video Render:
Frame 0  ──> Pure Function(frame=0)  ──> Take Snapshot
Frame 1  ──> Pure Function(frame=1)  ──> Take Snapshot
...
Frame 180 ──> Pure Function(frame=180) ──> Take Snapshot ──> FFmpeg encodes MP4
```

### 🚫 Anti-Patterns in Video Rendering (What AI Agents Often Get Wrong)

When an AI coding agent writes Remotion code, it often hallucinates typical web React patterns. You must be able to spot these immediately:

#### 1. Avoid `useState` for Animation
* **Bad**: `const [opacity, setOpacity] = useState(0)` combined with `setTimeout` or `setInterval`.
* **Why it breaks**: Remotion doesn't run in real time. Frame 50 might be rendered before Frame 51, or 10 frames might render in parallel. Timers (`setTimeout`) will completely desynchronize video frames.
* **The Remotion Way**: Opacity is a pure mathematical calculation based on the current frame number:
  $$\text{opacity} = \frac{\text{currentFrame}}{30}$$

#### 2. Avoid CSS Transitions / `@keyframes`
* **Bad**: `transition: all 0.5s ease-in-out` or CSS `@keyframes slideIn`.
* **Why it breaks**: CSS transitions depend on the wall-clock time of the browser. During video rendering, the headless browser may take 150ms of CPU time to render a heavy 4K frame. A wall-clock CSS animation will skip forward and result in stuttering or blank frames.
* **The Remotion Way**: Use inline styles driven by Remotion's math helper functions (`interpolate` or `spring`).

#### 3. Careful with `useEffect`
* In web React, `useEffect` triggers *after* a component mounts.
* In Remotion, you almost **never** need `useEffect` unless you are doing asset preloading, which Remotion handles via specialized APIs (`delayRender` and `continueRender`).

---

## 5. Quick Check & Review: Identifying AI Anti-Patterns

Look at this snippet an AI agent might generate:

```tsx
// ⚠️ Can you spot the 2 big red flags for a video engine?
const BadBadge = () => {
  const [scale, setScale] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setScale(1);
    }, 500);
  }, []);

  return (
    <div style={{ transform: `scale(${scale})`, transition: 'transform 0.3s ease' }}>
      Breaking News!
    </div>
  );
};
```

**The Red Flags:**
1. `useState` + `setTimeout`: Non-deterministic. Frame renders happen on discrete frame ticks, not wall-clock milliseconds.
2. `transition: 'transform 0.3s ease'`: Browser CSS transitions cannot be deterministically locked to video frames.

**The Correct Mindset:**
Everything is a pure function of **`frame`**:
$$\text{scale} = \text{spring}(\text{frame})$$

---

## Summary Checklist for Module 0

Before moving to Module 1, keep these 3 axioms in mind:
1. **Types/Interfaces** define our visual contracts and props.
2. **Components** are pure visual trees, not interactive event-driven web pages.
3. **No wall-clock state**: Never allow `setTimeout`, `useState` animations, or CSS transitions.

---

*When you're ready, let me know if you have any questions on this refresher or if we should proceed to **Module 1: The Core Mental Model (React $\to$ Video)**!*
