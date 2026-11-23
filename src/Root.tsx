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
import { MetricTicker } from "./practices/practice-09-metric-ticker";
import { SvgLineChart } from "./practices/practice-10-svg-line-chart";
import { PulsingCallout } from "./practices/practice-11-pulsing-callout";
import { StaggeredBarChart } from "./practices/practice-12-staggered-bar-chart";
import { DonutMeter } from "./practices/practice-13-donut-meter";
import { FeatureMatrix } from "./practices/practice-14-feature-matrix";
import { SeamlessSlide } from "./practices/practice-15-seamless-slide";
import { CameraZoom } from "./practices/practice-16-camera-zoom";
import { CardFlip3D } from "./practices/practice-17-3d-card-flip";
import { ScreenWipe } from "./practices/practice-18-screen-wipe";
import { CursorClick } from "./practices/practice-19-cursor-click";
import { NotificationToast } from "./practices/practice-20-notification-toast";
import { FloatingBadge } from "./practices/practice-21-floating-badge";
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
        id="Practice09-MetricTicker"
        component={MetricTicker}
        defaultProps={{
          label: "Total Annual Run Rate (ARR)",
          targetValue: 4850230,
          growthBadge: "+134.2% YoY",
          subtext: "Live telemetry • Financial Q4 Close",
        }}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Practice10-SvgLineChart"
        component={SvgLineChart}
        defaultProps={{
          title: "ETH / USD Performance",
          metric: "$3,842.50",
          trendBadge: "+28.4% (30D)",
        }}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Practice11-PulsingCallout"
        component={PulsingCallout}
        defaultProps={{
          calloutTitle: "All-Time Peak Volume",
          calloutValue: "$9.42M",
          sublabel: "Record Breakout • Frame 45 Trigger",
        }}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Practice12-StaggeredBarChart"
        component={StaggeredBarChart}
        defaultProps={{
          title: "Annual Growth Trajectory",
          subtitle: "Comparative Revenue Multipliers (2023 - 2026)",
          bars: [
            { year: "2023", value: 38, displayValue: "+38%" },
            { year: "2024", value: 58, displayValue: "+58%" },
            { year: "2025", value: 78, displayValue: "+78%" },
            { year: "2026", value: 100, displayValue: "+100%", isHighlight: true },
          ],
        }}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Practice13-DonutMeter"
        component={DonutMeter}
        defaultProps={{
          label: "SYSTEM EFFICIENCY",
          targetPercent: 84,
          subtext: "Optimal Operating Range",
        }}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1080}
      />

      <Composition
        id="Practice14-FeatureMatrix"
        component={FeatureMatrix}
        defaultProps={{
          title: "Feature Comparison Matrix",
          ourProduct: "Remotion Native",
          competitorProduct: "Legacy Stack",
          features: [
            { feature: "Real-Time 60 FPS Engine", us: true, competitor: false },
            { feature: "Interactive Props in Studio", us: true, competitor: false },
            { feature: "Zero-Latency Bun Runtime", us: true, competitor: false },
            { feature: "Full Vector Math Control", us: true, competitor: true },
          ],
        }}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Practice15-SeamlessSlide"
        component={SeamlessSlide}
        defaultProps={{
          scene1Title: "Active Engine Performance",
          scene1Stat: "120 FPS",
          scene2Title: "Resource Efficiency Gains",
          scene2Stat: "+340%",
        }}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Practice16-CameraZoom"
        component={CameraZoom}
        defaultProps={{
          dashboardTitle: "Mission Operations Center",
          focusWidgetTitle: "Active GPU Cluster Load",
          focusWidgetValue: "98.4%",
        }}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Practice17-CardFlip3D"
        component={CardFlip3D}
        defaultProps={{
          cardType: "TITANIUM BLACK // METAL EDITION",
          frontNumber: "•••• •••• •••• 8492",
          frontHolder: "ALEXANDER CHEN",
          frontExpiry: "08 / 29",
          backCvv: "842",
          backLimit: "$150,000",
          backStatus: "VIP CONCIERGE ACTIVE",
        }}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Practice18-ScreenWipe"
        component={ScreenWipe}
        defaultProps={{
          scene1Headline: "Enterprise Intelligence Engine",
          scene1Subtext: "Phase 01: Real-time Data Ingestion & Stream Processing",
          scene2Headline: "Next-Gen Analytics Hub",
          scene2Subtext: "Phase 02: Multi-Model Inference & Live Decisioning",
        }}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Practice19-CursorClick"
        component={CursorClick}
        defaultProps={{
          productTitle: "Cloud Infrastructure Pro Tier",
          price: "$249.00 / mo",
          buttonText: "Confirm & Deploy",
          successMessage: "Deployment Initiated Successfully!",
        }}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Practice20-NotificationToast"
        component={NotificationToast}
        defaultProps={{
          appName: "Apple Pay",
          sender: "Stripe Payouts",
          message: "Funds transferred to High-Yield Checking",
          amount: "+$4,850.00",
          timeAgo: "now",
        }}
        durationInFrames={120}
        fps={30}
        width={1080}
        height={1920}
      />

      <Composition
        id="Practice21-FloatingBadge"
        component={FloatingBadge}
        defaultProps={{
          category: "TOP RATED DEVELOPER TOOL",
          badgeTitle: "SOC 2 Type II Certified",
          ratingScore: "4.98",
          reviewCount: "2,400+ Enterprise Audits",
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
          enableAudio: true,
        }}
        durationInFrames={TOTAL_DURATION_IN_FRAMES}
        fps={FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
    </>
  );
};
