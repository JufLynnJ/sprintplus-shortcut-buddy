import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Check,
  X,
  RotateCcw,
  Star,
  MousePointerClick,
  Keyboard,
} from "lucide-react";

import beloningRaket from "@/assets/beloning-raket.png";
import beloningDino from "@/assets/beloning-dino.png";
import beloningKat from "@/assets/beloning-kat.png";
import foutZonnebril from "@/assets/fout-zonnebril.png";
import chatbot from "@/assets/chatbot.png";
import werkbalkLezen from "@/assets/sprint-online-lezen.png.asset.json";
import werkbalkBewerken from "@/assets/sprint-online-bewerken.png.asset.json";
import werkbalkStuderen from "@/assets/sprint-online-studeren.png.asset.json";

export const Route = createFileRoute("/sprint-online")({
  head: () => ({
    meta: [
      { title: "Sprint Online oefenen: knoppen en sneltoetsen" },
      {
        name: "description",
        content:
          "Oefen de werkbalk van Sprint Online: klik de juiste knop aan of druk de juiste sneltoets in. Met groene vinkjes, coole tekeningen en een helpende robot.",
      },
      { property: "og:title", content: "Sprint Online oefenen: knoppen en sneltoetsen" },
      {
        property: "og:description",
        content:
          "Speelse trainer voor Sprint Online: klik de juiste knop in de werkbalk of typ de juiste sneltoets.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SprintOnlinePagina,
});

type Knop = {
  id: string;
  label: string;
  tab: "Lezen" | "Bewerken" | "Studeren";
  vak: { left: number; top: number; width: number; height: number };
  opdracht: string;
  tip: string;
};

const KNOPPEN: Knop[] = [
  { id: "voorlezen", label: "Voorlezen", tab: "Lezen", vak: { left: 61.5, top: 43, width: 5, height: 36 }, opdracht: "de tekst laten voorlezen", tip: "Klik op het witte driehoekje in de werkbalk." },
  { id: "stop", label: "Stoppen", tab: "Lezen", vak: { left: 67.2, top: 43, width: 4.3, height: 36 }, opdracht: "het voorlezen stoppen", tip: "Klik op het witte vierkantje naast de afspeelknop." },
  { id: "klik-lees", label: "Klik en lees", tab: "Lezen", vak: { left: 80.1, top: 43, width: 5.5, height: 36 }, opdracht: "één woord aan te wijzen en te laten voorlezen", tip: "Klik op de witte muispijl." },
  { id: "tekstvak", label: "Tekstvak", tab: "Bewerken", vak: { left: 17.5, top: 42, width: 3.6, height: 40 }, opdracht: "een tekstvak toe te voegen", tip: "Klik op de grote letter T." },
  { id: "letterkleur", label: "Tekstkleur", tab: "Bewerken", vak: { left: 21.3, top: 42, width: 4.1, height: 40 }, opdracht: "de kleur van letters te veranderen", tip: "Klik op de letter A met het streepje eronder." },
  { id: "markeren", label: "Markeerstift", tab: "Bewerken", vak: { left: 25.4, top: 42, width: 5, height: 40 }, opdracht: "tekst te markeren", tip: "Klik op de gele markeerstift." },
  { id: "lijn", label: "Lijn", tab: "Bewerken", vak: { left: 35.2, top: 42, width: 4.2, height: 40 }, opdracht: "een rechte lijn te tekenen", tip: "Klik op het schuine lijnsymbool." },
  { id: "potlood", label: "Potlood", tab: "Bewerken", vak: { left: 39.5, top: 42, width: 4.4, height: 40 }, opdracht: "vrij te tekenen of schrijven", tip: "Klik op het witte potlood." },
  { id: "dicteren", label: "Dicteren", tab: "Bewerken", vak: { left: 78.3, top: 42, width: 4.5, height: 40 }, opdracht: "tekst in te spreken", tip: "Klik op de witte microfoon." },
  { id: "woordenboek", label: "Woordenboek", tab: "Studeren", vak: { left: 19.8, top: 42, width: 4.8, height: 37 }, opdracht: "de betekenis van een woord op te zoeken", tip: "Klik op het boekje in de eerste groep." },
  { id: "beeldwoordenboek", label: "Beeldwoordenboek", tab: "Studeren", vak: { left: 25, top: 42, width: 4.8, height: 37 }, opdracht: "een afbeelding bij een woord te zoeken", tip: "Klik op het boekje met de afbeelding." },
  { id: "google", label: "Google-woordenboek", tab: "Studeren", vak: { left: 30.1, top: 42, width: 4.8, height: 37 }, opdracht: "een woord via Google op te zoeken", tip: "Klik op het boekje met de letter G." },
  { id: "geel", label: "Gele markeerstift", tab: "Studeren", vak: { left: 37.8, top: 42, width: 5.1, height: 37 }, opdracht: "belangrijke woorden geel te markeren", tip: "Klik op de eerste gele markeerstift." },
  { id: "groen", label: "Groene markeerstift", tab: "Studeren", vak: { left: 42.9, top: 42, width: 5.1, height: 37 }, opdracht: "woorden groen te markeren", tip: "Klik op de groene markeerstift." },
  { id: "gom", label: "Gom", tab: "Studeren", vak: { left: 52.8, top: 42, width: 5.1, height: 37 }, opdracht: "een markering te verwijderen", tip: "Klik op de wit omlijnde gom." },
];

type Sneltoets = {
  toets: string;
  ctrl?: boolean;
  shift?: boolean;
  code: string;
  uitleg: string;
  tip: string;
};

const SNELTOETSEN: Sneltoets[] = [
  { toets: "Ctrl + C", ctrl: true, code: "c", uitleg: "Kopiëren", tip: "Houd Ctrl ingedrukt en druk dan op de C van kopiëren." },
  { toets: "Ctrl + V", ctrl: true, code: "v", uitleg: "Plakken", tip: "Houd Ctrl ingedrukt en druk dan op de V." },
  { toets: "Ctrl + X", ctrl: true, code: "x", uitleg: "Knippen", tip: "Houd Ctrl ingedrukt en druk dan op de X." },
  { toets: "Ctrl + Z", ctrl: true, code: "z", uitleg: "Ongedaan maken", tip: "Houd Ctrl ingedrukt en druk dan op de Z." },
  { toets: "Ctrl + Y", ctrl: true, code: "y", uitleg: "Opnieuw doen", tip: "Houd Ctrl ingedrukt en druk dan op de Y." },
  { toets: "Ctrl + S", ctrl: true, code: "s", uitleg: "Je werk opslaan", tip: "Houd Ctrl ingedrukt en druk dan op de S van opslaan." },
  { toets: "Ctrl + O", ctrl: true, code: "o", uitleg: "Een document openen", tip: "Houd Ctrl ingedrukt en druk dan op de O van openen." },
  { toets: "Ctrl + P", ctrl: true, code: "p", uitleg: "Afdrukken", tip: "Houd Ctrl ingedrukt en druk dan op de P van printen." },
  { toets: "Ctrl + F", ctrl: true, code: "f", uitleg: "Tekst zoeken", tip: "Houd Ctrl ingedrukt en druk dan op de F van find (zoeken)." },
  { toets: "Ctrl + A", ctrl: true, code: "a", uitleg: "Alles selecteren", tip: "Houd Ctrl ingedrukt en druk dan op de A van alles." },
  { toets: "Ctrl + B", ctrl: true, code: "b", uitleg: "Tekst vet maken", tip: "Houd Ctrl ingedrukt en druk dan op de B van bold (vet)." },
  { toets: "Ctrl + I", ctrl: true, code: "i", uitleg: "Tekst cursief maken", tip: "Houd Ctrl ingedrukt en druk dan op de I van italic." },
  { toets: "Ctrl + U", ctrl: true, code: "u", uitleg: "Tekst onderlijnen", tip: "Houd Ctrl ingedrukt en druk dan op de U van underline." },
  { toets: "ESC", code: "escape", uitleg: "Een actieve knop weer uitzetten", tip: "Druk op de Esc-toets, links bovenaan het toetsenbord." },
];

const BELONINGEN = [
  { src: beloningRaket, alt: "Blije raket die opstijgt tussen sterren en confetti" },
  { src: beloningDino, alt: "Coole groene dinosaurus met zonnebril die juicht" },
  { src: beloningKat, alt: "Superheld-kat met rode cape die vliegt" },
];

const JUISTE_TEKSTEN = ["Goed zo!", "Super!", "Wauw, dat klopt!", "Topper!", "Juist!"];
const FOUTE_TEKSTEN = ["Jammer, probeer nog eens!", "Oei, bijna! Nog een keer.", "Niet juist, maar je kan het!"];

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = copy[i] as T;
    copy[i] = copy[j] as T;
    copy[j] = tmp;
  }
  return copy;
}

const WERKBALKEN = {
  Lezen: { src: werkbalkLezen.url, breedte: 1073, hoogte: 147 },
  Bewerken: { src: werkbalkBewerken.url, breedte: 1149, hoogte: 136 },
  Studeren: { src: werkbalkStuderen.url, breedte: 987, hoogte: 164 },
};

function Werkbalk({
  tab,
  onKlik,
  actief,
  markeer,
  uitgeschakeld,
}: {
  tab: Knop["tab"];
  onKlik: (id: string) => void;
  actief: string | null;
  markeer: string | null;
  uitgeschakeld: boolean;
}) {
  const werkbalk = WERKBALKEN[tab];
  const knoppen = KNOPPEN.filter((knop) => knop.tab === tab);
  return (
    <div className="w-full overflow-x-auto rounded-lg border-2 border-border bg-card shadow-xl" aria-label={`Werkbalk ${tab}`}>
      <div className="relative min-w-[720px]" style={{ aspectRatio: `${werkbalk.breedte} / ${werkbalk.hoogte}` }}>
        <img src={werkbalk.src} alt={`Sprint Online-werkbalk met het tabblad ${tab} geopend`} className="absolute inset-0 h-full w-full" />
        {knoppen.map((knop) => (
          <button
            key={knop.id}
            type="button"
            onClick={() => onKlik(knop.id)}
            disabled={uitgeschakeld}
            aria-label={knop.label}
            title={knop.label}
            className={`absolute rounded-md border-2 border-transparent transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring ${
              actief === knop.id ? "border-destructive bg-destructive/30 animate-[wiggle_0.5s_ease-in-out]" : "hover:border-primary hover:bg-primary/15"
            } ${markeer === knop.id ? "border-amber-300 bg-amber-300/30 animate-pulse ring-4 ring-amber-300" : ""}`}
            style={{ left: `${knop.vak.left}%`, top: `${knop.vak.top}%`, width: `${knop.vak.width}%`, height: `${knop.vak.height}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function SprintOnlinePagina() {
  const [modus, setModus] = useState<"knoppen" | "sneltoetsen">("knoppen");
  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-8">
      <header className="mb-6 flex w-full max-w-3xl flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-extrabold text-foreground md:text-4xl">Sprint Online oefenen</h1>
        <div className="flex gap-2 rounded-full bg-muted p-1">
          <button
            onClick={() => setModus("knoppen")}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold transition-colors ${
              modus === "knoppen" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            <MousePointerClick className="h-4 w-4" aria-hidden /> Knoppen klikken
          </button>
          <button
            onClick={() => setModus("sneltoetsen")}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold transition-colors ${
              modus === "sneltoetsen" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            <Keyboard className="h-4 w-4" aria-hidden /> Sneltoetsen
          </button>
        </div>
      </header>
      {modus === "knoppen" ? <KlikOefening /> : <ToetsOefening />}
    </main>
  );
}

function Feedback({
  fase,
  pogingen,
  laatsteFout,
  foutTekst,
  juistTekst,
  beloning,
  tip,
  antwoord,
  onVolgende,
}: {
  fase: "vraag" | "goed";
  pogingen: number;
  laatsteFout: boolean;
  foutTekst: string;
  juistTekst: string;
  beloning: { src: string; alt: string };
  tip: string;
  antwoord: string;
  onVolgende: () => void;
}) {
  if (fase === "goed") {
    return (
      <div className="flex flex-col items-center gap-5 text-center">
        <img src={beloning.src} alt={beloning.alt} width={240} height={240} className="w-52 animate-[pop_0.45s_ease-out]" />
        <p className="flex items-center gap-2 text-2xl font-extrabold text-[oklch(0.55_0.17_150)]">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[oklch(0.9_0.08_150)]">
            <Check className="h-7 w-7" strokeWidth={3} aria-hidden />
          </span>
          {juistTekst}
        </p>
        <p className="text-lg text-muted-foreground">
          Juist: <span className="font-extrabold text-foreground">{antwoord}</span>
        </p>
        <button
          onClick={onVolgende}
          autoFocus
          className="mt-2 rounded-full bg-primary px-8 py-3 text-lg font-bold text-primary-foreground shadow-lg transition-transform hover:scale-105"
        >
          Volgende oefening
        </button>
        <p className="text-sm text-muted-foreground">Druk op Enter of Spatie om door te gaan</p>
      </div>
    );
  }

  return (
    <>
      {laatsteFout && (
        <div key={pogingen} className="flex flex-col items-center gap-3" role="alert">
          <img
            src={foutZonnebril}
            alt="Sip gezichtje met zonnebril en regenwolk"
            width={160}
            height={160}
            loading="lazy"
            className="w-32 animate-[wiggle_0.5s_ease-in-out]"
          />
          <p className="flex items-center gap-2 text-lg font-bold text-destructive">
            <X className="h-6 w-6" aria-hidden /> {foutTekst}
          </p>
          <p className="text-sm font-semibold text-muted-foreground">Poging {pogingen + 1} — probeer het opnieuw!</p>
        </div>
      )}
      {pogingen >= 2 && (
        <div className="mt-2 flex w-full items-end gap-3 rounded-2xl bg-secondary p-4 text-left">
          <img src={chatbot} alt="Vriendelijk robot-mannetje met een tip" width={110} height={110} loading="lazy" className="w-20 shrink-0 animate-bounce" />
          <div className="rounded-2xl rounded-bl-none bg-card px-4 py-3 shadow">
            <p className="font-bold text-foreground">Hoi! Ik help je even!</p>
            <p className="text-foreground">{tip}</p>
            <p className="mt-1 font-extrabold tracking-wide text-primary">Dus: {antwoord}</p>
          </div>
        </div>
      )}
    </>
  );
}

function Eindscherm({ score, totaal, opnieuw }: { score: number; totaal: number; opnieuw: () => void }) {
  return (
    <section className="flex flex-col items-center gap-5 text-center">
      <img src={beloningRaket} alt="Blije raket die opstijgt" width={280} height={280} className="w-56 animate-bounce" />
      <h2 className="text-3xl font-extrabold text-foreground">Klaar! Goed gedaan!</h2>
      <div className="flex items-center gap-2 rounded-full bg-secondary px-5 py-2 text-lg font-bold text-secondary-foreground">
        <Star className="h-5 w-5" aria-hidden /> Score: {score} / {totaal}
      </div>
      <button
        onClick={opnieuw}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-lg font-bold text-primary-foreground shadow-lg transition-transform hover:scale-105"
      >
        <RotateCcw className="h-5 w-5" aria-hidden /> Nog een keer oefenen
      </button>
    </section>
  );
}

function useOefening<T>(bron: T[]) {
  const [volgorde, setVolgorde] = useState<T[]>(bron);
  const [huidige, setHuidige] = useState(0);
  const [pogingen, setPogingen] = useState(0);
  const [fase, setFase] = useState<"vraag" | "goed">("vraag");
  const [laatsteFout, setLaatsteFout] = useState(false);
  const [score, setScore] = useState(0);
  const [klaar, setKlaar] = useState(false);
  const beloningRef = useRef(BELONINGEN[0]!);
  const juistRef = useRef(JUISTE_TEKSTEN[0]!);
  const foutRef = useRef(FOUTE_TEKSTEN[0]!);

  useEffect(() => {
    setVolgorde(shuffle(bron));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const volgende = useCallback(() => {
    if (huidige + 1 >= volgorde.length) {
      setKlaar(true);
      return;
    }
    setHuidige((h) => h + 1);
    setPogingen(0);
    setFase("vraag");
    setLaatsteFout(false);
  }, [huidige, volgorde.length]);

  const juistGeantwoord = useCallback(() => {
    beloningRef.current = BELONINGEN[Math.floor(Math.random() * BELONINGEN.length)]!;
    juistRef.current = JUISTE_TEKSTEN[Math.floor(Math.random() * JUISTE_TEKSTEN.length)]!;
    setFase("goed");
    setLaatsteFout(false);
    setPogingen((p) => {
      if (p === 0) setScore((s) => s + 1);
      return p;
    });
  }, []);

  const foutGeantwoord = useCallback(() => {
    foutRef.current = FOUTE_TEKSTEN[Math.floor(Math.random() * FOUTE_TEKSTEN.length)]!;
    setPogingen((p) => p + 1);
    setLaatsteFout(true);
  }, []);

  const opnieuw = useCallback(() => {
    setVolgorde(shuffle(bron));
    setHuidige(0);
    setPogingen(0);
    setFase("vraag");
    setLaatsteFout(false);
    setScore(0);
    setKlaar(false);
  }, [bron]);

  const voortgang = useMemo(
    () => Math.round(((klaar ? volgorde.length : huidige) / volgorde.length) * 100),
    [huidige, volgorde.length, klaar]
  );

  return {
    volgorde,
    huidige,
    opgave: volgorde[huidige]!,
    pogingen,
    fase,
    laatsteFout,
    score,
    klaar,
    beloning: beloningRef.current,
    juistTekst: juistRef.current,
    foutTekst: foutRef.current,
    volgende,
    juistGeantwoord,
    foutGeantwoord,
    opnieuw,
    voortgang,
  };
}

function Voortgang({ voortgang, huidige, totaal, score }: { voortgang: number; huidige: number; totaal: number; score: number }) {
  return (
    <div className="mb-5 w-full max-w-3xl">
      <div
        className="h-4 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={voortgang}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Voortgang"
      >
        <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${voortgang}%` }} />
      </div>
      <p className="mt-2 text-center text-sm font-semibold text-muted-foreground">
        Oefening {huidige + 1} van {totaal} · Score {score}
      </p>
    </div>
  );
}

function KlikOefening() {
  const o = useOefening<Knop>(KNOPPEN);
  const [foutId, setFoutId] = useState<string | null>(null);

  useEffect(() => {
    if (o.fase !== "goed") return;
    const opToets = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        o.volgende();
      }
    };
    window.addEventListener("keydown", opToets);
    return () => window.removeEventListener("keydown", opToets);
  }, [o]);

  if (o.klaar) return <Eindscherm score={o.score} totaal={o.volgorde.length} opnieuw={o.opnieuw} />;

  const klik = (id: string) => {
    if (o.fase === "goed") return;
    if (id === o.opgave.id) {
      setFoutId(null);
      o.juistGeantwoord();
    } else {
      setFoutId(id);
      o.foutGeantwoord();
      window.setTimeout(() => setFoutId(null), 600);
    }
  };

  return (
    <div className="flex w-full max-w-3xl flex-col items-center">
      <Voortgang voortgang={o.voortgang} huidige={o.huidige} totaal={o.volgorde.length} score={o.score} />
      <Werkbalk tab={o.opgave.tab} onKlik={klik} actief={foutId} markeer={o.pogingen >= 2 && o.fase === "vraag" ? o.opgave.id : null} uitgeschakeld={o.fase === "goed"} />
      <section className="mt-6 flex w-full flex-col items-center gap-5 rounded-3xl border-2 border-border bg-card p-6 text-center shadow-xl md:p-8">
        {o.fase === "vraag" && (
          <>
            <p className="text-lg font-semibold text-muted-foreground">Op welke knop klik je om…</p>
            <h2 className="text-2xl font-extrabold text-foreground md:text-3xl">{o.opgave.opdracht}?</h2>
            <p className="rounded-2xl bg-accent px-5 py-3 text-base font-bold text-accent-foreground">
              Klik de juiste knop aan in de werkbalk hierboven!
            </p>
          </>
        )}
        <Feedback
          fase={o.fase}
          pogingen={o.pogingen}
          laatsteFout={o.laatsteFout}
          foutTekst={o.foutTekst}
          juistTekst={o.juistTekst}
          beloning={o.beloning}
          tip={o.opgave.tip}
          antwoord={o.opgave.label}
          onVolgende={o.volgende}
        />
      </section>
    </div>
  );
}

function ToetsOefening() {
  const o = useOefening<Sneltoets>(SNELTOETSEN);
  const { fase, opgave, volgende, juistGeantwoord, foutGeantwoord, klaar } = o;

  useEffect(() => {
    if (klaar) return;
    const opToets = (e: KeyboardEvent) => {
      const code = e.key.toLowerCase();
      if (["control", "shift", "alt", "meta"].includes(code)) return;

      if (fase === "goed") {
        if (code === "enter" || code === " ") {
          e.preventDefault();
          volgende();
        }
        return;
      }

      if (e.ctrlKey || e.metaKey || (e.shiftKey && code.startsWith("f"))) e.preventDefault();

      const ctrlIngedrukt = e.ctrlKey || e.metaKey;
      const juist = code === opgave.code && ctrlIngedrukt === !!opgave.ctrl && e.shiftKey === !!opgave.shift;
      if (juist) juistGeantwoord();
      else foutGeantwoord();
    };
    window.addEventListener("keydown", opToets);
    return () => window.removeEventListener("keydown", opToets);
  }, [fase, opgave, volgende, juistGeantwoord, foutGeantwoord, klaar]);

  if (o.klaar) return <Eindscherm score={o.score} totaal={o.volgorde.length} opnieuw={o.opnieuw} />;

  return (
    <div className="flex w-full max-w-2xl flex-col items-center">
      <Voortgang voortgang={o.voortgang} huidige={o.huidige} totaal={o.volgorde.length} score={o.score} />
      <section className="flex w-full flex-col items-center gap-5 rounded-3xl border-2 border-border bg-card p-6 text-center shadow-xl md:p-10">
        {o.fase === "vraag" && (
          <>
            <p className="text-lg font-semibold text-muted-foreground">Welke sneltoets gebruik je in Sprint Online om…</p>
            <h2 className="text-2xl font-extrabold text-foreground md:text-3xl">{o.opgave.uitleg}?</h2>
            <p className="rounded-2xl bg-accent px-5 py-3 text-base font-bold text-accent-foreground">
              Druk nu de juiste toetsencombinatie in op je toetsenbord!
            </p>
          </>
        )}
        <Feedback
          fase={o.fase}
          pogingen={o.pogingen}
          laatsteFout={o.laatsteFout}
          foutTekst={o.foutTekst}
          juistTekst={o.juistTekst}
          beloning={o.beloning}
          tip={o.opgave.tip}
          antwoord={o.opgave.toets}
          onVolgende={o.volgende}
        />
      </section>
    </div>
  );
}
