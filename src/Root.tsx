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
import { SfxMetricCascade } from "./practices/practice-22-sfx-metric-cascade";
import { WaveformEqualizer } from "./practices/practice-23-waveform-equalizer";
import { PromoSnippet } from "./practices/practice-24-promo-snippet";
import { DepartureBoard } from "./practices/practice-25-departure-board";
import { CodeHighlighter } from "./practices/practice-26-code-highlighter";
import { KineticTextWave } from "./practices/practice-27-text-wave";
import { KaraokePill } from "./practices/practice-28-karaoke-pill";
import { MultiSeriesAreaChart } from "./practices/practice-29-multi-area-chart";
import { SpeedometerDial } from "./practices/practice-30-speedometer-dial";
import { LeaderboardRankSwap } from "./practices/practice-31-leaderboard-swap";
import { HeatmapMatrix } from "./practices/practice-32-heatmap-matrix";
import { ParallaxPan } from "./practices/practice-33-parallax-pan";
import { ZoomThrough } from "./practices/practice-34-zoom-through";
import { CubeRotation } from "./practices/practice-35-cube-rotation";
import { GlitchCut } from "./practices/practice-36-glitch-cut";
import { DeviceMockup } from "./practices/practice-37-device-mockup";
import { FloatingGeometry } from "./practices/practice-38-floating-geometry";
import { CameraFlythrough } from "./practices/practice-39-camera-flythrough";
import { ExtrudedBars } from "./practices/practice-40-extruded-bars";
import { PhysicsConfetti } from "./practices/practice-41-physics-confetti";
import { ConstellationMesh } from "./practices/practice-42-constellation-mesh";
import { AudioParticleOrb } from "./practices/practice-43-audio-particle-orb";
import { SmokeTrail } from "./practices/practice-44-smoke-trail";
import { PathMorphing } from "./practices/practice-45-path-morphing";
import { SimplexWaveforms } from "./practices/practice-46-simplex-waveforms";
import { NeuralNetwork } from "./practices/practice-47-neural-network";
import { LissajousPlotter } from "./practices/practice-48-lissajous-plotter";
import { GlslShader } from "./practices/practice-49-glsl-shader";
import { ScreenGlare } from "./practices/practice-50-screen-glare";
import { RetroCrt } from "./practices/practice-51-retro-crt";
import { MotionBlur } from "./practices/practice-52-motion-blur";
import {
  Python315Part1,
  VIDEO_WIDTH,
  VIDEO_HEIGHT,
  FPS,
  TOTAL_DURATION_IN_FRAMES,
} from "./projects/python-315-features-part1";
import {
  DevOpsFlow,
  VIDEO_WIDTH as DEVOPS_WIDTH,
  VIDEO_HEIGHT as DEVOPS_HEIGHT,
  FPS as DEVOPS_FPS,
  TOTAL_DURATION_IN_FRAMES as DEVOPS_FRAMES,
} from "./projects/project-02-devops-flow";
import {
  PulseFlow,
  VIDEO_WIDTH as PULSE_WIDTH,
  VIDEO_HEIGHT as PULSE_HEIGHT,
  FPS as PULSE_FPS,
  TOTAL_DURATION_IN_FRAMES as PULSE_FRAMES,
} from "./projects/project-01-pulseflow";
import {
  AsyncFix,
  VIDEO_WIDTH as ASYNC_WIDTH,
  VIDEO_HEIGHT as ASYNC_HEIGHT,
  FPS as ASYNC_FPS,
  TOTAL_DURATION_IN_FRAMES as ASYNC_FRAMES,
} from "./projects/project-03-async-fix";

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
        id="Practice22-SfxMetricCascade"
        component={SfxMetricCascade}
        defaultProps={{
          title: "Infrastructure Health Check",
          subtitle: "Deterministic Impact Synchronization • Frame-Accurate Audio Triggers",
          enableAudio: true,
        }}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Practice23-WaveformEqualizer"
        component={WaveformEqualizer}
        defaultProps={{
          trackTitle: "Synthesizer Frequency Analysis",
          artist: "Remotion Neural Audio Engine",
          audioFile: "audio/python315/scene01_hook.wav",
          numberOfBars: 32,
        }}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Practice24-PromoSnippet"
        component={PromoSnippet}
        defaultProps={{
          problemStatement: "Legacy data stacks are slowing down engineering velocity.",
          solutionMetric: "+340% Real-Time ARR",
          metricLabel: "Automated Data Ingestion & Live AI Pipelines",
          brandName: "REMOTION LABS",
          tagline: "Ship Production-Grade Video Apps at Web Speed",
          enableAudio: true,
        }}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Practice25-DepartureBoard"
        component={DepartureBoard}
        defaultProps={{
          fromText: "DEPARTED",
          toText: "BOARDING",
          sublabel: "GATE 42B • FLIGHT RM-2026 • DIRECT TO SAN FRANCISCO",
        }}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Practice26-CodeHighlighter"
        component={CodeHighlighter}
        defaultProps={{
          filename: "MotionEngine.tsx",
        }}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Practice27-KineticTextWave"
        component={KineticTextWave}
        defaultProps={{
          headline: "SUPERCHARGED",
          badgeText: "PHYSICS ENGINE V2",
          subtext: "Continuous Sine Waveform Carrier • Per-Character Damped Springs",
        }}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Practice28-KaraokePill"
        component={KaraokePill}
        defaultProps={{
          speaker: "ALEX CHEN // CO-FOUNDER",
        }}
        durationInFrames={135}
        fps={30}
        width={1080}
        height={1920}
      />

      <Composition
        id="Practice29-MultiAreaChart"
        component={MultiSeriesAreaChart}
        defaultProps={{
          title: "Enterprise Cashflow Telemetry",
          subtitle: "Comparative Multi-Series Area Curves • Real-Time Scanning Crosshair",
        }}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Practice30-SpeedometerDial"
        component={SpeedometerDial}
        defaultProps={{
          label: "SYSTEM THROUGHPUT VELOCITY",
          metricUnit: "GB / SEC",
          targetScore: 94,
          substatus: "OPTIMAL CLUSTER BANDWIDTH • INERTIAL SPRING DAMPING",
        }}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1080}
      />

      <Composition
        id="Practice31-LeaderboardSwap"
        component={LeaderboardRankSwap}
        defaultProps={{
          title: "GLOBAL DEVELOPER LEADERBOARD",
          subtitle: "Dynamic Layout Physics • Coordinate Interpolation & Rank Swap",
        }}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Practice32-HeatmapMatrix"
        component={HeatmapMatrix}
        defaultProps={{
          title: "CONTINUOUS DEPLOYMENT DENSITY MATRIX",
          subtitle: "Manhattan Distance Diagonal Wave • Numeric Intensity Scale (112 Cells)",
        }}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Practice33-ParallaxPan"
        component={ParallaxPan}
        defaultProps={{
          headline: "DEEP MULTI-PLANE OPTICAL PARALLAX",
          badgeText: "CAMERA SYSTEMS // 2.5D DEPTH",
        }}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Practice34-ZoomThrough"
        component={ZoomThrough}
        defaultProps={{
          deviceLabel: "MOBILE CLIENT VIEW // STAGE 01",
          destinationLabel: "GLOBAL OPERATIONS COMMAND // STAGE 02",
        }}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Practice35-CubeRotation"
        component={CubeRotation}
        defaultProps={{
          face1Title: "FRONT STAGE // INGESTION",
          face1Metric: "1.4M Events / sec",
          face2Title: "RIGHT STAGE // ANALYTICS",
          face2Metric: "99.995% Uptime SLA",
        }}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Practice36-GlitchCut"
        component={GlitchCut}
        defaultProps={{
          scene1Headline: "SYSTEM STATUS // NOMINAL",
          scene2Headline: "CYBERNETIC BREACH OVERRIDE",
          glitchStart: 40,
          glitchDuration: 8,
        }}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Practice37-DeviceMockup"
        component={DeviceMockup}
        defaultProps={{
          brandTitle: "Remotion 3D",
          headline: "Metallic Device Orbit",
          sublabel: "ThreeCanvas • Beveled Extrusion & Specular Rig",
          accentColor: "#38bdf8",
        }}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Practice38-FloatingGeometry"
        component={FloatingGeometry}
        defaultProps={{
          headline: "IRIDESCENT",
          subheadline: "SPRING HARMONICS",
          badgeText: "CATEGORY G // PRACTICE 38",
        }}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Practice39-CameraFlythrough"
        component={CameraFlythrough}
        defaultProps={{
          hudTitle: "CYBER SPLINE TUNNEL",
          ringCount: 38,
        }}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Practice40-ExtrudedBars"
        component={ExtrudedBars}
        defaultProps={{
          title: "3D Revenue Elevation",
          subtitle: "Spring-Damped Beveled Pillars • Y=0 Floor Pinning & Drop Shadows",
          bars: [
            { label: "Q1", valueText: "$1.2M", targetHeight: 1.8, color: "#38bdf8" },
            { label: "Q2", valueText: "$2.4M", targetHeight: 2.9, color: "#818cf8" },
            { label: "Q3", valueText: "$3.7M", targetHeight: 4.1, color: "#c084fc" },
            { label: "Q4", valueText: "$5.2M", targetHeight: 5.4, color: "#34d399" },
          ],
        }}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Practice41-PhysicsConfetti"
        component={PhysicsConfetti}
        defaultProps={{
          title: "DETERMINISTIC CONFETTI ENGINE",
          subtitle: "360 Particles • Analytical Drag, Gravity & 2D Tumble Physics",
          particleCount: 360,
          burstFrame: 15,
        }}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Practice42-ConstellationMesh"
        component={ConstellationMesh}
        defaultProps={{
          title: "PROXIMITY CONSTELLATION MESH",
          nodeCount: 80,
          maxDistance: 160,
        }}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Practice43-AudioParticleOrb"
        component={AudioParticleOrb}
        defaultProps={{
          title: "Audio Reactive Particle Orb",
          audioFile: "audio/samples/sample-energy-blend-120.wav",
          particleCount: 380,
        }}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1080}
      />

      <Composition
        id="Practice44-SmokeTrail"
        component={SmokeTrail}
        defaultProps={{
          title: "FLUID INK & SMOKE TRAIL",
          subtitle: "Lemniscate Emitter • Deterministic Curl Deflection & Life Culling",
          maxLife: 42,
        }}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Practice45-PathMorphing"
        component={PathMorphing}
        defaultProps={{
          title: "Topologic SVG Morphing",
        }}
        durationInFrames={120}
        fps={30}
        width={1080}
        height={1080}
      />

      <Composition
        id="Practice46-SimplexWaveforms"
        component={SimplexWaveforms}
        defaultProps={{
          title: "Organic Simplex Noise Ribbons",
          subtitle: "Multi-Octave 2D Procedural Noise • Smooth Edge-Tapered Bezier Splines",
        }}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Practice47-NeuralNetwork"
        component={NeuralNetwork}
        defaultProps={{
          title: "Transformer Neural Architecture",
          subtitle: "Staggered Layer Topology • Post-Settlement Synaptic Pulse Propagation",
        }}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Practice48-LissajousPlotter"
        component={LissajousPlotter}
        defaultProps={{
          title: "Harmonic Lissajous Attractor",
          freqA: 3,
          freqB: 4,
        }}
        durationInFrames={120}
        fps={30}
        width={1080}
        height={1080}
      />

      <Composition
        id="Practice49-GlslShader"
        component={GlslShader}
        defaultProps={{
          title: "Liquid Chrome Iridescence",
          subtitle: "Custom WebGL Fragment Shader • Thin-Film Interference & Specular Normals",
          speedMultiplier: 1,
        }}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Practice50-ScreenGlare"
        component={ScreenGlare}
        defaultProps={{
          title: "3D Screen Replacement & Glass Glare",
          screenHeadline: "CLOUD TELEMETRY STUDIO",
        }}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Practice51-RetroCrt"
        component={RetroCrt}
        defaultProps={{
          terminalTitle: "REMOTION // VT-420 PHOSPHOR TERMINAL",
          phosphorColor: "#4ade80",
        }}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Practice52-MotionBlur"
        component={MotionBlur}
        defaultProps={{
          cardTitle: "HYPER-VELOCITY RENDER NODE",
          metricValue: "4,820 px/s",
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

      <Composition
        id="Project01-PulseFlow"
        component={PulseFlow}
        defaultProps={{
          enableAudio: true,
        }}
        durationInFrames={PULSE_FRAMES}
        fps={PULSE_FPS}
        width={PULSE_WIDTH}
        height={PULSE_HEIGHT}
      />

      <Composition
        id="Project02-DevOpsFlow"
        component={DevOpsFlow}
        defaultProps={{
          enableAudio: true,
          showSubtitles: true,
        }}
        durationInFrames={DEVOPS_FRAMES}
        fps={DEVOPS_FPS}
        width={DEVOPS_WIDTH}
        height={DEVOPS_HEIGHT}
      />

      <Composition
        id="Project03-AsyncFix"
        component={AsyncFix}
        defaultProps={{
          enableAudio: true,
        }}
        durationInFrames={ASYNC_FRAMES}
        fps={ASYNC_FPS}
        width={ASYNC_WIDTH}
        height={ASYNC_HEIGHT}
      />
    </>
  );
};
