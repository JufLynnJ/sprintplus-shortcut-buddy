import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Check,
  X,
  RotateCcw,
  Star,
  Menu,
  Undo2,
  Redo2,
  Play,
  Square,
  Type,
  TextSelect,
  Baseline,
  Minus,
  Highlighter,
  Pencil,
  BookOpen,
  Image as ImageIcon,
  Globe,
  MousePointer2,
  Hand,
  MousePointerClick,
  Keyboard,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import beloningRaket from "@/assets/beloning-raket.png";
import beloningDino from "@/assets/beloning-dino.png";
import beloningKat from "@/assets/beloning-kat.png";
import foutZonnebril from "@/assets/fout-zonnebril.png";
import chatbot from "@/assets/chatbot.png";

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
  icon: LucideIcon;
  groep: number;
  opdracht: string;
  tip: string;
};

const KNOPPEN: Knop[] = [
  { id: "menu", label: "Menu", icon: Menu, groep: 0, opdracht: "het menu van Sprint Online openen", tip: "Het menu zijn de drie streepjes helemaal links." },
  { id: "ongedaan", label: "Ongedaan maken", icon: Undo2, groep: 0, opdracht: "je laatste actie ongedaan maken", tip: "Zoek het pijltje dat naar links draait." },
  { id: "opnieuw", label: "Opnieuw doen", icon: Redo2, groep: 0, opdracht: "iets opnieuw doen dat je net ongedaan maakte", tip: "Zoek het pijltje dat naar rechts draait." },
  { id: "lezen", label: "Voorlezen", icon: Play, groep: 1, opdracht: "de tekst laten voorlezen", tip: "Het driehoekje (play), net zoals bij muziek starten." },
  { id: "stop", label: "Stoppen", icon: Square, groep: 1, opdracht: "het voorlezen stoppen", tip: "Het vierkantje naast de play-knop." },
  { id: "selectie", label: "Selectie lezen", icon: TextSelect, groep: 2, opdracht: "enkel het stuk tekst laten lezen dat je selecteerde", tip: "Het vakje met stippellijntjes." },
  { id: "tekstvak", label: "Tekstvak", icon: Type, groep: 2, opdracht: "een tekstvak toevoegen om zelf in te typen", tip: "De grote letter T." },
  { id: "letterkleur", label: "Tekstkleur", icon: Baseline, groep: 3, opdracht: "de kleur van je letters veranderen", tip: "De letter A met een streepje eronder." },
  { id: "lijn", label: "Lijn tekenen", icon: Minus, groep: 3, opdracht: "een rechte lijn tekenen", tip: "Het schuine streepje." },
  { id: "geel", label: "Gele markeerstift", icon: Highlighter, groep: 3, opdracht: "belangrijke woorden geel markeren", tip: "De gele markeerstift." },
  { id: "groen", label: "Groene markeerstift", icon: Highlighter, groep: 3, opdracht: "woorden groen markeren", tip: "De groene markeerstift." },
  { id: "potlood", label: "Potlood", icon: Pencil, groep: 3, opdracht: "vrij tekenen of schrijven op je blad", tip: "Het potlood, helemaal rechts van de stiften." },
  { id: "woordenboek", label: "Woordenboek", icon: BookOpen, groep: 4, opdracht: "de betekenis van een woord opzoeken", tip: "Het open boekje." },
  { id: "beeldwoordenboek", label: "Beeldwoordenboek", icon: ImageIcon, groep: 4, opdracht: "een afbeelding bij een woord zoeken", tip: "Het boekje met een plaatje in." },
  { id: "google", label: "Google-woordenboek", icon: Globe, groep: 4, opdracht: "een woord opzoeken op het internet", tip: "Het boekje met de G van Google." },
  { id: "aanwijzer", label: "Aanwijzer", icon: MousePointer2, groep: 5, opdracht: "gewoon tekst aanklikken en selecteren", tip: "De muispijl." },
  { id: "hand", label: "Handje", icon: Hand, groep: 5, opdracht: "je blad verschuiven zonder iets te veranderen", tip: "Het handje, helemaal rechts." },
];

const TABS = ["Start", "Lezen", "Bewerken", "Studeren"] as const;

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
  { toets: "Delete", code: "delete", uitleg: "Geselecteerde tekst wissen", tip: "Druk op de Delete-toets (soms staat er Del op)." },
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

const KLEUR: Record<string, string> = {
  letterkleur: "text-white",
  lijn: "text-white/70",
  geel: "text-yellow-300",
  groen: "text-lime-400",
  potlood: "text-sky-300",
};

function Werkbalk({
  onKlik,
  actief,
  markeer,
  uitgeschakeld,
}: {
  onKlik: (id: string) => void;
  actief: string | null;
  markeer: string | null;
  uitgeschakeld: boolean;
}) {
  const groepen = Array.from(new Set(KNOPPEN.map((k) => k.groep)));
  return (
    <div className="w-full overflow-hidden rounded-2xl bg-[oklch(0.28_0.09_275)] shadow-xl">
      <div className="flex items-center gap-2 px-3 pt-3">
        {KNOPPEN.filter((k) => k.groep === 0).map((k) => (
          <KnopUI key={k.id} knop={k} onKlik={onKlik} actief={actief} markeer={markeer} uitgeschakeld={uitgeschakeld} />
        ))}
        <div className="ml-3 flex items-end gap-1">
          {TABS.map((t, i) => (
            <span
              key={t}
              className={`rounded-t-lg px-4 py-2 text-sm font-semibold ${
                i === 0 ? "bg-[oklch(0.45_0.11_275)] text-white" : "text-white/70"
              }`}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4 bg-[oklch(0.45_0.11_275)] px-3 py-3">
        {groepen
          .filter((g) => g !== 0)
          .map((g) => (
            <div key={g} className="flex items-center gap-2 rounded-full bg-[oklch(0.33_0.1_275)] px-3 py-2">
              {KNOPPEN.filter((k) => k.groep === g).map((k) => (
                <KnopUI key={k.id} knop={k} onKlik={onKlik} actief={actief} markeer={markeer} uitgeschakeld={uitgeschakeld} />
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}

function KnopUI({
  knop,
  onKlik,
  actief,
  markeer,
  uitgeschakeld,
}: {
  knop: Knop;
  onKlik: (id: string) => void;
  actief: string | null;
  markeer: string | null;
  uitgeschakeld: boolean;
}) {
  const Icon = knop.icon;
  const isFout = actief === knop.id;
  const isTip = markeer === knop.id;
  return (
    <button
      type="button"
      onClick={() => onKlik(knop.id)}
      disabled={uitgeschakeld}
      aria-label={knop.label}
      title={knop.label}
      className={`flex h-11 w-11 items-center justify-center rounded-xl transition-transform hover:scale-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/60 disabled:cursor-not-allowed ${
        isFout ? "bg-destructive/80 animate-[wiggle_0.5s_ease-in-out]" : "bg-white/10"
      } ${isTip ? "ring-4 ring-yellow-300 animate-pulse" : ""}`}
    >
      <Icon className={`h-6 w-6 ${KLEUR[knop.id] ?? "text-white"}`} aria-hidden />
    </button>
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
      <Werkbalk onKlik={klik} actief={foutId} markeer={o.pogingen >= 2 && o.fase === "vraag" ? o.opgave.id : null} uitgeschakeld={o.fase === "goed"} />
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
