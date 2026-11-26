import { Config } from "@remotion/cli/config";

// Enable ANGLE OpenGL renderer so Three.js (<ThreeCanvas />) and WebGL GLSL shaders render reliably.
Config.setChromiumOpenGlRenderer("angle");
