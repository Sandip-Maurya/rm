import React from "react";
import { Composition } from "remotion";
import { StatCard } from "./practices/practice-01-stat-card";
import { StaggeredCascade } from "./practices/practice-02-staggered-cascade";
import { KeyframeBanner } from "./practices/practice-03-keyframe-banner";
import { AnticipationSnap } from "./practices/practice-04-anticipation-snap";

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
    </>
  );
};

