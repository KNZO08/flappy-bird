import { Easing, interpolate, spring } from "remotion";

export const FPS = 30;
export const C = {
  bg: "#09090B",
  panel: "#131317",
  panel2: "#1B1B21",
  red: "#FF2A2A",
  redDim: "#6E1212",
  white: "#F7F7F9",
  gray: "#9A9AA6",
  amber: "#FFB020",
};

export const outExpo = Easing.bezier(0.16, 1, 0.3, 1);

/** 0→1 eased progress between time a and a+d (secondes). */
export const prog = (t: number, a: number, d = 0.5) =>
  interpolate(t, [a, a + d], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: outExpo,
  });

/** spring piloté en secondes absolues. */
export const sp = (t: number, a: number, damping = 13, stiffness = 170) =>
  t < a
    ? 0
    : spring({ frame: (t - a) * FPS, fps: FPS, config: { damping, stiffness, mass: 0.8 } });

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const rnd = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};
