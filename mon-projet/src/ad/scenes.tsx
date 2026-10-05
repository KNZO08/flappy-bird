import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { Avatar, Bolt, Bubble, ChannelGlyph, Dots, GRAD, GradText, IcoCal, JK, K, LINES, Logo, Phone, Pill, REDGRAD, Rise, Sparks, at, clamp01, prog, rnd, sp } from "./kit";

const FPS = 30;
type R = (t: number) => React.ReactNode;

/* frontières de scènes = milieu des pauses de la voix */
const mid = (i: number) => (LINES[i - 1].e + LINES[i].s) / 2;
export const B = [0, mid(1), mid(2), mid(3), mid(4), mid(5)];

export const Scene: React.FC<{ i: number; end: number; children: R }> = ({ i, end, children }) => {
  const from = B[i], to = i + 1 < B.length ? B[i + 1] : end;
  return (
    <Sequence from={Math.round(from * FPS)} durationInFrames={Math.round((to - from) * FPS)}>
      <Inner from={from} to={to} first={i === 0}>{children}</Inner>
    </Sequence>
  );
};
const Inner: React.FC<{ from: number; to: number; first: boolean; children: R }> = ({ from, to, first, children }) => {
  const t = from + useCurrentFrame() / FPS;
  const inn = first ? 1 : prog(t, from, 0.26);
  const out = 1 - prog(t, to - 0.12, 0.12);
  const flash = first ? 0 : 1 - prog(t, from, 0.35);
  return (
    <AbsoluteFill style={{ opacity: clamp01(inn * 3) * out, transform: `scale(${(1.14 - 0.14 * inn) * (1 - (1 - out) * 0.06)})`, filter: `blur(${(1 - inn) * 16}px)` }}>
      {children(t)}
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,90,60,0.55), transparent 70%)", opacity: flash }} />
    </AbsoluteFill>
  );
};

const Abs: React.FC<{ x?: number | string; y?: number | string; w?: number | string; children: React.ReactNode; z?: number; style?: React.CSSProperties }> = ({ x = 0, y = 0, w, children, z, style }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, zIndex: z, ...style }}>{children}</div>
);
const Center: React.FC<{ y: number; children: React.ReactNode; z?: number }> = ({ y, children, z }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", zIndex: z }}>{children}</div>
);

