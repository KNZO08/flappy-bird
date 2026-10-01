import { continueRender, delayRender, staticFile } from "remotion";

const load = async () => {
  const faces = [
    new FontFace("Anton", `url(${staticFile("anton.woff2")})`, { weight: "400" }),
    new FontFace("Inter", `url(${staticFile("inter-500.woff2")})`, { weight: "500" }),
    new FontFace("Inter", `url(${staticFile("inter-800.woff2")})`, { weight: "800" }),
  ];
  await Promise.all(faces.map((f) => f.load()));
  faces.forEach((f) => document.fonts.add(f));
};

const handle = delayRender("fonts");
load().then(() => continueRender(handle));

export const ANTON = "'Anton', Impact, sans-serif";
export const INTER = "'Inter', system-ui, sans-serif";
