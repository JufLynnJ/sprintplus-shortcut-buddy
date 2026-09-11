import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, X, RotateCcw, Keyboard, Star } from "lucide-react";

import beloningRaket from "@/assets/beloning-raket.png";
import beloningDino from "@/assets/beloning-dino.png";
import beloningKat from "@/assets/beloning-kat.png";
import foutZonnebril from "@/assets/fout-zonnebril.png";
import chatbot from "@/assets/chatbot.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sneltoetsen oefenen met SprintPlus | SprintPlus Trainer" },
      {
        name: "description",
        content:
          "Oefen de sneltoetsen van SprintPlus op een speelse manier. Druk de juiste toetsencombinatie in, verdien coole tekeningen en krijg hulp van de robot.",
      },
      { property: "og:title", content: "Sneltoetsen oefenen met SprintPlus" },
      {
        property: "og:description",
        content:
          "Speelse trainer om de sneltoetsen van SprintPlus te leren: groene vinkjes, coole tekeningen en een hulpvaardige robot.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Sneltoets = {
  toets: string; // weergave, bv. "Ctrl + C"
  ctrl?: boolean;
  shift?: boolean;
  code: string; // e.key.toLowerCase()
  uitleg: string;
  tip: string;
};

const SNELTOETSEN: Sneltoets[] = [
  { toets: "Ctrl + C", ctrl: true, code: "c", uitleg: "Kopiëren", tip: "Houd Ctrl ingedrukt en druk dan op de C van kopiëren." },
  { toets: "Ctrl + V", ctrl: true, code: "v", uitleg: "Plakken", tip: "Houd Ctrl ingedrukt en druk dan op de V." },
  { toets: "Ctrl + X", ctrl: true, code: "x", uitleg: "Knippen", tip: "Houd Ctrl ingedrukt en druk dan op de X." },
  { toets: "Ctrl + Z", ctrl: true, code: "z", uitleg: "Ongedaan maken", tip: "Houd Ctrl ingedrukt en druk dan op de Z." },
  { toets: "Ctrl + Y", ctrl: true, code: "y", uitleg: "Opnieuw", tip: "Houd Ctrl ingedrukt en druk dan op de Y." },
  { toets: "Ctrl + S", ctrl: true, code: "s", uitleg: "Een bestand opslaan", tip: "Houd Ctrl ingedrukt en druk dan op de S van opslaan." },
  { toets: "Ctrl + O", ctrl: true, code: "o", uitleg: "Een bestand openen", tip: "Houd Ctrl ingedrukt en druk dan op de O van openen." },
  { toets: "Ctrl + N", ctrl: true, code: "n", uitleg: "Een nieuw tekstbestand maken", tip: "Houd Ctrl ingedrukt en druk dan op de N van nieuw." },
  { toets: "Ctrl + P", ctrl: true, code: "p", uitleg: "Een bestand afdrukken", tip: "Houd Ctrl ingedrukt en druk dan op de P van printen." },
  { toets: "Ctrl + F", ctrl: true, code: "f", uitleg: "Tekst zoeken", tip: "Houd Ctrl ingedrukt en druk dan op de F van find (zoeken)." },
  { toets: "Ctrl + H", ctrl: true, code: "h", uitleg: "Tekst vervangen", tip: "Houd Ctrl ingedrukt en druk dan op de H." },
  { toets: "Ctrl + B", ctrl: true, code: "b", uitleg: "De tekst in het vet zetten", tip: "Houd Ctrl ingedrukt en druk dan op de B van bold (vet)." },
  { toets: "Ctrl + I", ctrl: true, code: "i", uitleg: "De tekst cursief zetten", tip: "Houd Ctrl ingedrukt en druk dan op de I van italic (cursief)." },
  { toets: "Ctrl + U", ctrl: true, code: "u", uitleg: "De tekst onderlijnen", tip: "Houd Ctrl ingedrukt en druk dan op de U van underline (onderlijnen)." },
  { toets: "Ctrl + A", ctrl: true, code: "a", uitleg: "Alle tekst selecteren", tip: "Houd Ctrl ingedrukt en druk dan op de A van alles." },
  { toets: "Ctrl + D", ctrl: true, code: "d", uitleg: "De huidige datum voorlezen", tip: "Houd Ctrl ingedrukt en druk dan op de D van datum." },
  { toets: "Ctrl + T", ctrl: true, code: "t", uitleg: "De huidige tijd voorlezen", tip: "Houd Ctrl ingedrukt en druk dan op de T van tijd." },
  { toets: "Ctrl + R", ctrl: true, code: "r", uitleg: "De knop Klik en lees activeren", tip: "Houd Ctrl ingedrukt en druk dan op de R." },
  { toets: "Ctrl + F1", ctrl: true, code: "f1", uitleg: "Het lint minimaliseren en uitvouwen", tip: "Houd Ctrl ingedrukt en druk dan op F1 helemaal bovenaan." },
  { toets: "Delete", code: "delete", uitleg: "Geselecteerde tekst wissen", tip: "Druk op de Delete-toets (soms staat er Del op)." },
  { toets: "ESC", code: "escape", uitleg: "Een actieve knop deactiveren", tip: "Druk op de Esc-toets, links bovenaan het toetsenbord." },
  { toets: "Shift + F1", shift: true, code: "f1", uitleg: "Het Negeervak activeren", tip: "Houd Shift ingedrukt en druk dan op F1." },
  { toets: "Shift + F2", shift: true, code: "f2", uitleg: "Het Volgordevak activeren", tip: "Houd Shift ingedrukt en druk dan op F2." },
  { toets: "Shift + F3", shift: true, code: "f3", uitleg: "Het Figuurvak activeren", tip: "Houd Shift ingedrukt en druk dan op F3." },
  { toets: "Shift + F4", shift: true, code: "f4", uitleg: "Het Andere tekst-vak activeren", tip: "Houd Shift ingedrukt en druk dan op F4." },
  { toets: "Shift + F5", shift: true, code: "f5", uitleg: "Het Taalvak activeren", tip: "Houd Shift ingedrukt en druk dan op F5." },
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

function Index() {
  const [volgorde, setVolgorde] = useState<Sneltoets[]>(SNELTOETSEN);
  const [huidige, setHuidige] = useState(0);
  const [pogingen, setPogingen] = useState(0);
  const [fase, setFase] = useState<"vraag" | "goed">("vraag");
  const [laatsteFout, setLaatsteFout] = useState(false);
  const [score, setScore] = useState(0);
  const [klaar, setKlaar] = useState(false);
  const beloningRef = useRef(BELONINGEN[0]!);
  const tekstRef = useRef(JUISTE_TEKSTEN[0]!);
  const foutTekstRef = useRef(FOUTE_TEKSTEN[0]!);

  const opgave = volgorde[huidige]!;
  const toonRobot = pogingen >= 2 && fase === "vraag";

  // Pas na het laden in de browser door elkaar schudden (anders laadfout)
  useEffect(() => {
    setVolgorde(shuffle(SNELTOETSEN));
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

  useEffect(() => {
    if (klaar) return;
    const opToets = (e: KeyboardEvent) => {
      // Laat F5/F12 zonder Shift gewoon door aan de browser
      const code = e.key.toLowerCase();
      if (["control", "shift", "alt", "meta"].includes(code)) return;
      if (e.ctrlKey || e.metaKey || (e.shiftKey && code.startsWith("f"))) {
        e.preventDefault();
      }

      if (fase === "goed") return;

      const ctrlIngedrukt = e.ctrlKey || e.metaKey; // meta = Cmd op Mac
      const juist =
        code === opgave.code &&
        ctrlIngedrukt === !!opgave.ctrl &&
        e.shiftKey === !!opgave.shift;

      if (juist) {
        beloningRef.current = BELONINGEN[Math.floor(Math.random() * BELONINGEN.length)]!;
        tekstRef.current = JUISTE_TEKSTEN[Math.floor(Math.random() * JUISTE_TEKSTEN.length)]!;
        setFase("goed");
        setLaatsteFout(false);
        if (pogingen === 0) setScore((s) => s + 1);
      } else {
        foutTekstRef.current = FOUTE_TEKSTEN[Math.floor(Math.random() * FOUTE_TEKSTEN.length)]!;
        setPogingen((p) => p + 1);
        setLaatsteFout(true);
      }
    };
    window.addEventListener("keydown", opToets);
    return () => window.removeEventListener("keydown", opToets);
  }, [opgave, fase, pogingen, klaar]);

  const opnieuw = () => {
    setVolgorde(shuffle(SNELTOETSEN));
    setHuidige(0);
    setPogingen(0);
    setFase("vraag");
    setLaatsteFout(false);
    setScore(0);
    setKlaar(false);
  };

  const voortgang = useMemo(
    () => Math.round(((klaar ? volgorde.length : huidige) / volgorde.length) * 100),
    [huidige, volgorde.length, klaar]
  );

  if (klaar) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
        <img src={beloningRaket} alt="Blije raket die opstijgt" width={280} height={280} className="w-64 animate-bounce" />
        <h1 className="text-4xl font-extrabold text-foreground md:text-5xl">Klaar! Goed gedaan!</h1>
        <p className="max-w-md text-lg text-muted-foreground">
          Je hebt alle {volgorde.length} sneltoetsen geoefend. {score} daarvan had je meteen juist!
        </p>
        <div className="flex items-center gap-2 rounded-full bg-secondary px-5 py-2 text-lg font-bold text-secondary-foreground">
          <Star className="h-5 w-5" aria-hidden /> Score: {score} / {volgorde.length}
        </div>
        <button
          onClick={opnieuw}
          className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-lg font-bold text-primary-foreground shadow-lg transition-transform hover:scale-105"
        >
          <RotateCcw className="h-5 w-5" aria-hidden /> Nog een keer oefenen
        </button>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-8">
      <header className="mb-6 flex w-full max-w-2xl flex-col items-center gap-3">
        <h1 className="flex items-center gap-3 text-3xl font-extrabold text-foreground md:text-4xl">
          <Keyboard className="h-9 w-9 text-primary" aria-hidden />
          SprintPlus Sneltoetsen
        </h1>
        <div className="h-4 w-full overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={voortgang} aria-valuemin={0} aria-valuemax={100} aria-label="Voortgang">
          <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${voortgang}%` }} />
        </div>
        <p className="text-sm font-semibold text-muted-foreground">
          Oefening {huidige + 1} van {volgorde.length} · Score {score}
        </p>
      </header>

      <section className="w-full max-w-2xl rounded-3xl border-2 border-border bg-card p-6 shadow-xl md:p-10">
        {fase === "vraag" ? (
          <div className="flex flex-col items-center gap-6 text-center">
            <p className="text-lg font-semibold text-muted-foreground">Welke sneltoets gebruik je om…</p>
            <h2 className="text-2xl font-extrabold text-foreground md:text-3xl">{opgave.uitleg}?</h2>
            <p className="rounded-2xl bg-accent px-5 py-3 text-base font-bold text-accent-foreground">
              Druk nu de juiste toetsencombinatie in op je toetsenbord!
            </p>

            {laatsteFout && (
              <div key={pogingen} className="flex flex-col items-center gap-3" role="alert">
                <img
                  src={foutZonnebril}
                  alt="Sip gezichtje met zonnebril en regenwolk"
                  width={160}
                  height={160}
                  loading="lazy"
                  className="w-36 animate-[wiggle_0.5s_ease-in-out]"
                />
                <p className="flex items-center gap-2 text-lg font-bold text-destructive">
                  <X className="h-6 w-6" aria-hidden /> {foutTekstRef.current}
                </p>
                <p className="text-sm font-semibold text-muted-foreground">Poging {pogingen + 1} — probeer het opnieuw!</p>
              </div>
            )}

            {toonRobot && (
              <div className="mt-2 flex w-full items-end gap-3 rounded-2xl bg-secondary p-4 text-left">
                <img src={chatbot} alt="Vriendelijk robot-mannetje met een tip" width={110} height={110} loading="lazy" className="w-24 shrink-0 animate-bounce" />
                <div className="rounded-2xl rounded-bl-none bg-card px-4 py-3 shadow">
                  <p className="font-bold text-foreground">Hoi! Ik help je even!</p>
                  <p className="text-foreground">{opgave.tip}</p>
                  <p className="mt-1 font-extrabold tracking-wide text-primary">Dus: {opgave.toets}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5 text-center">
            <img
              src={beloningRef.current.src}
              alt={beloningRef.current.alt}
              width={240}
              height={240}
              className="w-56 animate-[pop_0.45s_ease-out]"
            />
            <p className="flex items-center gap-2 text-2xl font-extrabold text-[oklch(0.55_0.17_150)]">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[oklch(0.9_0.08_150)]">
                <Check className="h-7 w-7" strokeWidth={3} aria-hidden />
              </span>
              {tekstRef.current}
            </p>
            <p className="text-lg text-muted-foreground">
              <span className="font-extrabold text-foreground">{opgave.toets}</span> = {opgave.uitleg}
            </p>
            <button
              onClick={volgende}
              autoFocus
              className="mt-2 rounded-full bg-primary px-8 py-3 text-lg font-bold text-primary-foreground shadow-lg transition-transform hover:scale-105"
            >
              Volgende oefening
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
