import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Background } from "../Background";
import { JK, K, LINES, VOICE_END, at, clamp01, GradText } from "./kit";
import { SceneAuto, SceneCTA, SceneCalls, SceneHook, SceneLearn, SceneTeam, B } from "./scenes";
import { FPS } from "../theme";
import tl from "../data/ad_timeline.json";

export const AD_END = VOICE_END + 0.5;
export const AD_FRAMES = Math.ceil(AD_END * FPS);

type W = { w: string; s: number; e: number };
const words = tl.words as W[];
const groups: W[][] = (() => {
  const out: W[][] = []; let cur: W[] = [];
  words.forEach((w, i) => {
    cur.push(w);
    const len = cur.reduce((n, x) => n + x.w.length, 0);
    if (/[.,!?…:]$/.test(w.w) || cur.length >= 3 || len > 16 || i === words.length - 1) { out.push(cur); cur = []; }
  });
  return out;
})();

// captions visibles seulement quand l'écran ne porte pas déjà le titre
const CAP_ON: [number, number][] = [[B[1] + 0.9, B[2]], [B[3] + 0.2, B[5]]];

const Captions: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  if (!CAP_ON.some(([a, b]) => t >= a && t < b)) return null;
  let gi = -1;
  groups.forEach((g, i) => { if (t >= g[0].s - 0.03) gi = i; });
  if (gi < 0) return null;
  const g = groups[gi];
  if (t > g[g.length - 1].e + 0.4) return null;
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: 1500, height: 190, display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: "0 22px", fontFamily: JK, fontWeight: 800, fontSize: 84, letterSpacing: -2, textAlign: "center", zIndex: 200, filter: "drop-shadow(0 6px 0 rgba(0,0,0,0.55)) drop-shadow(0 0 22px rgba(0,0,0,0.9))" }}>
      {g.map((w, i) => {
        const act = t >= w.s && t < w.e + 0.02;
        if (t < w.s - 0.02) return <span key={i} style={{ opacity: 0 }}>{w.w}</span>;
        const pop = Math.min(1, (t - w.s + 0.02) / 0.12);
        return (
          <span key={i} style={{ display: "inline-block", transform: `scale(${act ? 1.1 : 1}) translateY(${(1 - pop) * 18}px)`, }}>
            {act ? <GradText>{w.w}</GradText> : <span style={{ color: K.white }}>{w.w}</span>}
          </span>
        );
      })}
    </div>
  );
};

const shake = (t: number, events: number[]) =>
  events.reduce((acc, e) => (t >= e ? acc + Math.exp(-(t - e) * 11) * Math.sin((t - e) * 60) : acc), 0);

const Cam: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const t = useCurrentFrame() / FPS;
  const s = shake(t, [at("débordent"), at("EzSet"), at("calls"), at("EzSet", 17)]);
  return <AbsoluteFill style={{ transform: `translate(${s * 14}px, ${s * 10}px) scale(${1.01 + 0.012 * Math.sin(t * 0.8)})` }}>{children}</AbsoluteFill>;
};

// [temps, son, volume] – discrets, la voix reste devant
const sfx = (): [number, string, number][] => {
  const L: [number, string, number][] = [];
  for (let i = 0; i < 14; i++) L.push([0.04 + i * 0.07, "tick", 0.05]);
  L.push([0.06, "hit", 0.16], [at("débordent"), "hit", 0.2], [at("agenda") - 0.12, "whoosh", 0.12], [at("vide"), "hit", 0.12]);
  L.push([B[1], "whoosh", 0.12], [at("EzSet") - 0.05, "hit", 0.2], [at("EzSet"), "ding", 0.1], [at("EzSet") + 0.6, "whoosh", 0.1]);
  L.push([at("répond"), "pop", 0.1], [at("qualifie"), "pop", 0.12], [at("toute"), "ding", 0.1]);
  L.push([B[2], "whoosh", 0.12], [at("Toi") + 0.15, "pop", 0.08], [at("juste") - 0.05, "pop", 0.08], [at("juste") + 0.3, "pop", 0.08], [at("calls"), "ding", 0.14]);
  L.push([B[3], "whoosh", 0.12], [at("Ajoute"), "pop", 0.1], [at("setters") - 0.15, "tick", 0.12], [at("setters") - 0.2, "whoosh", 0.08], [at("voient"), "whoosh", 0.1]);
  L.push([at("Instagram"), "pop", 0.12], [at("Messenger"), "pop", 0.12], [at("WhatsApp"), "pop", 0.12]);
  L.push([B[4], "whoosh", 0.12], [at("souffle", 13), "pop", 0.1], [at("corrigent", 13), "tick", 0.14], [at("apprend", 13) + 0.5, "ding", 0.16]);
  L.push([B[5], "whoosh", 0.12], [at("EzSet", 17) - 0.1, "hit", 0.2], [at("Crée", 17) + 0.55, "pop", 0.16], [at("Crée", 17) + 0.55, "ding", 0.08]);
  return L;
};

export const AdVideo: React.FC = () => (
  <AbsoluteFill style={{ background: K.bg }}>
    <Background />
    <Cam>
      <SceneHook end={AD_END} />
      <SceneAuto end={AD_END} />
      <SceneCalls end={AD_END} />
      <SceneTeam end={AD_END} />
      <SceneLearn end={AD_END} />
      <SceneCTA end={AD_END} />
    </Cam>
    <Captions />
    <Audio src={staticFile("ads/voix.mp3")} volume={1} />
    {sfx().map(([t, n, v], i) => (
      <Sequence key={i} from={Math.max(0, Math.round(t * FPS))}>
        <Audio src={staticFile(`sfx/${n}.wav`)} volume={v} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
export { LINES, clamp01 };