/* =================== A · HOOK =================== */
const NOTIFS: [string, string][] = [
  ["Léo", "C'est combien ton accompagnement ?"], ["Sarah M.", "Dispo cette semaine ?"], ["Karim", "Je veux plus d'infos 🙏"],
  ["Julie", "Tu peux m'appeler ?"], ["Mehdi", "Salut, j'ai vu ta story"], ["Inès", "Ça marche pour les débutants ?"],
  ["Tom", "Je suis intéressé !"], ["Lina", "Tu fais des places ce mois-ci ?"], ["Yanis", "Il y a un tarif ?"],
  ["Emma", "Comment on commence ?"], ["Hugo", "Je t'ai écrit hier…"], ["Zoé", "Toujours des places ?"],
  ["Nora", "Je veux rejoindre !"], ["Adam", "Salut, tu peux m'aider ?"],
];
export const SceneHook: React.FC<{ end: number }> = ({ end }) => {
  const deb = at("débordent"), agenda = at("agenda"), vide = at("vide");
  return (
    <Scene i={0} end={end}>
      {(t) => {
        const sweep = prog(t, agenda - 0.12, 0.3);
        const count = Math.min(99, Math.floor(prog(t, 0.1, 1.4) * 99));
        return (
          <>
            {NOTIFS.map(([n, m], i) => {
              const a = 0.04 + i * 0.07;
              const p = sp(t, a, 14, 240);
              const dir = i % 2 ? 1 : -1;
              return (
                <Abs key={i} x={60 + (rnd(i + 2) - 0.5) * 70} y={70 + i * 122} w={940} z={i}
                  style={{ opacity: clamp01(p * 3) * (1 - sweep), transform: `translate(${(1 - p) * -dir * 500 + sweep * dir * 1400}px,0) rotate(${(rnd(i) - 0.5) * 5}deg) scale(${0.9 + p * 0.1})` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 26, padding: "20px 30px", borderRadius: 36, background: "rgba(26,26,32,0.97)", border: `2px solid ${K.line}`, boxShadow: "0 20px 50px rgba(0,0,0,0.6)" }}>
                    <Avatar txt={n[0]} size={86} hue={(i * 47) % 360} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: JK, fontWeight: 800, fontSize: 36, color: "#fff" }}>{n}</div>
                      <div style={{ fontFamily: JK, fontWeight: 500, fontSize: 30, color: K.gray }}>{m}</div>
                    </div>
                    <div style={{ width: 26, height: 26, borderRadius: 13, background: K.red2, boxShadow: "0 0 24px #FF3D4F" }} />
                  </div>
                </Abs>
              );
            })}
            {/* compteur */}
            <Abs x={800} y={60} z={50} style={{ opacity: 1 - sweep, transform: `scale(${sp(t, 0.15, 10, 260) * (1 + Math.sin(t * 22) * 0.04)})` }}>
              <div style={{ minWidth: 200, height: 200, borderRadius: 100, background: REDGRAD, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: JK, fontWeight: 800, fontSize: 92, color: "#fff", boxShadow: "0 0 90px rgba(255,45,70,0.8)", padding: "0 30px" }}>
                {count >= 99 ? "99+" : count}
              </div>
            </Abs>
            {/* voile + titre 1 */}
            <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 42%, rgba(10,10,12,0.93) 0%, rgba(10,10,12,0.78) 38%, transparent 72%)", zIndex: 60, opacity: 1 - sweep }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 640, zIndex: 70, opacity: 1 - sweep, transform: `scale(${1 + (t - deb) * 0.05})` }}>
              <Rise t={t} a={0.06} size={170}>Tes DMs</Rise>
              <Rise t={t} a={deb - 0.05} size={170}>débordent.</Rise>
            </div>
            {/* phase 2 : agenda vide */}
            <Abs x={0} y={0} w={1080} z={80} style={{ opacity: prog(t, agenda - 0.05, 0.15) }}>
              <div style={{ marginTop: 250 }}>
                <Rise t={t} a={agenda - 0.05} size={150}>Ton agenda</Rise>
                <Rise t={t} a={vide - 0.15} size={150}><GradText>reste vide.</GradText></Rise>
              </div>
              <Center y={650}>
                <div style={{ width: 900, padding: 40, borderRadius: 44, background: K.panel, border: `2px solid ${K.line}`, transform: `translateY(${(1 - prog(t, agenda, 0.45)) * 160}px) scale(${0.92 + 0.08 * prog(t, agenda, 0.45)})` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: JK, fontWeight: 800, fontSize: 40, color: "#fff", marginBottom: 26 }}>
                    <span>Agenda</span><span style={{ color: K.gray, fontWeight: 500 }}>Cette semaine</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 14 }}>
                    {Array.from({ length: 28 }).map((_, i) => (
                      <div key={i} style={{ height: 92, borderRadius: 20, background: "rgba(255,255,255,0.05)", border: `2px solid ${K.line}`, opacity: clamp01((t - agenda - i * 0.012) / 0.1) }} />
                    ))}
                  </div>
                  <div style={{ textAlign: "center", marginTop: 34, fontFamily: JK, fontWeight: 800, fontSize: 70, opacity: prog(t, vide, 0.2) }}><GradText>0 RDV</GradText></div>
                </div>
              </Center>
            </Abs>
          </>
        );
      }}
    </Scene>
  );
};

