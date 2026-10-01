import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { Arrow, Bubble, Chip, CertCard, Clock, CVDoc, Gauge, MonthRing, Network, Seal, Slam, Rise } from "./blocks";
import { ANTON, INTER } from "./fonts";
import { C, FPS, clamp01, prog, sp } from "./theme";

type Render = (t: number) => React.ReactNode;

/** Une scène : t = temps absolu (s). Entrée = swipe rouge, sortie = fondu rapide. */
const Scene: React.FC<{ from: number; to: number; children: Render }> = ({ from, to, children }) => (
  <Sequence from={Math.round(from * FPS)} durationInFrames={Math.round((to - from) * FPS)}>
    <SceneInner from={from} to={to}>{children}</SceneInner>
  </Sequence>
);

const SceneInner: React.FC<{ from: number; to: number; children: Render }> = ({ from, to, children }) => {
  const t = from + useCurrentFrame() / FPS;
  const out = 1 - clamp01((t - (to - 0.14)) / 0.14);
  const swipe = prog(t, from, 0.38);
  return (
    <AbsoluteFill style={{ opacity: out, transform: `translateY(${(1 - out) * -30}px)` }}>
      {children(t)}
      <div
        style={{
          position: "absolute", top: -300, height: 2500, width: 520, background: C.red,
          left: -700 + swipe * 2300, transform: "rotate(14deg)", opacity: swipe < 1 ? 0.95 : 0,
          boxShadow: "0 0 120px rgba(255,42,42,0.8)",
        }}
      />
    </AbsoluteFill>
  );
};

const Stage: React.FC<{ children: React.ReactNode; gap?: number; top?: number; height?: number }> = ({ children, gap = 36, top = 270, height = 1060 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top, height, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap }}>
    {children}
  </div>
);

const Kicker: React.FC<{ t: number; a: number; children: React.ReactNode }> = ({ t, a, children }) => (
  <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 34, letterSpacing: 9, color: C.red, textTransform: "uppercase", opacity: clamp01((t - a) / 0.15), transform: `translateX(${(1 - prog(t, a, 0.4)) * -60}px)` }}>
    {children}
  </div>
);

/* ===== 1. HOOK 0 → 3.6 ===== */
export const SceneHook: React.FC = () => (
  <Scene from={0} to={3.6}>
    {(t) => (
      <>
        <Stage gap={0} top={190} height={800}>
          <div style={{ position: "relative", width: 900, height: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "absolute" }}><MonthRing t={t} a={0.3} size={900} /></div>
            <div style={{ transform: `scale(${1 + Math.sin(t * 3) * 0.015})` }}>
              <Slam t={t} a={0.45} size={560} color={C.red} style={{ textShadow: "0 0 90px rgba(255,42,42,0.55)" }}>6</Slam>
            </div>
          </div>
        </Stage>
        <Stage top={880} height={520} gap={0}>
          <Slam t={t} a={0.62} size={190}>MOIS</Slam>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 40, alignItems: "center" }}>
            <Chip t={t} a={1.55} dir={-1}>Certifications</Chip>
            <Chip t={t} a={2.25} dir={1}>Formations IA</Chip>
            <Chip t={t} a={2.85} dir={-1} tone="red">100% gratuites</Chip>
          </div>
        </Stage>
      </>
    )}
  </Scene>
);

/* ===== 2. LA DERNIÈRE 3.6 → 6.5 ===== */
export const SceneLast: React.FC = () => (
  <Scene from={3.6} to={6.5}>
    {(t) => {
      const tiles = [1, 2, 3, 4];
      const focus = sp(t, 4.55, 12, 200);
      return (
        <Stage gap={60}>
          <Kicker t={t} a={3.7}>Les meilleures</Kicker>
          <div style={{ display: "flex", gap: 26, alignItems: "flex-end" }}>
            {tiles.map((n, i) => {
              const p = sp(t, 3.8 + i * 0.12, 13, 200);
              const last = n === 4;
              const k = last ? 1 + focus * 0.22 : 1 - focus * 0.08;
              return (
                <div key={n} style={{
                  width: 210, height: 300, borderRadius: 28, background: last && focus > 0.3 ? C.red : C.panel2,
                  border: "2px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: ANTON, fontSize: 150, color: last && focus > 0.3 ? "#fff" : "rgba(255,255,255,0.35)",
                  opacity: clamp01(p * 2) * (last ? 1 : 1 - focus * 0.5),
                  transform: `translateY(${(1 - p) * 260}px) scale(${k})`, transformOrigin: "bottom",
                  boxShadow: last && focus > 0.3 ? "0 0 110px rgba(255,42,42,0.7)" : "none",
                }}>0{n}</div>
              );
            })}
          </div>
          <div style={{ marginTop: 40 }}>
            <Slam t={t} a={5.75} size={140} color={C.white}>À ne jamais <span style={{ color: C.red }}>louper</span></Slam>
            <div style={{ height: 12, background: C.red, margin: "16px auto 0", width: `${prog(t, 6.0, 0.35) * 100}%`, boxShadow: "0 0 30px rgba(255,42,42,0.9)" }} />
          </div>
        </Stage>
      );
    }}
  </Scene>
);

