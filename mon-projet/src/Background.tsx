import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, rnd } from "./theme";

export const Background: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const gx = 540 + Math.sin(t * 0.6) * 280;
  const gy = 620 + Math.cos(t * 0.45) * 220;
  const scroll = (f * 1.6) % 90;
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(900px 900px at ${gx}px ${gy}px, rgba(255,42,42,0.20), transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "90px 90px",
          backgroundPosition: `${scroll}px ${scroll}px`,
          maskImage: "radial-gradient(ellipse at 50% 40%, black 30%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, black 30%, transparent 78%)",
        }}
      />
      {Array.from({ length: 26 }).map((_, i) => {
        const x = rnd(i + 1) * 1080;
        const speed = 0.4 + rnd(i + 50) * 1.2;
        const y = 1920 - ((f * speed * 2 + rnd(i + 9) * 1920) % 1920);
        const s = 3 + rnd(i + 21) * 6;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: s,
              height: s,
              borderRadius: "50%",
              background: i % 4 === 0 ? C.red : "#fff",
              opacity: i % 4 === 0 ? 0.55 : 0.18,
            }}
          />
        );
      })}
      <AbsoluteFill
        style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.6) 100%)" }}
      />
    </AbsoluteFill>
  );
};