/* =================== B · EZSET + MODE AUTO =================== */
export const SceneAuto: React.FC<{ end: number }> = ({ end }) => {
  const ez = at("EzSet"), repond = at("répond"), qualifie = at("qualifie"), seule = at("toute");
  const up = ez + 0.6;
  const tm1 = up + 0.45, tm2 = Math.max(repond + 0.3, tm1 + 0.85), tm3 = tm2 + 0.8;
  return (
    <Scene i={1} end={end}>
      {(t) => {
        const burst = sp(t, ez - 0.05, 10, 190);
        const mv = prog(t, up - 0.1, 0.5);
        const logoY = 800 - mv * 690, logoS = 1 - mv * 0.62;
        const phoneP = sp(t, up, 15, 120);
        return (
          <>
            <Abs x={0} y={0} w={1080}>
              <div style={{ position: "absolute", left: 0, right: 0, top: logoY - 130, display: "flex", justifyContent: "center", zIndex: 40, opacity: clamp01(burst * 2), transform: `scale(${logoS * (0.3 + burst * 0.7)})` }}>
                <Logo size={230} />
              </div>
              {t >= ez - 0.05 && t < up + 0.5 && (
                <div style={{ position: "absolute", left: 540, top: 800 }}><Sparks t={t} a={ez - 0.05} n={22} r={460} /></div>
              )}
              {/* onde de choc */}
              <div style={{ position: "absolute", left: 540 - 400, top: 800 - 400, width: 800, height: 800, borderRadius: "50%", border: `8px solid ${K.red2}`, opacity: (1 - prog(t, ez - 0.05, 0.7)) * 0.8, transform: `scale(${0.2 + prog(t, ez - 0.05, 0.7) * 1.6})` }} />
            </Abs>
            <Center y={250 + (1 - phoneP) * 1800}>
              <div style={{ position: "relative", transform: `rotate(${(1 - phoneP) * 6}deg)` }}>
                <Phone>
                  <Bubble t={t} a={tm1} side="l">Salut, ton accompagnement, c'est combien ?</Bubble>
                  <Dots t={t} a={tm1 + 0.35} b={tm2} />
                  <Bubble t={t} a={tm2} side="r" glow>Ça dépend de ton point de départ. Tu en es où aujourd'hui ?</Bubble>
                  <div style={{ alignSelf: "flex-end", marginTop: -10, display: "flex", alignItems: "center", gap: 10, opacity: prog(t, tm2 + 0.2, 0.3), fontFamily: JK, fontWeight: 700, fontSize: 24, color: K.orange }}>
                    <Bolt size={24} color={K.orange} /> Réponse IA · automatique
                  </div>
                  <Bubble t={t} a={tm3} side="l">Je gère 40 clients à la main, le suivi me tue</Bubble>
                </Phone>
                <Abs x={-150} y={870} z={5}>
                  <Pill t={t} a={repond} tint={K.green} label="Mode automatique" value="ON ✓" scale={0.92} icon={<Bolt size={36} color={K.green} />} />
                </Abs>
                <Abs x={210} y={990} z={5}>
                  <Pill t={t} a={qualifie} tint={K.orange} label="Prospect chaud" value="94 sur 100" scale={0.95} icon={<Bolt size={36} color={K.orange} />} />
                </Abs>
              </div>
            </Center>
            <div style={{ position: "absolute", left: 0, right: 0, top: 1385, display: "flex", justifyContent: "center", opacity: prog(t, seule, 0.2) }}>
              <div style={{ transform: `scale(${sp(t, seule, 9, 240)}) rotate(-4deg)`, padding: "12px 44px", borderRadius: 26, background: GRAD, fontFamily: JK, fontWeight: 800, fontSize: 56, color: "#fff", letterSpacing: 4, boxShadow: "0 0 60px rgba(255,80,60,0.6)" }}>100 % AUTO</div>
            </div>
          </>
        );
      }}
    </Scene>
  );
};

