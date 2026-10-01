import React from "react";
import { ANTON, INTER } from "./fonts";
import { C, clamp01, prog, rnd, sp } from "./theme";

/** Gros texte qui claque (scale + flou + remontée). */
export const Slam: React.FC<{
  t: number; a: number; size?: number; color?: string; children: React.ReactNode;
  style?: React.CSSProperties; from?: number;
}> = ({ t, a, size = 160, color = C.white, children, style, from = 1.9 }) => {
  const p = sp(t, a, 12, 210);
  const o = clamp01((t - a) / 0.08);
  return (
    <div
      style={{
        fontFamily: ANTON, fontSize: size, lineHeight: 0.98, color, textTransform: "uppercase",
        textAlign: "center", opacity: o,
        transform: `scale(${from - (from - 1) * p})`,
        filter: `blur(${(1 - clamp01(p)) * 10}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Texte masqué qui monte (reveal pro). */
export const Rise: React.FC<{
  t: number; a: number; size: number; color?: string; children: React.ReactNode;
  font?: string; weight?: number; align?: "left" | "center"; spacing?: number;
}> = ({ t, a, size, color = C.white, children, font = ANTON, weight = 400, align = "center", spacing = 0 }) => {
  const p = prog(t, a, 0.55);
  return (
    <div style={{ overflow: "hidden", lineHeight: 1.16, textAlign: align, whiteSpace: "nowrap", paddingBottom: "0.04em" }}>
      <div
        style={{
          fontFamily: font, fontWeight: weight, fontSize: size, color, letterSpacing: spacing,
          textTransform: "uppercase", transform: `translateY(${(1 - p) * 115}%)`, opacity: clamp01(p * 3),
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const Chip: React.FC<{
  t: number; a: number; children: React.ReactNode; dir?: 1 | -1; icon?: "check" | "dot" | null;
  tone?: "red" | "dark" | "amber"; size?: number;
}> = ({ t, a, children, dir = 1, icon = "check", tone = "dark", size = 46 }) => {
  const p = sp(t, a, 14, 190);
  const bg = tone === "red" ? C.red : tone === "amber" ? C.amber : C.panel2;
  const fg = tone === "amber" ? "#111" : C.white;
  return (
    <div
      style={{
        display: "inline-flex", alignItems: "center", gap: 18, padding: "20px 34px", borderRadius: 22,
        background: bg, color: fg, fontFamily: INTER, fontWeight: 800, fontSize: size, textTransform: "uppercase",
        letterSpacing: 1.5, border: tone === "dark" ? "2px solid rgba(255,255,255,0.10)" : "none",
        boxShadow: tone === "red" ? "0 0 50px rgba(255,42,42,0.45)" : "0 12px 40px rgba(0,0,0,0.5)",
        opacity: clamp01(p * 2), transform: `translateX(${(1 - p) * 220 * dir}px) scale(${0.85 + p * 0.15})`,
      }}
    >
      {icon === "check" && (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="12" fill={tone === "red" ? "#fff" : C.red} />
          <path d="M6.5 12.5l3.6 3.6 7.4-8" stroke={tone === "red" ? C.red : "#fff"} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {icon === "dot" && <div style={{ width: 16, height: 16, borderRadius: 8, background: C.red }} />}
      {children}
    </div>
  );
};

/** Carte de certification. */
export const CertCard: React.FC<{
  t: number; a: number; no: string; org: string; name: string[]; tag?: string; width?: number; nameSize?: number;
  tone?: "red" | "plain";
}> = ({ t, a, no, org, name, tag, width = 900, nameSize = 118, tone = "red" }) => {
  const p = sp(t, a, 15, 150);
  return (
    <div
      style={{
        width, padding: "44px 52px 50px", borderRadius: 34, position: "relative", overflow: "hidden",
        background: `linear-gradient(160deg, ${C.panel2}, ${C.panel})`,
        border: `2px solid ${tone === "red" ? "rgba(255,42,42,0.75)" : "rgba(255,255,255,0.12)"}`,
        boxShadow: tone === "red" ? "0 0 90px rgba(255,42,42,0.28), 0 30px 80px rgba(0,0,0,0.6)" : "0 30px 80px rgba(0,0,0,0.6)",
        opacity: clamp01(p * 2.2), transform: `translateY(${(1 - p) * 140}px) scale(${0.92 + p * 0.08})`,
      }}
    >
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 12, background: C.red }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 32, letterSpacing: 7, color: C.red }}>{org}</div>
        <div style={{ fontFamily: ANTON, fontSize: 70, color: "rgba(255,255,255,0.18)" }}>{no}</div>
      </div>
      <div style={{ marginTop: 14 }}>
        {name.map((l, i) => (
          <Rise key={i} t={t} a={a + 0.12 + i * 0.1} size={nameSize} align="left">{l}</Rise>
        ))}
      </div>
      {tag && (
        <div style={{ marginTop: 22, fontFamily: INTER, fontWeight: 500, fontSize: 34, color: C.gray, letterSpacing: 2, textTransform: "uppercase" }}>
          {tag}
        </div>
      )}
    </div>
  );
};

/** Jauge de niveau à N segments. */
export const Gauge: React.FC<{ t: number; a: number; steps: number; filled: number; label: string; width?: number }> = ({
  t, a, steps, filled, label, width = 860,
}) => {
  const gap = 14;
  const w = (width - gap * (steps - 1)) / steps;
  return (
    <div style={{ width, opacity: clamp01((t - a) / 0.2) }}>
      <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: C.gray, marginBottom: 16, textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ display: "flex", gap }}>
        {Array.from({ length: steps }).map((_, i) => {
          const fillP = prog(t, a + 0.15 + i * 0.12, 0.4);
          const on = i < filled;
          return (
            <div key={i} style={{ width: w, height: 30, borderRadius: 8, background: "rgba(255,255,255,0.09)", overflow: "hidden" }}>
              <div style={{ width: `${on ? fillP * 100 : 0}%`, height: "100%", background: C.red, boxShadow: "0 0 24px rgba(255,42,42,0.9)" }} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ---------- visuels SVG ---------- */

export const Clock: React.FC<{ t: number; a: number; size?: number }> = ({ t, a, size = 420 }) => {
  const p = sp(t, a, 14, 160);
  const sweep = prog(t, a + 0.1, 1.4);
  const r = 90;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ transform: `scale(${p})`, opacity: clamp01(p * 2) }}>
      <circle cx="100" cy="100" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="10" />
      <circle cx="100" cy="100" r={r} fill="none" stroke={C.red} strokeWidth="10" strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={circ * (1 - sweep * 0.75)} transform="rotate(-90 100 100)" />
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={i} x1="100" y1="22" x2="100" y2="30" stroke="#fff" strokeOpacity=".5" strokeWidth="3" transform={`rotate(${i * 30} 100 100)`} />
      ))}
      <line x1="100" y1="100" x2="100" y2="46" stroke="#fff" strokeWidth="6" strokeLinecap="round" transform={`rotate(${sweep * 270} 100 100)`} />
      <line x1="100" y1="100" x2="100" y2="68" stroke={C.red} strokeWidth="8" strokeLinecap="round" transform={`rotate(${sweep * 270 / 12} 100 100)`} />
      <circle cx="100" cy="100" r="9" fill="#fff" />
    </svg>
  );
};

export const Seal: React.FC<{ t: number; a: number; size?: number; text: string }> = ({ t, a, size = 520, text }) => {
  const p = sp(t, a, 10, 200);
  const rot = (t - a) * 40;
  const id = "seal" + text.length;
  return (
    <svg width={size} height={size} viewBox="0 0 300 300" style={{ transform: `scale(${0.3 + p * 0.7}) rotate(${(1 - p) * -40}deg)`, opacity: clamp01(p * 2) }}>
      <defs>
        <path id={id} d="M150,150 m-112,0 a112,112 0 1,1 224,0 a112,112 0 1,1 -224,0" />
      </defs>
      <g transform={`rotate(${rot} 150 150)`}>
        <circle cx="150" cy="150" r="140" fill={C.red} />
        <circle cx="150" cy="150" r="128" fill="none" stroke="#fff" strokeOpacity=".5" strokeDasharray="4 8" strokeWidth="3" />
        <text fontFamily={INTER} fontWeight={800} fontSize="25" fill="#fff">
          <textPath href={`#${id}`} textLength="690" lengthAdjust="spacing">{(`${text} • `).repeat(text.length > 12 ? 1 : 2)}</textPath>
        </text>
      </g>
      <circle cx="150" cy="150" r="82" fill="#fff" />
      <path d="M108 152l30 30 56-64" stroke={C.red} strokeWidth="22" fill="none" strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray="200" strokeDashoffset={200 * (1 - prog(t, a + 0.25, 0.4))} />
    </svg>
  );
};

export const CVDoc: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const p = sp(t, a, 14, 160);
  return (
    <div style={{ width: 420, height: 560, borderRadius: 24, background: "#F4F4F6", padding: 34, transform: `translateY(${(1 - p) * 200}px) rotate(${(1 - p) * 8 - 3}deg)`, opacity: clamp01(p * 2), boxShadow: "0 40px 90px rgba(0,0,0,0.65)" }}>
      <div style={{ fontFamily: ANTON, fontSize: 64, color: "#111" }}>MON CV</div>
      <div style={{ width: 90, height: 8, background: C.red, margin: "6px 0 26px" }} />
      {[0.95, 0.7, 0.85, 0.6, 0.8, 0.5].map((w, i) => (
        <div key={i} style={{ height: 14, borderRadius: 7, background: "#CFCFD6", marginBottom: 20, width: `${w * 100 * prog(t, a + 0.3 + i * 0.12, 0.4)}%` }} />
      ))}
    </div>
  );
};

export const Network: React.FC<{ t: number; a: number; size?: number }> = ({ t, a, size = 760 }) => {
  const layers = [3, 4, 4, 2];
  const pts: { x: number; y: number; l: number; i: number }[] = [];
  layers.forEach((n, l) => {
    for (let i = 0; i < n; i++) pts.push({ x: 70 + l * 200, y: 300 / 2 + (i - (n - 1) / 2) * 75, l, i });
  });
  const edges: [number, number][] = [];
  pts.forEach((p, i) => pts.forEach((q, j) => { if (q.l === p.l + 1) edges.push([i, j]); }));
  return (
    <svg width={size} height={(size * 300) / 740} viewBox="0 0 740 300">
      {edges.map(([i, j], k) => {
        const d = prog(t, a + pts[i].l * 0.35 + (k % 5) * 0.04, 0.5);
        const pulse = (Math.sin((t - a) * 5 - k * 0.7) + 1) / 2;
        return <line key={k} x1={pts[i].x} y1={pts[i].y} x2={pts[i].x + (pts[j].x - pts[i].x) * d} y2={pts[i].y + (pts[j].y - pts[i].y) * d}
          stroke={C.red} strokeOpacity={0.25 + pulse * 0.5 * d} strokeWidth="2" />;
      })}
      {pts.map((p, k) => (
        <circle key={k} cx={p.x} cy={p.y} r={14 * sp(t, a + p.l * 0.35, 11, 230)} fill={p.l === 3 ? C.red : "#fff"} />
      ))}
    </svg>
  );
};

export const Arrow: React.FC<{ t: number; a: number; size?: number }> = ({ t, a, size = 160 }) => {
  const p = prog(t, a, 0.5);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ opacity: clamp01(p * 3), transform: `translateX(${(1 - p) * -90}px)` }}>
      <path d="M12 50h66M52 22l28 28-28 28" stroke={C.red} strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