/* ===== 3. GOOGLE AI ESSENTIALS 6.5 → 13.0 ===== */
export const SceneEssentials: React.FC = () => (
  <Scene from={6.5} to={13.0}>
    {(t) => (
      <Stage gap={44}>
        <Kicker t={t} a={6.6}>Niveau 01 · Non-techniques</Kicker>
        <Chip t={t} a={7.4} icon="dot" tone="dark">Pour les non-techniques</Chip>
        <CertCard t={t} a={8.3} no="01" org="GOOGLE" name={["AI", "Essentials"]} tag="Le point de départ" nameSize={170} />
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <Clock t={t} a={10.0} size={260} />
          <Rise t={t} a={10.25} size={92} align="left">Quelques<br />heures</Rise>
        </div>
        <div style={{ position: "absolute", right: 70, top: 1130, opacity: prog(t, 12.4, 0.2) }}>
          <Arrow t={t} a={12.4} size={150} />
        </div>
      </Stage>
    )}
  </Scene>
);

/* ===== 4. ANTHROPIC ACADEMY 13.0 → 24.6 ===== */
export const SceneAnthropic: React.FC = () => (
  <Scene from={13.0} to={24.6}>
    {(t) => {
      const early = t < 20.3;
      const late = t >= 21.3;
      return (
        <>
          <div style={{ position: "absolute", left: 90, top: 250 }}>
            <CertCard t={t} a={13.0} no="02" org="ANTHROPIC" name={["Anthropic", "Academy"]} tag="La suite logique" width={900} nameSize={120} />
          </div>
          {early && (
            <Stage top={800} height={520} gap={34}>
              <Rise t={t} a={14.9} size={56} color={C.gray} font={INTER} weight={800} spacing={3}>Face au changement de l'IA</Rise>
              <svg width="900" height="170" viewBox="0 0 900 170">
                <path d={Array.from({ length: 91 }).map((_, i) => {
                  const x = i * 10;
                  const calm = prog(t, 17.6, 0.8);
                  const y = 85 + Math.sin(i * 0.5 - t * 7) * (60 * (1 - calm) + 6 * calm) * Math.min(1, i / 12);
                  return `${i ? "L" : "M"}${x} ${y}`;
                }).join(" ")} stroke={C.red} strokeWidth="9" fill="none" strokeLinecap="round" opacity={clamp01((t - 15.1) / 0.3)} />
              </svg>
              <div style={{ transform: `rotate(-7deg) scale(${0.2 + sp(t, 18.85, 9, 230) * 0.8})`, opacity: clamp01((t - 18.85) / 0.06) }}>
                <div style={{ border: `10px solid ${C.amber}`, color: C.amber, fontFamily: ANTON, fontSize: 150, padding: "6px 44px", borderRadius: 22, textTransform: "uppercase" }}>
                  100% gratuit
                </div>
              </div>
            </Stage>
          )}
          {!early && !late && (
            <Stage top={790} height={560} gap={0}>
              <Seal t={t} a={20.3} text="ANTHROPIC CERTIFIED" size={440} />
              <div style={{ marginTop: 6 }}><Slam t={t} a={20.6} size={104}>Anthropic <span style={{ color: C.red }}>Certified</span></Slam></div>
            </Stage>
          )}
          {late && (
            <Stage top={800} height={560} gap={0}>
              <div style={{ display: "flex", alignItems: "center", gap: 40, transform: "scale(0.92)" }}>
                <CVDoc t={t} a={21.3} />
                <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
                  <div style={{ transform: `scale(${0.2 + sp(t, 22.3, 9, 230) * 0.8})`, opacity: clamp01((t - 22.3) / 0.06) }}>
                    <Seal t={t} a={22.3} text="CERTIFIED" size={300} />
                  </div>
                  <Chip t={t} a={22.9} tone="red" icon={null} size={40}>Sur ton CV</Chip>
                  <Chip t={t} a={23.4} tone="amber" icon={null} size={40}>+ Prestations</Chip>
                </div>
              </div>
            </Stage>
          )}
        </>
      );
    }}
  </Scene>
);

