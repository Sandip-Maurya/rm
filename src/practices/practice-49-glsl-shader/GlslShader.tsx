import React, { useEffect, useLayoutEffect, useRef } from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { GlslShaderProps } from "./types";

const VERTEX_SHADER_SRC = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SRC = `
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;

float liquidHeight(vec2 p, float t) {
  vec2 q = p;
  q.x += 0.35 * sin(p.y * 2.4 + t * 1.15);
  q.y += 0.35 * cos(p.x * 2.1 - t * 0.95);

  float w1 = sin(q.x * 3.8 + t * 1.6) * cos(q.y * 3.2 - t * 1.2);
  float w2 = sin((q.x + q.y) * 5.1 - t * 2.1) * 0.5;
  float w3 = cos(sqrt(dot(q, q) + 0.18) * 2.4 * 3.5 - t * 1.8) * 0.4;
  return w1 + w2 + w3;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 centered = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
  float t = u_time;

  // Finite difference surface normal for metallic liquid chrome speculars
  float eps = 0.008;
  float h0 = liquidHeight(centered, t);
  float hx = liquidHeight(centered + vec2(eps, 0.0), t);
  float hy = liquidHeight(centered + vec2(0.0, eps), t);

  vec3 normal = normalize(vec3((h0 - hx) / eps * 0.22, (h0 - hy) / eps * 0.22, 1.0));
  vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0));
  vec3 lightDir1 = normalize(vec3(cos(t * 0.7) * 0.8, sin(t * 0.5) * 0.6 + 0.4, 0.9));
  vec3 lightDir2 = normalize(vec3(-0.7, -0.5, 0.8));

  vec3 halfVec1 = normalize(lightDir1 + viewDir);
  vec3 halfVec2 = normalize(lightDir2 + viewDir);

  float spec1 = pow(max(dot(normal, halfVec1), 0.0), 42.0);
  float spec2 = pow(max(dot(normal, halfVec2), 0.0), 24.0);
  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.4);

  // Thin-film iridescent oil-slick rainbow phase modulation
  float filmPhase = h0 * 1.35 + dot(normal.xy, vec2(2.2, 1.6)) + t * 0.65 + uv.x * 1.4;
  vec3 iridescent = 0.5 + 0.5 * cos(filmPhase + vec3(0.0, 2.094, 4.188));

  // Liquid mercury metallic base
  vec3 mercuryDark = vec3(0.035, 0.05, 0.095);
  vec3 mercurySilver = vec3(0.58, 0.68, 0.82);
  float metallicBand = smoothstep(-0.8, 1.1, normal.y * 0.8 + h0 * 0.45);
  vec3 baseChrome = mix(mercuryDark, mercurySilver, metallicBand * 0.65);

  vec3 col = mix(baseChrome, iridescent, 0.42 + 0.45 * fresnel);
  col += vec3(0.95, 0.98, 1.0) * spec1 * 0.95;
  col += iridescent * spec2 * 0.65;

  // Soft studio vignette
  float vignette = smoothstep(1.35, 0.25, length(centered));
  col *= mix(0.42, 1.0, vignette);

  gl_FragColor = vec4(col, 1.0);
}
`;

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error("Failed to allocate WebGL shader");
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader) ?? "Unknown shader compile error";
    gl.deleteShader(shader);
    throw new Error(info);
  }
  return shader;
}

interface GlState {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  buffer: WebGLBuffer;
  uTimeLoc: WebGLUniformLocation | null;
  uResLoc: WebGLUniformLocation | null;
}

export const GlslShader: React.FC<GlslShaderProps> = ({
  title = "Liquid Chrome Iridescence",
  subtitle = "Custom WebGL Fragment Shader • Thin-Film Interference & Specular Normals",
  speedMultiplier = 1,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glStateRef = useRef<GlState | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl =
      canvas.getContext("webgl2", { preserveDrawingBuffer: true }) ??
      canvas.getContext("webgl", { preserveDrawingBuffer: true });
    if (!gl) return;

    const vert = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
    const frag = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const err = gl.getProgramInfoLog(program) ?? "Shader link failure";
      throw new Error(err);
    }

    const buffer = gl.createBuffer();
    if (!buffer) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTimeLoc = gl.getUniformLocation(program, "u_time");
    const uResLoc = gl.getUniformLocation(program, "u_resolution");

    glStateRef.current = { gl, program, buffer, uTimeLoc, uResLoc };

    // Immediately paint initial frame upon context creation
    gl.viewport(0, 0, width, height);
    gl.useProgram(program);
    gl.uniform1f(uTimeLoc, (frame / fps) * speedMultiplier);
    gl.uniform2f(uResLoc, width, height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    return () => {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
      glStateRef.current = null;
    };
  }, [width, height]);

  useLayoutEffect(() => {
    const state = glStateRef.current;
    if (!state) return;
    const { gl, program, uTimeLoc, uResLoc } = state;

    gl.viewport(0, 0, width, height);
    gl.useProgram(program);
    gl.uniform1f(uTimeLoc, (frame / fps) * speedMultiplier);
    gl.uniform2f(uResLoc, width, height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.finish();
  }, [frame, fps, width, height, speedMultiplier]);

  const uTime = (frame / fps) * speedMultiplier;
  const hudSpring = spring({
    frame,
    fps,
    config: { damping: 16, mass: 0.6 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#030612",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />

      {/* Editorial Glass HUD */}
      <div
        style={{
          position: "absolute",
          top: 56,
          left: 80,
          padding: "24px 32px",
          borderRadius: 24,
          backgroundColor: "rgba(3, 6, 18, 0.56)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          backdropFilter: "blur(18px)",
          opacity: hudSpring,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            padding: "6px 16px",
            borderRadius: 9999,
            backgroundColor: "rgba(56, 189, 248, 0.16)",
            border: "1px solid rgba(56, 189, 248, 0.4)",
            color: "#7dd3fc",
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: "0.08em",
            marginBottom: 12,
          }}
        >
          CATEGORY J // PRACTICE 49
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: 48,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-0.03em",
          }}
        >
          {title}
        </h1>
        <div style={{ fontSize: 20, color: "#cbd5e1", marginTop: 6 }}>
          {subtitle}
        </div>
      </div>

      {/* GLSL Uniform Readout */}
      <div
        style={{
          position: "absolute",
          bottom: 52,
          right: 80,
          padding: "14px 24px",
          borderRadius: 16,
          backgroundColor: "rgba(3, 6, 18, 0.65)",
          border: "1px solid rgba(255, 255, 255, 0.16)",
          backdropFilter: "blur(14px)",
          color: "#e2e8f0",
          fontSize: 20,
          fontWeight: 700,
          fontFamily:
            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          opacity: hudSpring,
        }}
      >
        uniform float u_time ={" "}
        <span style={{ color: "#38bdf8" }}>{uTime.toFixed(2)}s</span>
      </div>
    </AbsoluteFill>
  );
};
