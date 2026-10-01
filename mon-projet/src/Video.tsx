import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import "./fonts";
import { Background } from "./Background";
import { Captions } from "./Captions";
import { Hud, SceneAWS, SceneAnthropic, SceneCTA, SceneEssentials, SceneHook, SceneLast, SceneManagers, SceneManaging, SceneML } from "./Scenes";
import timeline from "./data/timeline.json";
import { FPS } from "./theme";

export const DURATION = Math.ceil(timeline.duration * FPS);

// [temps (s), son, volume] – volumes volontairement bas : la voix reste au premier plan
const SFX: [number, "whoosh" | "pop" | "tick" | "ding" | "hit" | "riser", number][] = [
  [0.0, "whoosh", 0.12], [0.45, "hit", 0.22], [0.62, "pop", 0.10], [1.55, "pop", 0.10], [2.25, "pop", 0.10], [2.85, "ding", 0.10],
  [3.6, "whoosh", 0.12], [3.8, "tick", 0.08], [3.92, "tick", 0.08], [4.04, "tick", 0.08], [4.16, "tick", 0.08], [4.55, "hit", 0.2], [5.75, "hit", 0.2],
  [6.5, "whoosh", 0.12], [7.4, "pop", 0.10], [8.3, "whoosh", 0.10], [10.0, "tick", 0.10], [12.4, "whoosh", 0.12],
  [13.0, "whoosh", 0.12], [14.9, "pop", 0.08], [18.85, "hit", 0.2], [20.3, "ding", 0.12], [21.3, "pop", 0.10], [22.3, "pop", 0.10], [22.9, "pop", 0.10], [23.4, "ding", 0.10],
  [24.6, "whoosh", 0.12], [25.7, "hit", 0.18], [26.9, "pop", 0.10], [27.5, "pop", 0.10], [29.4, "whoosh", 0.10], [33.2, "tick", 0.08], [35.5, "ding", 0.10],
  [36.0, "whoosh", 0.12], [37.8, "pop", 0.12], [38.4, "whoosh", 0.10], [40.55, "hit", 0.16],
  [41.2, "riser", 0.07], [42.0, "whoosh", 0.12], [42.9, "hit", 0.2], [44.3, "tick", 0.1], [44.55, "hit", 0.16], [46.1, "whoosh", 0.10], [49.0, "ding", 0.10],
  [49.9, "whoosh", 0.12], [51.5, "pop", 0.12], [52.45, "pop", 0.10], [53.95, "hit", 0.16], [54.4, "riser", 0.07],
  [55.6, "whoosh", 0.12], [55.75, "hit", 0.2], [57.0, "pop", 0.08], [58.3, "pop", 0.14], [58.4, "ding", 0.10],
];

export const Video: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Background />
    <SceneHook />
    <SceneLast />
    <SceneEssentials />
    <SceneAnthropic />
    <SceneML />
    <SceneAWS />
    <SceneManaging />
    <SceneManagers />
    <SceneCTA end={timeline.duration} />
    <Hud />
    <Captions />
    <Audio src={staticFile("voix.mp3")} volume={1} />
    {SFX.map(([t, n, v], i) => (
      <Sequence key={i} from={Math.round(t * FPS)}>
        <Audio src={staticFile(`sfx/${n}.wav`)} volume={v} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
