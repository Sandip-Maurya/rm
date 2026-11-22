import type { FeatureContent } from "../types";
import { CODE_SNIPPETS } from "./snippets";

export const HOOK_COPY = {
  badge: "PYTHON 3.15 IS HERE",
  titleWords: ["Python", "3.15", "Dropped!"],
  subtitle: "Top 3 Features You Need To Know (Part 1)",
};

export const FEATURES_DATA: Record<"lazyImports" | "frozendict" | "unpacking", FeatureContent> = {
  lazyImports: {
    id: "lazy-imports",
    index: "01",
    icon: "⚡",
    tag: "STARTUP SPEED",
    title: "Lazy Imports",
    summary: "Heavy packages only load when first accessed.",
    snippet: CODE_SNIPPETS.lazyImports,
    metric: {
      beforeLabel: "Cold Start",
      beforeVal: "1.24s",
      afterLabel: "With Lazy",
      afterVal: "0.04s",
    },
  },
  frozendict: {
    id: "frozendict",
    index: "02",
    icon: "🧊",
    tag: "BUILT-IN IMMUTABILITY",
    title: "frozendict",
    summary: "Native immutable, thread-safe, and hashable dictionaries.",
    snippet: CODE_SNIPPETS.frozendict,
  },
  unpacking: {
    id: "unpacking",
    index: "03",
    icon: "📦",
    tag: "CLEANER SYNTAX",
    title: "Comprehension Unpacking",
    summary: "Flatten nested iterables with zero boilerplate.",
    snippet: CODE_SNIPPETS.unpacking,
  },
};

export const OUTRO_COPY = {
  headlineWords: ["Which", "Feature", "Wins?"],
  question: "Drop your favorite in the comments!",
  part2Teaser: "Part 2 Coming Soon: UTF-8, Faster JIT & Tachyon",
  cta: "Follow for Part 2 🚀",
};
