import type { PythonSnippet } from "../types";

export const CODE_SNIPPETS: Record<"lazyImports" | "frozendict" | "unpacking", PythonSnippet> = {
  lazyImports: {
    filename: "app.py",
    badgeText: "PEP 690",
    code: `# Modules load only on access!
import torch
import pandas as pd

def run_prediction():
    # Loaded on demand here ⚡
    return torch.load("model.pt")`,
    highlightLines: [2, 7],
  },

  frozendict: {
    filename: "cache.py",
    badgeText: "Native Builtin",
    code: `# Immutable & Hashable!
config = frozendict({"env": "prod", "ttl": 300})

# Safe as a dictionary key:
cache[config] = "healthy"

config["ttl"] = 0  # 💥 TypeError!`,
    highlightLines: [2, 5, 7],
  },

  unpacking: {
    filename: "flatten.py",
    badgeText: "Star Unpacking",
    code: `matrix = [[1, 2], [3, 4], [5, 6]]

# Flatten directly inside comprehension:
flat = [x for *row in matrix for x in row]
# Output: [1, 2, 3, 4, 5, 6]`,
    highlightLines: [4],
  },
};
