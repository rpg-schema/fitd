import { useEffect, useState } from "react";
import fitdLogo from "@/assets/fitd-logo.png";

const VERSION = "1.0.0";
const NAMESPACE = "https://schema.rpg-schema.org/fitd#";

/* ── NAV SECTIONS ── */
const NAV = [
  { id: "dice",       label: "Dice System" },
  { id: "position",  label: "Position" },
  { id: "effect",    label: "Effect" },
  { id: "actions",   label: "Actions" },
  { id: "rolls",     label: "Rolls" },
  { id: "harm",      label: "Harm & Stress" },
  { id: "clocks",    label: "Clocks" },
  { id: "score",     label: "Score" },
  { id: "teamwork",  label: "Teamwork" },
  { id: "downtime",  label: "Downtime" },
  { id: "crew",      label: "Crew" },
  { id: "crafting",  label: "Crafting" },
];

/* ── SECTIONS ── */
type Card = { title: string; body: string };
type TermRow = { term: string; type: "owl:Class" | "owl:NamedIndividual" | "owl:ObjectProperty" | "owl:DatatypeProperty"; note: string };
type Section = {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  intro?: string;
  cards?: Card[];
  terms?: TermRow[];
};

const SECTIONS: Section[] = [
  {
    id: "dice",
    num: "§01",
    title: "Dice System",
    subtitle: "Result levels for every roll in FitD",
    intro: "Any dice roll produces one of four outcome tiers, determined by the highest die face in the pool. The pool size is 0d (take lowest of two dice), 1d, 2d, or more.",
    cards: [
      { title: "Critical", body: "Multiple 6s. The highest die is 6 and at least one other die is also 6. Exceptional outcome beyond full success." },
      { title: "Full Success", body: "Highest die is 6. A single 6. Things go well — you achieve your goal cleanly." },
      { title: "Partial Success", body: "Highest die is 4 or 5. You achieve your goal, but with a consequence, cost, or complication." },
      { title: "Bad Outcome", body: "Highest die is 1–3. Things go poorly. The goal is usually not achieved and complications occur." },
    ],
    terms: [
      { term: "fitd:DiceResult",      type: "owl:Class",           note: "Enumerated class; four outcome tiers." },
      { term: "fitd:Critical",        type: "owl:NamedIndividual",  note: "Multiple 6s." },
      { term: "fitd:FullSuccess",     type: "owl:NamedIndividual",  note: "Single 6." },
      { term: "fitd:PartialSuccess",  type: "owl:NamedIndividual",  note: "Highest die 4–5." },
      { term: "fitd:BadOutcome",      type: "owl:NamedIndividual",  note: "Highest die 1–3." },
    ],
  },
  {
    id: "position",
    num: "§02",
    title: "Position",
    subtitle: "How dangerous is the situation?",
    intro: "Position is set before an action roll. It governs the severity of consequences on a bad or partial outcome. The GM sets position, but players may push for a better one.",
    cards: [
      { title: "Controlled", body: "You have a dominant advantage. Worst result is a minor complication or reduced effect — no immediate harm." },
      { title: "Risky", body: "The default position. You're exposed to danger. A bad outcome could mean serious harm or a potent consequence." },
      { title: "Desperate", body: "You're in serious trouble. A bad outcome brings severe harm. A partial success still carries a stiff cost." },
    ],
    terms: [
      { term: "fitd:Position",     type: "owl:Class",          note: "Enumerated class; three positions." },
      { term: "fitd:Controlled",   type: "owl:NamedIndividual", note: "Least risky." },
      { term: "fitd:Risky",        type: "owl:NamedIndividual", note: "Default." },
      { term: "fitd:Desperate",    type: "owl:NamedIndividual", note: "Most dangerous." },
    ],
  },
  {
    id: "effect",
    num: "§03",
    title: "Effect",
    subtitle: "How much does a successful roll accomplish?",
    intro: "Effect is determined before the roll alongside position. It defines the scope of impact when you succeed — not whether you succeed.",
    cards: [
      { title: "Great Effect", body: "Exceptional impact. You achieve more than usual — a significant advantage, extra progress, or a striking result." },
      { title: "Standard Effect", body: "Normal impact. You accomplish what the action is meant to accomplish, no more, no less." },
      { title: "Limited Effect", body: "Partial impact. You make progress, but only a little — the obstacle resists or the situation constrains." },
    ],
    terms: [
      { term: "fitd:Effect",          type: "owl:Class",          note: "Enumerated class; three levels." },
      { term: "fitd:GreatEffect",     type: "owl:NamedIndividual", note: "Exceptional impact." },
      { term: "fitd:StandardEffect",  type: "owl:NamedIndividual", note: "Normal impact." },
      { term: "fitd:LimitedEffect",   type: "owl:NamedIndividual", note: "Partial impact." },
    ],
  },
  {
    id: "actions",
    num: "§04",
    title: "Actions & Attributes",
    subtitle: "Twelve action ratings grouped into three attributes",
    intro: "Each character has ratings (0–4) in twelve actions. Actions are grouped into three attributes. Resistance rolls use the full attribute (sum of its action ratings).",
    cards: [
      { title: "Insight", body: "Hunt · Study · Survey · Tinker. Mental acuity, investigation, and technical skill." },
      { title: "Prowess", body: "Finesse · Prowl · Skirmish · Wreck. Physical capability, stealth, and combat." },
      { title: "Resolve", body: "Attune · Command · Consort · Sway. Force of will, social influence, and the arcane." },
    ],
    terms: [
      { term: "fitd:Action",       type: "owl:Class",               note: "Superclass of all 12 action individuals." },
      { term: "fitd:Attribute",    type: "owl:Class",               note: "Superclass of Insight, Prowess, Resolve." },
      { term: "fitd:Insight",      type: "owl:Class",               note: "Hunt, Study, Survey, Tinker." },
      { term: "fitd:Prowess",      type: "owl:Class",               note: "Finesse, Prowl, Skirmish, Wreck." },
      { term: "fitd:Resolve",      type: "owl:Class",               note: "Attune, Command, Consort, Sway." },
      { term: "fitd:actionRating", type: "owl:DatatypeProperty",    note: "xsd:integer, range 0–4." },
      { term: "fitd:hasAction",    type: "owl:ObjectProperty",      note: "Links Attribute to its Action members." },
    ],
  },
  {
    id: "rolls",
    num: "§05",
    title: "Rolls",
    subtitle: "Four roll types covering all uncertain outcomes",
    intro: "Every uncertain moment in FitD resolves through one of four roll types. All rolls produce a DiceResult and are shaped by Position and Effect.",
    cards: [
      { title: "Action Roll", body: "The standard roll. Uses one of the 12 action ratings. Governed by Position. Produces a DiceResult that may trigger consequences or progress." },
      { title: "Resistance Roll", body: "Rolled with an Attribute when a character resists a consequence. Clears or reduces the consequence. Always costs at least 1 stress (even on a critical)." },
      { title: "Fortune Roll", body: "GM-controlled roll for uncertain off-screen outcomes — faction activity, NPC actions, healing, etc. No action rating required." },
      { title: "Engagement Roll", body: "Rolled once at the start of every score after planning. Determines the fictional position the crew begins in." },
    ],
    terms: [
      { term: "fitd:ActionRoll",      type: "owl:Class", note: "Uses action rating. Linked to Position." },
      { term: "fitd:ResistanceRoll",  type: "owl:Class", note: "Uses attribute. Clears/reduces consequence." },
      { term: "fitd:FortuneRoll",     type: "owl:Class", note: "No action rating; GM-called." },
      { term: "fitd:EngagementRoll",  type: "owl:Class", note: "Determines opening position of a score." },
      { term: "fitd:usesPosition",    type: "owl:ObjectProperty", note: "Links roll to its Position." },
      { term: "fitd:producesResult",  type: "owl:ObjectProperty", note: "Links roll to DiceResult." },
    ],
  },
  {
    id: "harm",
    num: "§06",
    title: "Harm & Stress",
    subtitle: "Consequences, conditions, and breaking points",
    intro: "Harm is the primary physical consequence of danger. Stress is the resource characters spend to push themselves and resist. Trauma marks permanent psychological change.",
    cards: [
      { title: "Harm (Severity 1–2)", body: "Lesser injuries. Level 1: Minor — barely a scratch; no mechanical effect. Level 2: Moderate — a real wound; −1d to relevant actions." },
      { title: "Harm (Severity 3–4)", body: "Level 3: Serious — you're badly hurt; −1d to all actions. Level 4: Fatal — you die (or would, without intervention)." },
      { title: "Stress & Push", body: "Push Yourself: spend 2 stress for +1d or a special action. Accept a Devil's Bargain: gain 1 stress for a bonus die from a darker path." },
      { title: "Trauma", body: "Exceeding 9 stress clears stress and marks a trauma. Trauma conditions (Cold, Haunted, Obsessed, etc.) shape roleplay and may trigger special moves." },
    ],
    terms: [
      { term: "fitd:Harm",            type: "owl:Class",              note: "Subclass of Consequence. Has severity 1–4." },
      { term: "fitd:Consequence",     type: "owl:Class",              note: "Superclass: Harm, ReducedEffect, etc." },
      { term: "fitd:Stress",          type: "owl:Class",              note: "Pool 0–9; spent for Push/Resistance." },
      { term: "fitd:Trauma",          type: "owl:Class",              note: "Permanent condition from overflow stress." },
      { term: "fitd:stressLevel",     type: "owl:DatatypeProperty",   note: "xsd:integer 0–9." },
      { term: "fitd:harmSeverity",    type: "owl:DatatypeProperty",   note: "xsd:integer 1–4." },
      { term: "fitd:PushYourself",    type: "owl:NamedIndividual",    note: "2 stress → +1d or special action." },
      { term: "fitd:DevilsBargain",   type: "owl:NamedIndividual",    note: "+1 stress for an extra die." },
    ],
  },
  {
    id: "clocks",
    num: "§07",
    title: "Progress Clocks",
    subtitle: "Tracking complex tasks, threats, and long-term projects",
    intro: "A progress clock is a circle divided into 4, 6, 8, or 12 segments. Segments fill as characters work toward a goal or as a threat advances toward them.",
    cards: [
      { title: "Obstacle Clock", body: "Tracks a single challenge or task. When full, the obstacle is overcome or the task complete." },
      { title: "Race Clock", body: "Two clocks competing — the crew's progress vs an opposing threat. First to fill wins." },
      { title: "Project Clock", body: "Long-term activity spanning multiple scores (downtime projects, faction schemes, healing)." },
    ],
    terms: [
      { term: "fitd:ProgressClock",   type: "owl:Class",             note: "Core class for all clock types." },
      { term: "fitd:clockSize",       type: "owl:DatatypeProperty",  note: "xsd:integer ∈ {4, 6, 8, 12}." },
      { term: "fitd:segmentsFilled",  type: "owl:DatatypeProperty",  note: "xsd:integer, 0 ≤ n ≤ clockSize." },
      { term: "fitd:clockType",       type: "owl:ObjectProperty",    note: "Links to Obstacle, Race, or Project individual." },
    ],
  },
  {
    id: "score",
    num: "§08",
    title: "Score Lifecycle",
    subtitle: "Planning, execution, and payoff of a heist",
    intro: "A score is any dangerous undertaking the crew attempts. Every score passes through four phases: planning, the score itself (with flashbacks available), and payoff.",
    cards: [
      { title: "Planning", body: "Choose an approach (Assault, Deception, Stealth, Occult, Social, Transport) and a detail. This sets the crew's load and opening position." },
      { title: "Flashback", body: "Any player may call a flashback mid-score to establish a prior action. The GM sets a cost (0–2 stress) and you make the relevant roll." },
      { title: "Payoff", body: "After the score: earn coin and rep, increase or decrease faction status, assign heat and wanted level, then divide XP and advance." },
    ],
    terms: [
      { term: "fitd:Score",       type: "owl:Class",               note: "The full arc of a dangerous undertaking." },
      { term: "fitd:Plan",        type: "owl:Class",               note: "Approach + Detail chosen in planning." },
      { term: "fitd:Approach",    type: "owl:Class",               note: "Six named individuals (Assault, Deception…)." },
      { term: "fitd:Flashback",   type: "owl:Class",               note: "Retroactive action; costs 0–2 stress." },
      { term: "fitd:Payoff",      type: "owl:Class",               note: "Coin, rep, heat, XP distribution." },
    ],
  },
  {
    id: "teamwork",
    num: "§09",
    title: "Teamwork",
    subtitle: "Coordinated actions among crew members",
    intro: "Four teamwork manoeuvres let characters cooperate. Each is available on any action roll where another character could plausibly help.",
    cards: [
      { title: "Assist", body: "Add +1d to another character's roll. You share the risk — if the roll has a bad outcome, you're exposed to any consequences too." },
      { title: "Lead a Group Action", body: "One character leads; every other PC who participates rolls the same action. The leader takes the best result; extra failures add stress to the leader." },
      { title: "Protect", body: "Step in to take a consequence for another character. Make a resistance roll or simply absorb the harm directly." },
      { title: "Set Up", body: "Act first to give the next character better position or increased effect. Requires a successful action roll (not necessarily high)." },
    ],
    terms: [
      { term: "fitd:TeamworkAction",  type: "owl:Class",           note: "Superclass of all four manoeuvres." },
      { term: "fitd:Assist",          type: "owl:NamedIndividual", note: "+1d; share risk." },
      { term: "fitd:LeadGroup",       type: "owl:NamedIndividual", note: "Best result; excess failures → leader stress." },
      { term: "fitd:Protect",         type: "owl:NamedIndividual", note: "Absorb consequence for ally." },
      { term: "fitd:SetUp",           type: "owl:NamedIndividual", note: "Improve position or effect for next roll." },
    ],
  },
  {
    id: "downtime",
    num: "§10",
    title: "Downtime",
    subtitle: "Recovery and advancement between scores",
    intro: "After each score the crew has downtime. Each character gets two downtime activity slots. Activities include personal recovery, projects, and crew upkeep.",
    cards: [
      { title: "Indulge Vice", body: "Clear stress up to your vice purveyor's dice result. Overindulgence clears all stress but causes a problem — lose coins, harm yourself, or betray someone." },
      { title: "Recover", body: "Begin or continue healing physical harm. Requires a healer or a healing environment. Each activity removes a segment from your healing clock." },
      { title: "Long-Term Project", body: "Work on any clock-based project: crafting, research, building a contact, infiltrating a faction. Make a relevant action roll; fill segments." },
      { title: "Train & Reduce Heat", body: "Train: mark 1 XP in an action, attribute, or playbook track. Reduce Heat: lower crew heat by 1–2 via bribes, clean-up, or lying low." },
    ],
    terms: [
      { term: "fitd:DowntimeActivity",  type: "owl:Class",           note: "Superclass of all downtime actions." },
      { term: "fitd:Vice",              type: "owl:Class",           note: "Each character has one vice." },
      { term: "fitd:Recovery",          type: "owl:NamedIndividual", note: "Heal harm segments." },
      { term: "fitd:LongTermProject",   type: "owl:NamedIndividual", note: "Advance a project clock." },
      { term: "fitd:Training",          type: "owl:NamedIndividual", note: "Mark 1 XP." },
      { term: "fitd:ReduceHeat",        type: "owl:NamedIndividual", note: "Lower crew heat 1–2." },
    ],
  },
  {
    id: "crew",
    num: "§11",
    title: "Crew & Factions",
    subtitle: "The crew sheet, faction web, and claims map",
    intro: "The crew is the player characters' criminal organization. It has its own tier, hold, reputation, heat, and faction relationships. Factions each have their own tier and disposition toward the crew.",
    cards: [
      { title: "Tier & Hold", body: "Tier (0–4) represents the crew's power level — resources, scale, and influence. Hold (weak/strong) determines stability when things go wrong." },
      { title: "Rep & Heat", body: "Rep tracks notoriety gained from daring scores. Heat tracks how much law enforcement attention the crew has drawn. Wanted level triggers entanglements." },
      { title: "Faction Standings", body: "Each faction has a status with the crew: −3 (at war) to +3 (allied). Scores affect standings. Allies provide assets; enemies cause complications." },
      { title: "Claims", body: "The crew's turf: connected nodes on a claims map. Each claim provides an ongoing benefit. Expanding claims requires defeating or negotiating with their current holders." },
    ],
    terms: [
      { term: "fitd:Crew",            type: "owl:Class",              note: "Player character organization." },
      { term: "fitd:Faction",         type: "owl:Class",              note: "NPC organization with tier and status." },
      { term: "fitd:Claim",           type: "owl:Class",              note: "Turf node with ongoing benefit." },
      { term: "fitd:tier",            type: "owl:DatatypeProperty",   note: "xsd:integer 0–4." },
      { term: "fitd:heat",            type: "owl:DatatypeProperty",   note: "xsd:integer 0–9." },
      { term: "fitd:wantedLevel",     type: "owl:DatatypeProperty",   note: "xsd:integer 0–4." },
      { term: "fitd:factionStatus",   type: "owl:DatatypeProperty",   note: "xsd:integer −3 to +3." },
    ],
  },
  {
    id: "crafting",
    num: "§12",
    title: "Cohorts, Crafting & Rituals",
    subtitle: "NPC assets, alchemicals, arcane power, and magnitude",
    intro: "Crews can recruit cohorts, craft items and alchemicals, and perform arcane rituals. All of these are scaled by the Magnitude system.",
    cards: [
      { title: "Cohorts", body: "Expert (single skilled NPC) or Gang (group of fighters/specialists). Each has a type, quality equal to crew tier, and edges/flaws that affect rolls." },
      { title: "Crafting", body: "During downtime, Tinker with materials to create alchemicals, gadgets, or weapons. Roll vs a quality level; fill a project clock. Exceptional items require rare materials." },
      { title: "Rituals", body: "Attune to perform arcane rituals. Each ritual has a cost (stress, ingredients, time) and a power source. Performing a new ritual requires research first." },
      { title: "Magnitude", body: "A universal scale (0–6) for comparing the power of effects, areas, durations, and forces. Used to set effect level for large-scale or supernatural actions." },
    ],
    terms: [
      { term: "fitd:Cohort",          type: "owl:Class",              note: "Expert or Gang NPC asset." },
      { term: "fitd:Expert",          type: "owl:Class",              note: "Single skilled NPC cohort." },
      { term: "fitd:Gang",            type: "owl:Class",              note: "Group cohort; has scale property." },
      { term: "fitd:CraftingProject", type: "owl:Class",              note: "Downtime project to create an item." },
      { term: "fitd:Ritual",          type: "owl:Class",              note: "Arcane working; requires research." },
      { term: "fitd:Magnitude",       type: "owl:Class",              note: "Universal scale 0–6 for power/scope." },
      { term: "fitd:magnitude",       type: "owl:DatatypeProperty",   note: "xsd:integer 0–6." },
    ],
  },
];