/* ===== 5. GOOGLE PRO ML ENGINEER 24.6 → 36.0 ===== */
export const SceneML: React.FC = () => (
  <Scene from={24.6} to={36.0}>
    {(t) => {
      const intro = t < 29.4;
      return (
        <>
          {intro ? (
            <Stage gap={44}>
              <Kicker t={t} a={24.7}>Niveau 03</Kicker>
              <Slam t={t} a={25.7} size={150}>Niveau <span style={{ color: C.red }}>intermédiaire</span></Slam>
              <Gauge t={t} a={26.2} steps={4} filled={2} label="Progression" />
              <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 10 }}>
                <Chip t={t} a={26.9} icon="check">Google AI Essentials</Chip>
                <Chip t={t} a={27.5} icon="check">Anthropic Academy</Chip>
              </div>
              <Slam t={t} a={28.0} size={96} color={C.gray}>Passe à celle-là →</Slam>
            </Stage>
          ) : (
            <>
              <div style={{ position: "absolute", left: 90, top: 270 }}>
                <CertCard t={t} a={29.4} no="03" org="GOOGLE" name={["Professional", "ML Engineer"]} tag="Machine Learning Engineer" nameSize={118} />
              </div>
              <Stage top={800} height={520} gap={26}>
                <Rise t={t} a={32.0} size={40} color={C.gray} font={INTER} weight={800} spacing={2}>Les clés pour construire des modèles</Rise>
                <Network t={t} a={33.2} size={880} />
                <Chip t={t} a={35.5} tone="red" icon={null}>Google Cloud</Chip>
              </Stage>
            </>
          )}
        </>
      );
    }}
  </Scene>
);

