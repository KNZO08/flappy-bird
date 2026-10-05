import React from "react";
import { continueRender, delayRender, staticFile } from "remotion";
import tl from "../data/ad_timeline.json";
import { clamp01, prog, rnd, sp } from "../theme";

/* ---------- polices ---------- */
const h = delayRender("ad-fonts");
Promise.all(
  [500, 700, 800].map((w) => {
    const f = new FontFace("Jakarta", `url(${staticFile(`jakarta-${w}.woff2`)})`, { weight: String(w) });
    return f.load().then(() => document.fonts.add(f));
  }),
).then(() => continueRender(h));
export const JK = "'Jakarta', system-ui, sans-serif";

/* ---------- charte EzSet ---------- */
export const K = {
  bg: "#0A0A0C", panel: "#16161A", panel2: "#1E1E24", line: "rgba(255,255,255,0.09)",
  red: "#F0263A", red2: "#FF3D4F", orange: "#FF7A2F", white: "#F7F7F8", gray: "#A3A3AD",
  green: "#2FD08A", amber: "#F5B73B", blue: "#2D8CFF",
};
export const GRAD = "linear-gradient(90deg,#FF2D55 0%,#FF7A2F 100%)";
export const REDGRAD = "linear-gradient(135deg,#FF3D4F,#E01E37)";