/* =================== C · LES CALLS =================== */
export const SceneCalls: React.FC<{ end: number }> = ({ end }) => {
  const toi = at("Toi"), juste = at("juste"), calls = at("calls");
  return (
    <Scene i={2} end={end}>
      {(t) => {
        const slots: [string, string, number][] = [["10 h", "Camille L.", toi + 0.15], ["14 h", "Karim B.", juste - 0.05], ["16 h", "Sarah M.", juste + 0.3]];
        const ok = sp(t, calls - 0.05, 10, 220);
        return (
          <>
            <Abs x={0} y={190} w={1080}>
              <Rise t={t} a={toi} size={140}>Toi, tu fais</Rise>
              <Rise t={t} a={juste - 0.05} size={140}>juste les <GradText>calls.</GradText></Rise>
            </Abs>
            <Center y={620}>
              <div style={{ width: 900, padding: "40px 40px 46px", borderRadius: 48, background: K.panel, border: `2px solid ${K.line}`, boxShadow: "0 40px 100px rgba(0,0,0,0.7)", transform: `translateY(${(1 - prog(t, toi, 0.5)) * 220}px)`, opacity: clamp01(prog(t, toi, 0.3) * 2) }}>
                <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 28 }}>
                  <IcoCal s={54} c={K.red2} />
                  <div style={{ fontFamily: JK, fontWeight: 800, fontSize: 48, color: "#fff" }}>Demain</div>
                </div>
                {slots.map(([h, n, a], i) => {
                  const p = sp(t, a, 13, 230), hot = i === 1;
                  return (
                    <div key={h} style={{ display: "flex", alignItems: "center", gap: 28, height: 150, marginBottom: 18, padding: "0 32px", borderRadius: 30, background: hot && ok > 0.05 ? "rgba(47,208,138,0.12)" : "rgba(255,255,255,0.04)", border: `3px solid ${hot && ok > 0.05 ? K.green : K.line}` }}>
                      <div style={{ fontFamily: JK, fontWeight: 800, fontSize: 52, color: K.gray, width: 130 }}>{h}</div>
                      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 22, opacity: clamp01(p * 2), transform: `translateX(${(1 - p) * 120}px)` }}>
                        <Avatar txt={n[0]} size={78} hue={[0, 210, 150][i]} />
                        <div>
                          <div style={{ fontFamily: JK, fontWeight: 800, fontSize: 42, color: "#fff" }}>{n}</div>
                          <div style={{ fontFamily: JK, fontWeight: 500, fontSize: 28, color: K.gray }}>Appel découverte · qualifié</div>
                        </div>
                      </div>
                      {hot && (
                        <div style={{ transform: `scale(${ok})` }}>
                          <svg width="74" height="74" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill={K.green} /><path d="M6.5 12.5l3.6 3.6 7.4-8" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Center>
            <Center y={1290}>
              <Pill t={t} a={calls} tint={K.green} label="RDV confirmé" value="demain, 14 h" icon={<IcoCal s={40} c={K.green} />} />
            </Center>
          </>
        );
      }}
    </Scene>
  );
};

/* =================== D · TEAM + TOUTES LES CONVERSATIONS =================== */
const TEAM: [string, number][] = [["Léa", 330], ["Tom", 210], ["Inès", 150]];
const ROWS: [string, string, "ig" | "ms" | "wa"][] = [
  ["Camille L.", "Tu es dispo demain à 14 h ?", "ig"], ["Karim B.", "Ok, envoie-moi le lien", "wa"], ["Sarah M.", "Je veux en savoir plus", "ms"],
  ["Léo D.", "C'est combien ?", "ig"],
];
export const SceneTeam: React.FC<{ end: number }> = ({ end }) => {
  const besoin = at("Besoin"), ajoute = at("Ajoute"), setters = at("setters"), voient = at("voient");
  const insta = at("Instagram"), mess = at("Messenger"), wa = at("WhatsApp");
  const chan: [string, "ig" | "ms" | "wa", number][] = [["Instagram", "ig", insta], ["Messenger", "ms", mess], ["WhatsApp", "wa", wa]];
  return (
    <Scene i={3} end={end}>
      {(t) => {
        const hOut = prog(t, ajoute + 0.1, 0.25);
        const click = sp(t, setters - 0.15, 12, 300);
        return (
          <>
            {/* "Besoin d'aide ?" + bouton ajouter */}
            <Abs x={0} y={380} w={1080} style={{ opacity: 1 - hOut, transform: `translateY(${-hOut * 80}px)` }}>
              <Rise t={t} a={besoin} size={150}>Besoin</Rise>
              <Rise t={t} a={besoin + 0.12} size={150}><GradText>d'aide ?</GradText></Rise>
            </Abs>
            {/* équipe */}
            <Center y={260}>
              <div style={{ display: "flex", gap: 22 }}>
                {TEAM.map(([n, hue], i) => {
                  const p = sp(t, setters - 0.2 + i * 0.14, 12, 220);
                  return (
                    <div key={n} style={{ width: 280, padding: "28px 0 30px", borderRadius: 40, background: K.panel, border: `2px solid ${K.line}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, opacity: clamp01(p * 2) * prog(t, ajoute, 0.1), transform: `translateY(${(1 - p) * -260}px) scale(${0.7 + p * 0.3})`, boxShadow: "0 25px 60px rgba(0,0,0,0.55)" }}>
                      <Avatar txt={n[0]} size={130} hue={hue} />
                      <div style={{ fontFamily: JK, fontWeight: 800, fontSize: 42, color: "#fff" }}>{n}</div>
                      <div style={{ fontFamily: JK, fontWeight: 700, fontSize: 24, letterSpacing: 3, color: K.red2, padding: "6px 18px", borderRadius: 14, background: "rgba(255,61,79,0.14)" }}>SETTER</div>
                    </div>
                  );
                })}
              </div>
            </Center>
            {/* bouton "+ ajouter" */}
            <Center y={440}>
              <div style={{ opacity: prog(t, ajoute - 0.1, 0.2) * (1 - prog(t, setters + 0.1, 0.2)), transform: `scale(${1 - click * 0.08 + 0.0})`, padding: "30px 60px", borderRadius: 40, background: REDGRAD, fontFamily: JK, fontWeight: 800, fontSize: 56, color: "#fff", boxShadow: "0 0 70px rgba(255,45,70,0.55)" }}>
                + Ajouter un setter
              </div>
            </Center>
            {/* liaison équipe → boîte */}
            <svg width="1080" height="1920" style={{ position: "absolute", left: 0, top: 0 }}>
              {[240, 540, 840].map((x, i) => (
                <path key={i} d={`M${x} 600 C ${x} 680, 540 670, 540 740`} stroke="url(#lg)" strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray="520" strokeDashoffset={520 * (1 - prog(t, voient - 0.1 + i * 0.08, 0.5))} />
              ))}
              <defs><linearGradient id="lg" x1="0" x2="1"><stop offset="0" stopColor="#FF2D55" /><stop offset="1" stopColor="#FF7A2F" /></linearGradient></defs>
            </svg>
            {/* boîte partagée */}
            <Center y={740}>
              <div style={{ width: 940, borderRadius: 48, background: K.panel, border: `2px solid ${K.line}`, overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,0.7)", opacity: clamp01(prog(t, voient - 0.2, 0.3) * 2), transform: `translateY(${(1 - prog(t, voient - 0.2, 0.55)) * 260}px) scale(${0.94 + 0.06 * prog(t, voient - 0.2, 0.55)})` }}>
                <div style={{ padding: "30px 34px 22px", borderBottom: `2px solid ${K.line}` }}>
                  <div style={{ fontFamily: JK, fontWeight: 800, fontSize: 40, color: "#fff", marginBottom: 20 }}>Boîte partagée</div>
                  <div style={{ display: "flex", gap: 16 }}>
                    {chan.map(([n, k, a]) => {
                      const p = sp(t, a, 10, 260);
                      const on = t >= a - 0.02;
                      return (
                        <div key={n} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 22px", borderRadius: 22, background: on ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)", border: `2px solid ${on ? "rgba(255,255,255,0.4)" : K.line}`, transform: `scale(${on ? 1 + (1 - p) * 0.15 + 0.04 : 1})` }}>
                          <ChannelGlyph kind={k} size={48} />
                          <span style={{ fontFamily: JK, fontWeight: 700, fontSize: 30, color: on ? "#fff" : K.gray }}>{n}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {ROWS.map(([n, m, k], i) => {
                  const ca = chan.find((c) => c[1] === k)![2];
                  const flash = clamp01(1 - (t - ca) / 0.5) * (t >= ca ? 1 : 0);
                  const p = sp(t, voient + i * 0.14, 14, 220);
                  return (
                    <div key={n} style={{ display: "flex", alignItems: "center", gap: 24, padding: "0 34px", height: 118, borderBottom: `2px solid ${K.line}`, background: `rgba(255,90,70,${flash * 0.18})`, opacity: clamp01(p * 2), transform: `translateX(${(1 - p) * 160}px)` }}>
                      <Avatar txt={n[0]} size={72} hue={i * 70 + 10} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: JK, fontWeight: 800, fontSize: 34, color: "#fff" }}>{n}</div>
                        <div style={{ fontFamily: JK, fontWeight: 500, fontSize: 27, color: K.gray }}>{m}</div>
                      </div>
                      <ChannelGlyph kind={k} size={52} />
                    </div>
                  );
                })}
              </div>
            </Center>
          </>
        );
      }}
    </Scene>
  );
};

/* =================== E · L'IA SOUFFLE, ILS CORRIGENT, ELLE APPREND =================== */
const SUGG = "Ok, c'est le suivi qui coince. Tu es dispo demain à ";
export const SceneLearn: React.FC<{ end: number }> = ({ end }) => {
  const ia = at("L'IA", 13), souffle = at("souffle", 13), repondre = at("répondre", 13), corr = at("corrigent", 13), apprend = at("apprend", 13);
  return (
    <Scene i={4} end={end}>
      {(t) => {
        const typed = Math.floor(clamp01((t - souffle) / Math.max(0.5, repondre + 0.3 - souffle)) * SUGG.length);
        const edit = prog(t, corr, 0.25);
        const newT = Math.floor(clamp01((t - corr - 0.35) / 0.35) * 5);
        const learn = prog(t, apprend - 0.05, 0.8);
        const done = sp(t, apprend + 0.55, 10, 220);
        return (
          <>
            <Abs x={90} y={250} w={900}>
              <Bubble t={t} a={ia} side="l" size={40}>Je gère 40 clients à la main, le suivi me tue</Bubble>
            </Abs>
            <Center y={560}>
              <div style={{ width: 920, padding: "34px 40px 38px", borderRadius: 48, background: K.panel, border: `4px solid ${K.red2}`, boxShadow: `0 0 ${60 + learn * 60}px rgba(255,45,70,${0.35 + learn * 0.3})`, opacity: clamp01(prog(t, souffle - 0.2, 0.25) * 2), transform: `translateY(${(1 - prog(t, souffle - 0.2, 0.5)) * 200}px) scale(${1 + done * 0.02})` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 26 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 24px", borderRadius: 20, background: REDGRAD, fontFamily: JK, fontWeight: 800, fontSize: 32, color: "#fff" }}>
                    <Bolt size={32} /> Suggestion IA
                  </div>
                  {t >= corr && t < apprend && (
                    <div style={{ fontFamily: JK, fontWeight: 700, fontSize: 30, color: K.amber, opacity: edit }}>✎ Modifié par le setter</div>
                  )}
                </div>
                <div style={{ fontFamily: JK, fontWeight: 600, fontSize: 52, lineHeight: 1.3, color: "#fff", minHeight: 200 }}>
                  {SUGG.slice(0, typed)}
                  {typed >= SUGG.length && (
                    <>
                      <span style={{ position: "relative", color: t >= corr ? K.gray : "#fff", textDecoration: t >= corr + 0.1 ? "line-through" : "none", textDecorationColor: K.red2, textDecorationThickness: 5 }}>14 h</span>
                      {t >= corr + 0.3 && <span style={{ marginLeft: 16, padding: "0 14px", borderRadius: 14, background: "rgba(47,208,138,0.18)", color: K.green, fontWeight: 800 }}>{"16 h".slice(0, newT)}</span>}
                      <span style={{ opacity: Math.floor(t * 3) % 2 ? 0 : 1, color: K.red2 }}> ?|</span>
                    </>
                  )}
                </div>
                <div style={{ display: "flex", gap: 18, marginTop: 24 }}>
                  <div style={{ padding: "16px 36px", borderRadius: 22, background: "rgba(255,255,255,0.08)", fontFamily: JK, fontWeight: 700, fontSize: 34, color: "#fff", transform: `scale(${t >= corr - 0.05 && t < corr + 0.2 ? 0.92 : 1})` }}>Modifier</div>
                  <div style={{ padding: "16px 36px", borderRadius: 22, background: REDGRAD, fontFamily: JK, fontWeight: 800, fontSize: 34, color: "#fff" }}>Envoyer</div>
                </div>
              </div>
            </Center>
            {/* l'IA apprend */}
            <Center y={1090}>
              <div style={{ width: 920, padding: "30px 40px", borderRadius: 40, background: "rgba(24,24,29,0.96)", border: `2px solid ${K.line}`, opacity: prog(t, apprend - 0.1, 0.2), transform: `translateY(${(1 - prog(t, apprend - 0.1, 0.4)) * 120}px)` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
                  <div style={{ fontFamily: JK, fontWeight: 800, fontSize: 42, color: "#fff", display: "flex", alignItems: "center", gap: 16 }}>
                    <Bolt size={44} color={K.orange} /> L'IA apprend de toi
                  </div>
                  <div style={{ transform: `scale(${done})`, display: "flex", alignItems: "center", gap: 12, fontFamily: JK, fontWeight: 800, fontSize: 36, color: K.green }}>
                    <svg width="46" height="46" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill={K.green} /><path d="M6.5 12.5l3.6 3.6 7.4-8" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    Appris
                  </div>
                </div>
                <div style={{ height: 26, borderRadius: 13, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                  <div style={{ width: `${learn * 100}%`, height: "100%", background: GRAD, boxShadow: "0 0 30px rgba(255,90,60,0.8)" }} />
                </div>
              </div>
            </Center>
            {t >= apprend + 0.5 && <div style={{ position: "absolute", left: 540, top: 1150 }}><Sparks t={t} a={apprend + 0.5} n={22} r={420} /></div>}
          </>
        );
      }}
    </Scene>
  );
};

/* =================== F · CTA =================== */
export const SceneCTA: React.FC<{ end: number }> = ({ end }) => {
  const ez = at("EzSet", 17), cree = at("Crée", 17);
  return (
    <Scene i={5} end={end}>
      {(t) => {
        const p = sp(t, ez - 0.1, 11, 170);
        const click = t >= cree + 0.55 && t < cree + 0.75;
        const cur = prog(t, cree - 0.1, 0.7);
        return (
          <>
            <AbsoluteFill style={{ background: `radial-gradient(700px 700px at 50% 900px, rgba(255,60,60,${0.35 + 0.1 * Math.sin(t * 4)}), transparent 70%)` }} />
            <Center y={470}>
              <div style={{ transform: `scale(${0.3 + p * 0.7})`, opacity: clamp01(p * 2) }}><Logo size={260} /></div>
            </Center>
            {t >= ez - 0.1 && <div style={{ position: "absolute", left: 540, top: 600 }}><Sparks t={t} a={ez - 0.1} n={20} r={480} /></div>}
            <Center y={850}>
              <div style={{ opacity: prog(t, ez + 0.25, 0.3), transform: `translateY(${(1 - prog(t, ez + 0.25, 0.5)) * 40}px)`, display: "inline-flex", alignItems: "center", gap: 14, padding: "18px 38px", borderRadius: 40, background: "rgba(24,24,29,0.95)", border: `2px solid ${K.line}`, fontFamily: JK, fontWeight: 700, fontSize: 36, color: "#fff" }}>
                <div style={{ width: 14, height: 14, borderRadius: 7, background: K.red2 }} /> Pour les infopreneurs et leurs setters
              </div>
            </Center>
            <Center y={1040}>
              <div style={{ position: "relative", opacity: prog(t, cree - 0.2, 0.3), transform: `scale(${(0.85 + 0.15 * prog(t, cree - 0.2, 0.5)) * (click ? 0.94 : 1 + 0.015 * Math.sin(t * 8))})` }}>
                <div style={{ padding: "38px 90px", borderRadius: 50, background: REDGRAD, fontFamily: JK, fontWeight: 800, fontSize: 72, color: "#fff", boxShadow: "0 0 100px rgba(255,45,70,0.7), 0 20px 60px rgba(0,0,0,0.5)" }}>Créer un compte</div>
                {t >= cree + 0.55 && <div style={{ position: "absolute", left: "50%", top: "50%", width: 400, height: 400, marginLeft: -200, marginTop: -200, borderRadius: "50%", border: "6px solid #fff", opacity: 1 - prog(t, cree + 0.55, 0.5), transform: `scale(${prog(t, cree + 0.55, 0.5) * 1.6})` }} />}
                <svg width="110" height="110" viewBox="0 0 24 24" style={{ position: "absolute", left: 480 + (1 - cur) * 360, top: 90 + (1 - cur) * 300, opacity: clamp01(cur * 3), filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.7))" }}>
                  <path d="M5 3l14 8.2-6.2 1.6L9.6 19z" fill="#fff" stroke="#111" strokeWidth="1.2" strokeLinejoin="round" />
                </svg>
              </div>
            </Center>
          </>
        );
      }}
    </Scene>
  );
};
