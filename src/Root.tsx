import React from "react";
import { Composition } from "remotion";
import { StatCard } from "./practices/practice-01-stat-card";
import { StaggeredCascade } from "./practices/practice-02-staggered-cascade";
import { KeyframeBanner } from "./practices/practice-03-keyframe-banner";
import { AnticipationSnap } from "./practices/practice-04-anticipation-snap";
import { WordByWord } from "./practices/practice-05-word-by-word";
import { MaskedSlideUp } from "./practices/practice-06-masked-slide-up";
import { TerminalTypewriter } from "./practices/practice-07-terminal-typewriter";
import { DynamicHighlighter } from "./practices/practice-08-dynamic-highlighter";
import {
  Python315Part1,
  VIDEO_WIDTH,
  VIDEO_HEIGHT,
  FPS,
  TOTAL_DURATION_IN_FRAMES,
} from "./projects/python-315-features-part1";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Practice01-StatCard"
        component={StatCard}
        defaultProps={{
          label: "Monthly Recurring Revenue",
          value: "$84,200",
          growth: "+14.8%",
        }}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Practice02-StaggeredCascade"
        component={StaggeredCascade}
        defaultProps={{
          title: "Performance Indicators",
          items: [
            { label: "Users", value: "+18%", isPositive: true },
            { label: "Churn", value: "1.2%", isPositive: false },
            { label: "NPS", value: "74", isPositive: true },
            { label: "LTV", value: "$480", isPositive: true },
          ],
        }}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Practice03-KeyframeBanner"
        component={KeyframeBanner}
        defaultProps={{
          badgeText: "BREAKING NEWS",
          headline: "Major AI Breakthrough Announced",
          subheadline:
            "New generative motion model achieves real-time interactive rendering",
        }}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Practice04-AnticipationSnap"
        component={AnticipationSnap}
        defaultProps={{
          buttonText: "Launch Mission 🚀",
          sublabel: "T-minus zero: Anticipation & Snap Motion",
        }}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Practice05-WordByWord"
        component={WordByWord}
        defaultProps={{
          text: "Stop Building Boring Dashboards Today",
          highlightWordIndex: 2,
        }}
        durationInFrames={120}
        fps={30}
        width={1080}
        height={1920}
      />

      <Composition
        id="Practice06-MaskedSlideUp"
        component={MaskedSlideUp}
        defaultProps={{
          category: "ANNUAL REPORT 2026",
          line1: "Quarterly Executive",
          line2: "Strategic Review",
        }}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Practice07-TerminalTypewriter"
        component={TerminalTypewriter}
        defaultProps={{
          command: "bun add remotion @remotion/core",
          userPrompt: "developer@macbook ~ %",
        }}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Practice08-DynamicHighlighter"
        component={DynamicHighlighter}
        defaultProps={{
          prefixText: "Ship video apps",
          highlightedText: "10x Faster",
          suffixText: "with Remotion",
        }}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Python315-Features-Part1"
        component={Python315Part1}
        defaultProps={{
          enableAudio: false,
        }}
        durationInFrames={TOTAL_DURATION_IN_FRAMES}
        fps={FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
    </>
  );
};