/* ---------- timings de la voix ---------- */
export const norm = (s: string) => s.toLowerCase().replace(/[^a-zàâçéèêëîïôûùüÿœ0-9+']/g, "");
export const at = (q: string, after = 0) =>
  tl.words.find((w) => w.s >= after - 0.001 && norm(w.w).startsWith(norm(q)))?.s ?? after;
export const LINES = tl.lines;
export const VOICE_END = tl.duration;

/* ---------- briques ---------- */
export const GradText: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <span style={{ background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", ...style }}>{children}</span>
);

export const Bolt: React.FC<{ size: number; color?: string }> = ({ size, color = "#fff" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}><path d="M13.6 2 5 13.4h5.6L9.6 22l9.2-12.2h-5.7z" fill={color} /></svg>
);

export const Logo: React.FC<{ size: number; word?: boolean }> = ({ size, word = true }) => (
  <div style={{ display: "flex", alignItems: "center", gap: size * 0.22 }}>
    <div style={{ width: size, height: size, borderRadius: size * 0.28, background: REDGRAD, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 ${size * 0.6}px rgba(255,45,70,0.55)` }}>
      <Bolt size={size * 0.56} />
    </div>
    {word && (
      <div style={{ fontFamily: JK, fontWeight: 800, fontSize: size * 0.72, letterSpacing: -size * 0.02, color: K.white }}>
        Ez<span style={{ color: K.red2 }}>Set</span>
      </div>
    )}
  </div>
);

export const Avatar: React.FC<{ txt: string; size?: number; hue?: number }> = ({ txt, size = 80, hue = 0 }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", flex: "none", background: hue ? `hsl(${hue} 70% 55%)` : "linear-gradient(135deg,#FF3D4F,#FF7A2F)", color: "#fff", fontFamily: JK, fontWeight: 800, fontSize: size * 0.38, display: "flex", alignItems: "center", justifyContent: "center" }}>{txt}</div>
);

/** Bulle de chat qui pop. side l = prospect (sombre), r = IA / toi (rouge) */
export const Bubble: React.FC<{ t: number; a: number; side: "l" | "r"; children: React.ReactNode; size?: number; glow?: boolean }> = ({ t, a, side, children, size = 34, glow }) => {
  const p = sp(t, a, 13, 230);
  return (
    <div style={{ display: "flex", justifyContent: side === "l" ? "flex-start" : "flex-end", opacity: clamp01(p * 2.5) }}>
      <div style={{
        maxWidth: "78%", padding: "22px 28px", borderRadius: 34, fontFamily: JK, fontWeight: 600, fontSize: size, lineHeight: 1.28, color: "#fff",
        background: side === "l" ? K.panel2 : REDGRAD, borderBottomLeftRadius: side === "l" ? 10 : 34, borderBottomRightRadius: side === "r" ? 10 : 34,
        transform: `scale(${0.6 + p * 0.4}) translateY(${(1 - p) * 40}px)`, transformOrigin: side === "l" ? "0 100%" : "100% 100%",
        boxShadow: glow ? "0 0 60px rgba(255,45,70,0.55)" : "0 10px 30px rgba(0,0,0,0.35)",
      }}>{children}</div>
    </div>
  );
};

export const Dots: React.FC<{ t: number; a: number; b: number; side?: "l" | "r" }> = ({ t, a, b, side = "r" }) => {
  if (t < a || t > b) return null;
  return (
    <div style={{ display: "flex", justifyContent: side === "l" ? "flex-start" : "flex-end" }}>
      <div style={{ display: "flex", gap: 10, padding: "24px 30px", borderRadius: 34, background: side === "l" ? K.panel2 : REDGRAD }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 16, height: 16, borderRadius: 8, background: "#fff", opacity: 0.4 + 0.6 * ((Math.sin((t - a) * 14 - i * 1.1) + 1) / 2) }} />
        ))}
      </div>
    </div>
  );
};

export const IcoCal: React.FC<{ s: number; c: string }> = ({ s, c }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="5" width="17" height="15.5" rx="3" /><path d="M8 3v4M16 3v4M3.5 10h17M9 15.2l2 2 4-4" /></svg>
);
export const IcoClock: React.FC<{ s: number; c: string }> = ({ s, c }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);

/** badge flottant façon site : icône + libellé gris + valeur blanche */
export const Pill: React.FC<{ t: number; a: number; icon: React.ReactNode; tint: string; label: string; value: string; scale?: number; from?: number }> = ({ t, a, icon, tint, label, value, scale = 1, from = 60 }) => {
  const p = sp(t, a, 12, 210);
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 20, padding: "20px 34px 20px 22px", borderRadius: 30, background: "rgba(24,24,29,0.96)", border: `2px solid ${K.line}`, boxShadow: "0 20px 60px rgba(0,0,0,0.6)", opacity: clamp01(p * 2.5), transform: `translateY(${(1 - p) * from}px) scale(${(0.7 + p * 0.3) * scale})` }}>
      <div style={{ width: 70, height: 70, borderRadius: "50%", background: tint + "26", display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
      <div>
        <div style={{ fontFamily: JK, fontWeight: 500, fontSize: 28, color: K.gray }}>{label}</div>
        <div style={{ fontFamily: JK, fontWeight: 800, fontSize: 40, color: "#fff" }}>{value}</div>
      </div>
    </div>
  );
};

/** téléphone */
export const Phone: React.FC<{ children: React.ReactNode; header?: boolean; w?: number; h?: number }> = ({ children, header = true, w = 640, h = 1120 }) => (
  <div style={{ width: w, height: h, borderRadius: 96, border: "6px solid rgba(255,255,255,0.16)", background: "#0E0E11", position: "relative", overflow: "hidden", boxShadow: "0 0 140px rgba(255,45,70,0.25), 0 50px 120px rgba(0,0,0,0.7)" }}>
    <div style={{ position: "absolute", left: "50%", top: 22, width: 150, height: 36, marginLeft: -75, borderRadius: 20, background: "#000" }} />
    {header && (
      <div style={{ position: "absolute", left: 0, right: 0, top: 80, height: 120, padding: "0 36px", display: "flex", alignItems: "center", gap: 22, borderBottom: `2px solid ${K.line}` }}>
        <Avatar txt="CL" size={76} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: JK, fontWeight: 700, fontSize: 34, color: "#fff" }}>Camille L.</div>
          <div style={{ fontFamily: JK, fontWeight: 500, fontSize: 25, color: K.gray }}>Instagram, exemple</div>
        </div>
        <ChannelGlyph kind="ig" size={60} />
      </div>
    )}
    <div style={{ position: "absolute", left: 0, right: 0, top: 220, bottom: 30, padding: "0 30px", display: "flex", flexDirection: "column", gap: 26 }}>{children}</div>
  </div>
);

export const ChannelGlyph: React.FC<{ kind: "ig" | "ms" | "wa"; size: number }> = ({ kind, size }) => {
  if (kind === "ig")
    return (
      <svg width={size} height={size} viewBox="0 0 48 48"><defs><linearGradient id="igg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#FFB033" /><stop offset=".5" stopColor="#F0263A" /><stop offset="1" stopColor="#8A3AB9" /></linearGradient></defs>
        <rect x="3" y="3" width="42" height="42" rx="13" fill="url(#igg)" /><rect x="11.5" y="11.5" width="25" height="25" rx="8" fill="none" stroke="#fff" strokeWidth="3.4" /><circle cx="24" cy="24" r="6" fill="none" stroke="#fff" strokeWidth="3.4" /><circle cx="32" cy="16" r="2.2" fill="#fff" /></svg>
    );
  if (kind === "ms")
    return (
      <svg width={size} height={size} viewBox="0 0 48 48"><defs><linearGradient id="msg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#A033FF" /><stop offset="1" stopColor="#0099FF" /></linearGradient></defs>
        <path d="M24 3C12 3 3 11.8 3 23c0 6 2.6 11 6.8 14.5V45l6.8-3.7c2.2.6 4.5.9 7.4.9 12 0 21-8.8 21-20S36 3 24 3z" fill="url(#msg)" /><path d="M11 28l7.3-7.8 5.6 5.4 8-5.4-7.2 8-5.6-5.2z" fill="#fff" /></svg>
    );
  return (
    <svg width={size} height={size} viewBox="0 0 48 48"><path d="M24 3C12.4 3 3 12.3 3 23.8c0 3.9 1.1 7.5 3 10.6L3.5 44l9.9-2.6c3 1.7 6.5 2.6 10.1 2.6C35.1 44 45 34.7 45 23.8S35.6 3 24 3z" fill="#25D366" /><path d="M17 14c-1.2 1-2.2 2.6-1.7 5 .9 4 4.8 8.2 9 10 2.6 1 4.4.2 5.7-1.1.8-.8.6-1.7-.2-2.2l-2.6-1.4c-.7-.4-1.5-.2-2 .5l-.7.9c-2.4-1-4.4-3-5.2-5.3l.9-.8c.6-.5.6-1.3.3-2l-1.2-2.6c-.4-.8-1.4-.9-2.3-.1z" fill="#fff" /></svg>
  );
};

/** Texte qui monte masqué */
export const Rise: React.FC<{ t: number; a: number; size: number; children: React.ReactNode; color?: string; align?: "left" | "center"; weight?: number }> = ({ t, a, size, children, color = "#fff", align = "center", weight = 800 }) => {
  const p = prog(t, a, 0.5);
  return (
    <div style={{ overflow: "hidden", paddingBottom: size * 0.12, textAlign: align }}>
      <div style={{ fontFamily: JK, fontWeight: weight, fontSize: size, lineHeight: 1.05, letterSpacing: -size * 0.025, color, transform: `translateY(${(1 - p) * 115}%)`, opacity: clamp01(p * 3) }}>{children}</div>
    </div>
  );
};

export const Sparks: React.FC<{ t: number; a: number; n?: number; r?: number; color?: string }> = ({ t, a, n = 18, r = 320, color = K.orange }) => {
  const p = prog(t, a, 0.8);
  if (t < a) return null;
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const ang = rnd(i + 5) * Math.PI * 2, d = p * (r * (0.5 + rnd(i + 20) * 0.7));
        return <div key={i} style={{ position: "absolute", left: Math.cos(ang) * d - 7, top: Math.sin(ang) * d - 7, width: 14, height: 14, borderRadius: 7, background: i % 3 ? color : "#fff", opacity: 1 - p, transform: `scale(${1 - p * 0.6})` }} />;
      })}
    </>
  );
};
export { clamp01, prog, rnd, sp };
