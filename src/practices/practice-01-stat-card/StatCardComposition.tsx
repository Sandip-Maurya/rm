import React from "react";
import { Composition } from "remotion";
import { StatCard } from "./StatCard";
import type { StatCardProps } from "./types";

export const StatCardComposition: React.FC = () => {
  return (
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
  );
};
