import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import timeline from "./data/timeline.json";
import { ANTON } from "./fonts";
import { C, sp } from "./theme";

type W = { w: string; s: number; e: number };
const words = timeline.words as W[];

// groupes de 2-3 mots, coupés à la ponctuation
const groups: W[][] = (() => {
  const out: W[][] = [];
  let cur: W[] = [];
  words.forEach((w, i) => {
    cur.push(w);
    const end = /[.,!?]$/.test(w.w);
    const len = cur.reduce((n, x) => n + x.w.length, 0);
    if (end || cur.length >= 3 || len > 18 || i === words.length - 1) {
      out.push(cur);
      cur = [];
    }
  });
  return out;
})();

export const Captions: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const gi = useMemo(() => groups.map((g) => g[0].s), []);
  let idx = -1;
  for (let i = 0; i < gi.length; i++) if (t >= gi[i] - 0.04) idx = i;
  if (idx < 0) return null;
  const g = groups[idx];
  const next = groups[idx + 1]?.[0].s ?? Infinity;
  if (t > g[g.length - 1].e + 0.35 && t < next - 0.04 && next - g[g.length - 1].e > 0.5) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        right: 40,
        top: 1390,
        height: 230,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "0 26px",
        fontFamily: ANTON,
        fontSize: 118,
        lineHeight: 1.05,
        textTransform: "uppercase",
        textAlign: "center",
      }}
    >
      {g.map((w, i) => {
        const active = t >= w.s && t < w.e + 0.02;
        const pop = sp(t, w.s - 0.02, 11, 260);
        const shown = t >= w.s - 0.02;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: shown ? 1 : 0.0,
              transform: `translateY(${(1 - pop) * 26}px) scale(${active ? 1.08 : 0.96 + pop * 0.04})`,
              color: active ? C.red : C.white,
              WebkitTextStroke: "0px",
              textShadow: "0 6px 0 rgba(0,0,0,0.85), 0 0 34px rgba(0,0,0,0.9)",
            }}
          >
            {w.w}
          </span>
        );
      })}
    </div>
  );
};