/* ===== 6. AWS 36.0 → 42.0 ===== */
export const SceneAWS: React.FC = () => (
  <Scene from={36.0} to={42.0}>
    {(t) => (
      <Stage gap={20} top={230} height={1120}>
        <Kicker t={t} a={36.1}>Même niveau</Kicker>
        <CertCard t={t} a={36.3} no="03" org="GOOGLE" name={["Professional", "ML Engineer"]} nameSize={90} width={900} tone="plain" />
        <div style={{ width: 110, height: 110, borderRadius: 55, background: C.red, color: "#fff", fontFamily: ANTON, fontSize: 84, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${sp(t, 37.8, 10, 220)}) rotate(${(1 - sp(t, 37.8, 10, 220)) * 180}deg)`, boxShadow: "0 0 70px rgba(255,42,42,0.7)" }}>
          =
        </div>
        <CertCard t={t} a={38.4} no="03" org="AWS" name={["Certified ML", "Engineer Associate"]} nameSize={90} width={900} />
        <Slam t={t} a={40.55} size={80} color={C.white}>Presque la <span style={{ color: C.red }}>même chose</span></Slam>
      </Stage>
    )}
  </Scene>
);

/* ===== 7. MANAGING AI 42.0 → 49.9 ===== */
export const SceneManaging: React.FC = () => (
  <Scene from={42.0} to={49.9}>
    {(t) => {
      const lines: [string, number][] = [["Be a", 47.6], ["Certified", 47.9], ["Professional", 48.4], ["in Managing AI", 49.0]];
      const intro = t < 46.0;
      return intro ? (
        <Stage gap={44}>
          <Slam t={t} a={42.9} size={132} from={1.5} color={C.white}>Intermédiaire<span style={{ color: C.red }}>++</span></Slam>
          <Gauge t={t} a={43.4} steps={4} filled={3} label="Niveau supérieur" />
          <div style={{ display: "flex", gap: 24, height: 150, overflow: "hidden" }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ opacity: clamp01((t - (44.3 + i * 0.1)) / 0.1), transform: `translateY(${-((t * 140 + i * 90) % 280) + 140}px)` }}>
                <svg width="120" height="120" viewBox="0 0 100 100"><path d="M50 15L85 60H62V90H38V60H15Z" fill={C.red} /></svg>
              </div>
            ))}
          </div>
          <Slam t={t} a={44.55} size={100} from={1.4}>Niveau <span style={{ color: C.red }}>supérieur</span></Slam>
        </Stage>
      ) : (
        <Stage gap={36}>
          <Kicker t={t} a={46.0}>Niveau 04 · Certification</Kicker>
          <div style={{ padding: "50px 60px", borderRadius: 34, background: `linear-gradient(160deg, ${C.panel2}, ${C.panel})`, border: "2px solid rgba(255,42,42,0.75)", boxShadow: "0 0 90px rgba(255,42,42,0.28)", width: 900, opacity: clamp01((t - 46.1) / 0.15), transform: `translateY(${(1 - prog(t, 46.1, 0.6)) * 120}px)` }}>
            <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: C.red, marginBottom: 14 }}>04 · MANAGING AI</div>
            {lines.map(([l, a], i) => (
              <Rise key={i} t={t} a={a - 0.1} size={i === 3 ? 100 : 150} align="left" color={i === 3 ? C.red : C.white}>{l}</Rise>
            ))}
          </div>
        </Stage>
      );
    }}
  </Scene>
);

/* ===== 8. CHEFS DE PROJET 49.9 → 55.6 ===== */
export const SceneManagers: React.FC = () => (
  <Scene from={49.9} to={55.6}>
    {(t) => {
      const run = prog(t, 54.4, 1.0);
      return (
        <Stage gap={36}>
          <Kicker t={t} a={50.0}>Pensée pour</Kicker>
          <Chip t={t} a={51.5} icon="dot" tone="red" size={64}>Chefs de projet</Chip>
          <Chip t={t} a={52.45} icon="dot" tone="dark" size={52}>Responsables de programme</Chip>
          <div style={{ marginTop: 40, width: 880, opacity: clamp01((t - 53.9) / 0.2) }}>
            <Slam t={t} a={53.95} size={104}>Projets IA <span style={{ color: C.red }}>de A à Z</span></Slam>
            <div style={{ position: "relative", height: 90, marginTop: 24 }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: 44, height: 8, background: "rgba(255,255,255,0.12)", borderRadius: 4 }} />
              <div style={{ position: "absolute", left: 0, top: 44, height: 8, width: `${run * 100}%`, background: C.red, borderRadius: 4, boxShadow: "0 0 24px rgba(255,42,42,0.9)" }} />
              <div style={{ position: "absolute", left: 0, top: 0, fontFamily: ANTON, fontSize: 70, color: "#fff" }}>A</div>
              <div style={{ position: "absolute", right: 0, top: 0, fontFamily: ANTON, fontSize: 70, color: run > 0.98 ? C.red : "#fff" }}>Z</div>
              <div style={{ position: "absolute", top: 32, left: `calc(${run * 100}% - 16px)`, width: 32, height: 32, borderRadius: 16, background: "#fff", boxShadow: "0 0 30px #fff" }} />
            </div>
          </div>
        </Stage>
      );
    }}
  </Scene>
);

/* ===== 9. CTA 55.6 → fin ===== */
export const SceneCTA: React.FC<{ end: number }> = ({ end }) => (
  <Scene from={55.6} to={end}>
    {(t) => (
      <Stage gap={50}>
        <Slam t={t} a={55.75} size={150}>N'attends <span style={{ color: C.red }}>pas</span></Slam>
        <div style={{ opacity: clamp01((t - 57.0) / 0.2), display: "flex", gap: 16 }}>
          {["01", "02", "03", "04"].map((n, i) => (
            <div key={n} style={{ transform: `scale(${sp(t, 57.0 + i * 0.12, 11, 230)})`, width: 150, height: 150, borderRadius: 30, background: i === 3 ? C.red : C.panel2, color: "#fff", fontFamily: ANTON, fontSize: 90, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid rgba(255,255,255,0.12)" }}>{n}</div>
          ))}
        </div>
        <Bubble t={t} a={58.3} />
        <Slam t={t} a={59.1} size={92} color={C.gray}>Dis-le en commentaire</Slam>
      </Stage>
    )}
  </Scene>
);

/* ===== HUD ===== */
export const Hud: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const step = t < 13.0 ? 1 : t < 24.6 ? 2 : t < 42.0 ? 3 : 4;
  const show = t > 3.4 && t < 55.4;
  const labels = ["Essentials", "Anthropic", "ML Engineer", "Managing AI"];
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: 118, opacity: show ? clamp01((t - 3.4) / 0.3) * clamp01((55.4 - t) / 0.3) : 0 }}>
      <div style={{ display: "flex", gap: 12 }}>
        {labels.map((l, i) => (
          <div key={l} style={{ flex: 1 }}>
            <div style={{ height: 8, borderRadius: 4, background: i < step ? C.red : "rgba(255,255,255,0.14)", boxShadow: i === step - 1 ? "0 0 18px rgba(255,42,42,0.9)" : "none" }} />
            <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 20, letterSpacing: 3, marginTop: 10, color: i === step - 1 ? "#fff" : "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
