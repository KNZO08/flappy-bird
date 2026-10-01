"""Assemble les 4 voix off, coupe les silences, booste la voix, génère les SFX
et écrit src/data/timeline.json (timings des mots, estimés d'après les pauses)."""
import json, re, subprocess, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
V = f"{ROOT}/public/voix"
GAP = 0.12     # silence entre deux morceaux
LEAD = 0.10
TAIL = 0.9

# (fichier, début, fin, texte) – bornes = pauses détectées dans l'audio
P = [
 (1, 0.00, 9.40, "J'ai passé 6 mois à faire toutes les certifications et formations IA gratuites et voici les meilleures. Mais la dernière, c'est celle qu'il ne faut jamais louper. La première, c'est pour les non-techniques. Elle s'appelle Google AI Essentials."),
 (1, 9.84, 13.09, "Tu peux la passer en quelques heures et c'est celle qui va te donner envie à passer à la suivante,"),
 (1, 13.18, 14.34, "celle d'Anthropic Academy."),
 (2, 0.09, 7.17, "Si tu veux littéralement faire face à tout ce changement que l'IA crée, c'est la bonne formation et en plus, c'est 100% gratuit. Et sans plus, c'est que tu vas être Anthropic Certified."),
 (2, 7.26, 10.36, "Tu peux l'ajouter sur ton CV et même proposer des prestations par rapport à ça."),
 (2, 10.82, 17.87, "Maintenant que tu as un niveau intermédiaire après avoir passé ces deux formations-là, passe à celle-là qui est beaucoup plus importante. Il s'appelle Google Professional Machine Learning Engineer."),
 (3, 0.08, 4.24, "Et en gros, cette formation va te donner les clés pour commencer à construire des modèles sur le Google Cloud."),
 (3, 4.31, 10.16, "Et dans le même niveau, tu peux également passer le AWS Certified Machine Learning Engineer Associate. Et c'est presque la même chose."),
 (3, 10.80, 14.05, "Maintenant que tu es intermédiaire++, il faut passer au niveau supérieur."),
 (3, 14.13, 18.46, "Et tu as cette certification qui s'appelle Be a certified professional in managing AI."),
 (4, 0.10, 5.67, "Et sur leur site, elle est pensée pour les chefs de projet et les responsables de programme qui gèrent des initiatives, des projets IA de A à Z."),
 (4, 5.75, 8.29, "Bref, il ne faut pas attendre pour passer ces formations."),
 (4, 8.44, 10.34, "Alors, si tu veux les liens, dis-le-moi en commentaire."),
]

inputs, filt, labels = [], [], []
for i in range(1, 5):
    inputs += ["-i", f"{V}/{i}.mp3"]
t = LEAD
filt.append(f"anullsrc=r=44100:cl=mono,atrim=0:{LEAD}[lead]")
labels.append("[lead]")
words = []
for k, (f, a, b, txt) in enumerate(P):
    d = b - a
    filt.append(f"[{f-1}:a]aformat=sample_rates=44100:channel_layouts=mono,atrim={a}:{b},asetpts=PTS-STARTPTS,"
                f"afade=t=in:d=0.012,afade=t=out:st={d-0.02:.3f}:d=0.02[p{k}]")
    labels.append(f"[p{k}]")
    # timings des mots : répartis au poids (lettres + 2) dans le morceau
    ws = txt.split()
    wt = [len(re.sub(r"\W", "", w)) + 2 for w in ws]
    tot, acc = sum(wt), 0
    for w, x in zip(ws, wt):
        words.append({"w": w, "s": round(t + d * acc / tot, 3), "e": round(t + d * (acc + x) / tot, 3), "piece": k})
        acc += x
    t += d
    filt.append(f"anullsrc=r=44100:cl=mono,atrim=0:{GAP if k < len(P)-1 else TAIL}[g{k}]")
    labels.append(f"[g{k}]")
    t += GAP if k < len(P) - 1 else TAIL
total = t
fc = ";".join(filt) + ";" + "".join(labels) + f"concat=n={len(labels)}:v=0:a=1,"
# voix : filtre graves, compression, +gain, normalisation forte, limiteur
fc += ("highpass=f=75,acompressor=threshold=-24dB:ratio=3.5:attack=4:release=90:makeup=7,"
       "loudnorm=I=-12:LRA=6:TP=-1.0,alimiter=limit=0.95[out]")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex", fc, "-map", "[out]",
                "-ar", "44100", "-b:a", "192k", f"{ROOT}/public/voix.mp3"], check=True)
pieces = []
t = LEAD
for k, (f, a, b, txt) in enumerate(P):
    pieces.append({"s": round(t, 3), "e": round(t + b - a, 3)}); t += b - a + GAP
json.dump({"duration": round(total, 3), "words": words, "pieces": pieces},
          open(f"{ROOT}/src/data/timeline.json", "w"), ensure_ascii=False, indent=1)
print("durée", round(total, 2), "s")

# --- SFX synthétisés (courts, discrets) ---
S = f"{ROOT}/public/sfx"
def sfx(name, src, af, d):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i", src, "-af", af, "-t", str(d),
                    "-ar", "44100", f"{S}/{name}.wav"], check=True)
sfx("whoosh", "anoisesrc=d=0.5:c=pink:r=44100", "highpass=f=400,lowpass=f=5000,afade=t=in:d=0.18,afade=t=out:st=0.2:d=0.3,volume=0.9", 0.5)
sfx("pop", "sine=f=700:d=0.14", "afade=t=out:st=0.02:d=0.12,volume=0.8", 0.14)
sfx("tick", "sine=f=1800:d=0.06", "afade=t=out:st=0.0:d=0.06", 0.06)
sfx("ding", "sine=f=1318:d=0.6", "afade=t=out:st=0.01:d=0.58,aecho=0.6:0.5:60:0.3", 0.6)
sfx("hit", "sine=f=70:d=0.35", "afade=t=out:st=0.0:d=0.35,volume=1.5", 0.35)
sfx("riser", "anoisesrc=d=1.0:c=white:r=44100", "highpass=f=800,lowpass=f=7000,afade=t=in:d=0.95,afade=t=out:st=0.95:d=0.05", 1.0)