/* ─────────────────────────────────────────────── */

export default function Index() {
  const [activeSection, setActiveSection] = useState("dice");

  // Scroll-spy
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = "/fitd.ttl";
    a.download = "fitd.ttl";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-32 min-h-[90vh]">
        {/* top label */}
        <p
          className="uppercase tracking-[0.25em] text-xs mb-10 flex items-center gap-2"
          style={{ color: "hsl(var(--gold))", fontFamily: "var(--font-mono)" }}
        >
          <span className="inline-block w-3 h-px" style={{ background: "hsl(var(--gold))" }} />
          rpg-schema.org — System Reference Document
          <span className="inline-block w-3 h-px" style={{ background: "hsl(var(--gold))" }} />
        </p>

        {/* System name */}
        <h1
          className="text-[clamp(4rem,14vw,9rem)] leading-none font-black uppercase tracking-tight mb-2"
          style={{
            fontFamily: "var(--font-display)",
            color: "hsl(var(--gold))",
            textShadow: "0 2px 40px hsl(var(--gold) / 0.18)",
          }}
        >
          Forged in the Dark
        </h1>

        {/* Tagline / quote */}
        <p
          className="text-xl md:text-2xl italic max-w-xl mt-6 mb-8 leading-relaxed"
          style={{ fontFamily: "var(--font-display)", color: "hsl(var(--foreground) / 0.75)" }}
        >
          "You've assembled your crew. The target is chosen. What could go wrong?"
        </p>

        {/* Attribution line */}
        <p
          className="text-xs uppercase tracking-[0.2em] flex items-center gap-3"
          style={{ color: "hsl(var(--muted-foreground))", fontFamily: "var(--font-mono)" }}
        >
          <span>John Harper</span>
          <span style={{ color: "hsl(var(--gold-dim))" }}>•</span>
          <span>Evil Hat Productions</span>
          <span style={{ color: "hsl(var(--gold-dim))" }}>•</span>
          <span>CC-BY</span>
        </p>
      </section>

      {/* ══════════════════════════════════════════
          STICKY NAV
      ══════════════════════════════════════════ */}
      <nav
        className="sticky top-0 z-50 border-b border-border overflow-x-auto"
        style={{ background: "hsl(var(--background) / 0.97)", backdropFilter: "blur(8px)" }}
      >
        <div className="flex items-center min-w-max px-6">
          {/* Logo / brand */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="shrink-0 mr-6 py-3 pr-6 border-r border-border"
          >
            <img src={fitdLogo} alt="FITD" className="h-6 w-auto" style={{ filter: "invert(1) brightness(0.85)" }} />
          </button>

          {/* Section links */}
          <div className="flex items-center">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => scrollTo(n.id)}
                className="px-3 py-3.5 text-xs uppercase tracking-widest transition-colors whitespace-nowrap"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: activeSection === n.id ? "hsl(var(--gold))" : "hsl(var(--muted-foreground))",
                  borderBottom: activeSection === n.id ? "2px solid hsl(var(--gold))" : "2px solid transparent",
                }}
              >
                {n.label}
              </button>
            ))}
          </div>

          {/* TTL download — separated to the right */}
          <div className="ml-auto pl-6 border-l border-border shrink-0">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-3.5 text-xs uppercase tracking-widest transition-colors"
              style={{ fontFamily: "var(--font-mono)", color: "hsl(var(--gold))" }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = "0.7")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = "1")}
            >
              <DownloadIcon />
              TTL
            </button>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════
          CONTENT SECTIONS
      ══════════════════════════════════════════ */}
      <main className="max-w-5xl mx-auto px-6 py-16 space-y-24">
        {SECTIONS.map((sec) => (
          <section key={sec.id} id={sec.id} className="scroll-mt-16">
            {/* Section header */}
            <div className="mb-8">
              <p
                className="text-sm mb-1"
                style={{ color: "hsl(var(--gold))", fontFamily: "var(--font-mono)" }}
              >
                {sec.num}
              </p>
              <h2
                className="text-4xl md:text-5xl font-bold mb-2"
                style={{ color: "hsl(var(--gold))", fontFamily: "var(--font-display)" }}
              >
                {sec.title}
              </h2>
              <p
                className="text-base italic"
                style={{ color: "hsl(var(--foreground) / 0.6)", fontFamily: "var(--font-display)" }}
              >
                {sec.subtitle}
              </p>
              <div className="mt-4 h-px w-full" style={{ background: "hsl(var(--border))" }} />
            </div>

            {/* Intro */}
            {sec.intro && (
              <p className="mb-8 text-base leading-relaxed" style={{ color: "hsl(var(--foreground) / 0.8)", fontFamily: "var(--font-body)" }}>
                {sec.intro}
              </p>
            )}

            {/* Cards */}
            {sec.cards && (
              <div className={`grid gap-4 mb-10 ${sec.cards.length === 4 ? "sm:grid-cols-2" : sec.cards.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
                {sec.cards.map((card) => (
                  <div
                    key={card.title}
                    className="p-5 border border-border transition-colors"
                    style={{ background: "hsl(var(--card))" }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = "hsl(var(--gold-dim))")}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = "hsl(var(--border))")}
                  >
                    <h3
                      className="text-base font-bold mb-2"
                      style={{ color: "hsl(var(--foreground))", fontFamily: "var(--font-body)" }}
                    >
                      {card.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--foreground) / 0.7)", fontFamily: "var(--font-body)" }}>
                      {card.body}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Terms table */}
            {sec.terms && (
              <div>
                <p
                  className="text-xs uppercase tracking-widest mb-3"
                  style={{ color: "hsl(var(--muted-foreground))", fontFamily: "var(--font-mono)" }}
                >
                  Ontology Terms
                </p>
                <table className="w-full text-sm border border-border">
                  <thead>
                    <tr style={{ background: "hsl(0 0% 6%)" }}>
                      {["Term", "Type", "Notes"].map((h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-2.5 font-mono text-xs tracking-widest border-b border-border"
                          style={{ color: "hsl(var(--muted-foreground))" }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {sec.terms.map((t) => (
                      <tr
                        key={t.term}
                        style={{ background: "hsl(var(--card))" }}
                        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "hsl(0 0% 10%)")}
                        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "hsl(var(--card))")}
                      >
                        <td className="px-4 py-2.5 font-mono text-xs" style={{ color: "hsl(var(--gold))" }}>{t.term}</td>
                        <td className="px-4 py-2.5 font-mono text-xs">
                          <TypeBadge type={t.type} />
                        </td>
                        <td className="px-4 py-2.5 font-mono text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{t.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ))}

        {/* ── ONTOLOGY FILE ── */}
        <section id="ttl" className="scroll-mt-16 pt-8 border-t border-border">
          <p className="text-sm mb-1" style={{ color: "hsl(var(--gold))", fontFamily: "var(--font-mono)" }}>§TTL</p>
          <h2 className="text-4xl font-bold mb-2" style={{ color: "hsl(var(--gold))", fontFamily: "var(--font-display)" }}>Ontology File</h2>
          <p className="italic text-base mb-6" style={{ color: "hsl(var(--foreground) / 0.6)", fontFamily: "var(--font-display)" }}>Download the complete Turtle / OWL 2 file</p>
          <div className="h-px w-full mb-8" style={{ background: "hsl(var(--border))" }} />

          <p className="mb-6 leading-relaxed" style={{ color: "hsl(var(--foreground) / 0.8)", fontFamily: "var(--font-body)" }}>
            <code className="font-mono text-sm px-1.5 py-0.5" style={{ background: "hsl(0 0% 10%)", color: "hsl(var(--gold))" }}>fitd.ttl</code> is a single Turtle file containing the complete
            OWL 2 ontology — 2,523 lines covering all 12 rule modules above. Load it into
            Protégé, Apache Jena, ROBOT, or any OWL-compatible tool. Query it via SPARQL using
            the <code className="font-mono text-sm px-1.5 py-0.5" style={{ background: "hsl(0 0% 10%)", color: "hsl(var(--gold))" }}>fitd:</code> prefix.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-3 px-6 py-3 border border-gold text-sm uppercase tracking-widest transition-all"
              style={{
                fontFamily: "var(--font-mono)",
                color: "hsl(var(--gold))",
                borderColor: "hsl(var(--gold))",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = "hsl(var(--gold))";
                (e.currentTarget as HTMLElement).style.color = "hsl(var(--ink))";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.color = "hsl(var(--gold))";
              }}
            >
              <DownloadIcon />
              Download fitd.ttl
            </button>
            <a
              href={NAMESPACE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border text-sm uppercase tracking-widest transition-colors"
              style={{ fontFamily: "var(--font-mono)", color: "hsl(var(--muted-foreground))", borderColor: "hsl(var(--border))" }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "hsl(var(--foreground))")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "hsl(var(--muted-foreground))")}
            >
              Namespace URI ↗
            </a>
          </div>

          {/* Header snippet */}
          <pre
            className="text-xs p-5 overflow-x-auto border border-border"
            style={{
              background: "hsl(0 0% 4%)",
              fontFamily: "var(--font-mono)",
              lineHeight: 1.8,
              color: "hsl(var(--foreground) / 0.75)",
            }}
          >
{`@prefix fitd:  <https://schema.rpg-schema.org/fitd#> .
@prefix owl:   <http://www.w3.org/2002/07/owl#> .
@prefix rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd:   <http://www.w3.org/2001/XMLSchema#> .
@prefix skos:  <http://www.w3.org/2004/02/skos/core#> .
@prefix dc:    <http://purl.org/dc/elements/1.1/> .

<https://schema.rpg-schema.org/fitd>
    a owl:Ontology ;
    dc:title "Forged in the Dark — General Rules Ontology" ;
    dc:description "OWL ontology for the FitD SRD general rules." ;
    dc:source "Blades in the Dark SRD — John Harper, Evil Hat" ;
    owl:versionInfo "${VERSION}" .`}
          </pre>
        </section>
      </main>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="border-t border-border mt-16" style={{ background: "hsl(0 0% 4%)" }}>
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))", fontFamily: "var(--font-mono)" }}>
            fitd.rpg-schema.org · v{VERSION} · Based on the{" "}
            <em>Blades in the Dark</em> SRD by John Harper · Evil Hat Productions
          </p>
          <a
            href="https://rpg-schema.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs transition-colors"
            style={{ color: "hsl(var(--muted-foreground))", fontFamily: "var(--font-mono)" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "hsl(var(--gold))")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "hsl(var(--muted-foreground))")}
          >
            ← rpg-schema.org
          </a>
        </div>
      </footer>
    </div>
  );
}

/* ── helpers ── */
function TypeBadge({ type }: { type: string }) {
  const palette: Record<string, { bg: string; color: string }> = {
    "owl:Class":             { bg: "hsl(10 70% 35% / 0.25)",  color: "hsl(10 80% 65%)" },
    "owl:NamedIndividual":   { bg: "hsl(210 60% 40% / 0.2)",  color: "hsl(210 80% 70%)" },
    "owl:ObjectProperty":    { bg: "hsl(140 50% 30% / 0.2)",  color: "hsl(140 60% 55%)" },
    "owl:DatatypeProperty":  { bg: "hsl(270 40% 40% / 0.2)",  color: "hsl(270 60% 70%)" },
  };
  const s = palette[type] ?? { bg: "hsl(0 0% 15%)", color: "hsl(0 0% 60%)" };
  return (
    <span className="px-2 py-0.5 text-xs font-mono rounded-sm" style={{ background: s.bg, color: s.color }}>
      {type}
    </span>
  );
}

function DownloadIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