/** Bulle de commentaire + curseur de frappe. */
export const Bubble: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const p = sp(t, a, 11, 190);
  const typed = Math.floor(clamp01((t - a - 0.3) / 0.5) * 5);
  return (
    <div style={{ position: "relative", transform: `scale(${p}) rotate(${(1 - p) * -8}deg)`, opacity: clamp01(p * 2) }}>
      <div style={{ background: C.red, borderRadius: 48, padding: "34px 64px", fontFamily: ANTON, fontSize: 130, color: "#fff", letterSpacing: 4, boxShadow: "0 0 100px rgba(255,42,42,0.55)" }}>
        {"LIENS".slice(0, typed)}
        <span style={{ opacity: Math.floor(t * 4) % 2 ? 0 : 1 }}>|</span>
      </div>
      <div style={{ position: "absolute", left: 70, bottom: -34, width: 0, height: 0, borderLeft: "34px solid transparent", borderRight: "34px solid transparent", borderTop: `44px solid ${C.red}` }} />
    </div>
  );
};

/** Compteur de points (6 mois). */
export const MonthRing: React.FC<{ t: number; a: number; size?: number }> = ({ t, a, size = 900 }) => {
  const r = 400;
  return (
    <svg width={size} height={size} viewBox="0 0 900 900">
      <circle cx="450" cy="450" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
      <circle cx="450" cy="450" r={r} fill="none" stroke={C.red} strokeWidth="10" strokeLinecap="round"
        strokeDasharray={2 * Math.PI * r} strokeDashoffset={2 * Math.PI * r * (1 - prog(t, a, 1.8))} transform="rotate(-90 450 450)" />
      {Array.from({ length: 6 }).map((_, i) => {
        const ang = (i / 6) * Math.PI * 2 - Math.PI / 2;
        const on = sp(t, a + i * 0.3, 10, 240);
        return <circle key={i} cx={450 + Math.cos(ang) * r} cy={450 + Math.sin(ang) * r} r={10 + on * 14} fill={on > 0.05 ? C.red : "#333"} />;
      })}
    </svg>
  );
};

export const seedSparks = (n: number, t: number, a: number) =>
  Array.from({ length: n }).map((_, i) => {
    const ang = rnd(i + 3) * Math.PI * 2;
    const d = prog(t, a, 0.7) * (160 + rnd(i + 8) * 220);
    return { x: Math.cos(ang) * d, y: Math.sin(ang) * d, o: 1 - prog(t, a, 0.8), s: 6 + rnd(i) * 10 };
  });
