"""Pub EzSet : cale le script sur la voix (pauses), booste la voix, écrit src/data/ad_timeline.json"""
import json, re, subprocess, itertools, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = f"{ROOT}/public/ads/voix_raw.mp3"
LINES = [
 "Tes DMs débordent… et ton agenda reste vide?",
 "Avec EzSet, l'IA répond à tous tes DMs et qualifie tes leads, toute seule.",
 "Toi, tu fais juste les calls.",
 "Besoin d'aide? Ajoute tes setters: ils voient toutes tes conversations Instagram, Messenger et WhatsApp.",
 "L'IA leur souffle quoi répondre. Ils corrigent un message, et elle apprend.",
 "EzSet. Crée ton compte.",
]
out = subprocess.run(["ffmpeg","-hide_banner","-i",SRC,"-af","silencedetect=n=-30dB:d=0.06","-f","null","-"],capture_output=True,text=True).stderr
st = [float(x) for x in re.findall(r"silence_start: ([0-9.]+)", out)]
en = [float(x) for x in re.findall(r"silence_end: ([0-9.]+)", out)]
dur = float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",SRC]))
sil = [(a, b) for a, b in zip(st, en) if b - a >= 0.10 and a > 0.2 and b < dur - 0.05]
s0, s1 = 0.06, st[-1] if st[-1] > dur - 1 else dur
wt = lambda w: len(re.sub(r"\W", "", w)) + 2
lw = [sum(wt(w) for w in l.split()) for l in LINES]
tot = sum(lw)
cum = list(itertools.accumulate(lw))
def sp_time(t):  # temps de parole (hors pauses) jusqu'à t
    return t - s0 - sum(min(b, t) - a for a, b in sil if a < t)
speech_total = sp_time(s1)
best = None
for combo in itertools.combinations(range(len(sil)), 5):
    c = 0
    for k, i in enumerate(combo):
        pred = cum[k] / tot * speech_total
        c += (sp_time(sil[i][0]) - pred) ** 2 - 3 * (sil[i][1] - sil[i][0])
    if best is None or c < best[0]: best = (c, combo)
bounds = [sil[i] for i in best[1]]
print("frontières de lignes :", bounds)
spans = []
cur = s0
for a, b in bounds:
    spans.append((cur, a)); cur = b
spans.append((cur, s1))
# --- audio : coupe l'excès sur les grosses pauses (>0.4 s -> 0.25 s), boost voix
cuts = [(a + 0.15, b - 0.15) for a, b in sil if b - a > 0.4]   # zones retirées
keep, prev = [], 0.0
for a, b in cuts:
    keep.append((prev, a)); prev = b
keep.append((prev, dur))
def remap(t):  # temps source -> temps sortie
    off = sum(min(b, t) - a for a, b in cuts if t > a)
    return t - off
fc = "".join(f"[0:a]atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.01,afade=t=out:st={b-a-0.02:.3f}:d=0.02[k{i}];" for i, (a, b) in enumerate(keep))
fc += "".join(f"[k{i}]" for i in range(len(keep))) + f"concat=n={len(keep)}:v=0:a=1,"
fc += "highpass=f=80,acompressor=threshold=-26dB:ratio=4:attack=4:release=90:makeup=9,loudnorm=I=-12:LRA=6:TP=-1.0,alimiter=limit=0.95[o]"
subprocess.run(["ffmpeg","-y","-loglevel","error","-i",SRC,"-filter_complex",fc,"-map","[o]","-ar","44100","-b:a","192k",f"{ROOT}/public/ads/voix.mp3"],check=True)
words, lines = [], []
for l, (a, b) in zip(LINES, spans):
    a, b = remap(a), remap(b)
    ws = l.split(); w = [wt(x) for x in ws]; tt = sum(w); acc = 0
    lines.append({"s": round(a, 3), "e": round(b, 3), "text": l})
    for x, k in zip(ws, w):
        words.append({"w": x, "s": round(a + (b - a) * acc / tt, 3), "e": round(a + (b - a) * (acc + k) / tt, 3), "line": len(lines) - 1})
        acc += k
total = remap(dur)
json.dump({"duration": round(total, 3), "lines": lines, "words": words}, open(f"{ROOT}/src/data/ad_timeline.json", "w"), ensure_ascii=False, indent=1)
print("durée", round(total, 2)); [print(round(x['s'],2), round(x['e'],2), x['text'][:40]) for x in lines]
