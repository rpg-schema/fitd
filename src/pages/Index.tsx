import fitdLogo from "@/assets/fitd-logo.png";

const NAMESPACE = "https://schema.rpg-schema.org/fitd#";
const VERSION = "1.0.0";

const prefixes = [
  { prefix: "fitd:", uri: "https://schema.rpg-schema.org/fitd#" },
  { prefix: "owl:", uri: "http://www.w3.org/2002/07/owl#" },
  { prefix: "rdf:", uri: "http://www.w3.org/1999/02/22-rdf-syntax-ns#" },
  { prefix: "rdfs:", uri: "http://www.w3.org/2000/01/rdf-schema#" },
  { prefix: "xsd:", uri: "http://www.w3.org/2001/XMLSchema#" },
  { prefix: "skos:", uri: "http://www.w3.org/2004/02/skos/core#" },
  { prefix: "dc:", uri: "http://purl.org/dc/elements/1.1/" },
];

const modules: {
  id: string;
  number: string;
  title: string;
  description: string;
  classes: { name: string; type: "Class" | "Individual" | "Property"; comment?: string }[];
}[] = [
  {
    id: "dice",
    number: "§1",
    title: "Dice System — Result Levels",
    description:
      "Any dice roll in FitD produces one of four outcome tiers determined by the highest die face. The DiceResult class enumerates these tiers; each tier is a named individual.",
    classes: [
      { name: "DiceResult", type: "Class", comment: "Enumerated class; four outcome tiers." },
      { name: "Critical", type: "Individual", comment: "Multiple 6s. Exceptional outcome." },
      { name: "FullSuccess", type: "Individual", comment: "Highest die is 6. Things go well." },
      { name: "PartialSuccess", type: "Individual", comment: "Highest die 4–5. Goal achieved with consequences." },
      { name: "BadOutcome", type: "Individual", comment: "Highest die 1–3. Things go poorly." },
    ],
  },
  {
    id: "position",
    number: "§2",
    title: "Position",
    description:
      "Position indicates how dangerous the situation is for the character. It is set before an action roll and governs the severity of consequences.",
    classes: [
      { name: "Position", type: "Class", comment: "Controlled · Risky · Desperate." },
      { name: "Controlled", type: "Individual", comment: "Least risky. Consequences are minor." },
      { name: "Risky", type: "Individual", comment: "Default position. Standard danger." },
      { name: "Desperate", type: "Individual", comment: "Most dangerous. Severe consequences." },
    ],
  },
  {
    id: "effect",
    number: "§3",
    title: "Effect",
    description:
      "Effect measures how much impact a successful roll achieves. Three levels: Limited, Standard, and Great.",
    classes: [
      { name: "Effect", type: "Class", comment: "Enumerated class for effect levels." },
      { name: "LimitedEffect", type: "Individual", comment: "Partial or incomplete impact." },
      { name: "StandardEffect", type: "Individual", comment: "Normal impact." },
      { name: "GreatEffect", type: "Individual", comment: "Exceptional impact." },
    ],
  },
  {
    id: "actions",
    number: "§4",
    title: "Actions & Attributes",
    description:
      "Twelve action ratings grouped into three attributes. Each action is a named individual; each attribute is an owl:Class with a hasAction restriction over its member actions.",
    classes: [
      { name: "Action", type: "Class" },
      { name: "Attribute", type: "Class" },
      { name: "Insight", type: "Class", comment: "Hunt · Study · Survey · Tinker" },
      { name: "Prowess", type: "Class", comment: "Finesse · Prowl · Skirmish · Wreck" },
      { name: "Resolve", type: "Class", comment: "Attune · Command · Consort · Sway" },
      { name: "ActionRating", type: "Property", comment: "xsd:integer 0–4." },
    ],
  },
  {
    id: "rolls",
    number: "§5",
    title: "Rolls",
    description:
      "Four roll types each modelled as an OWL class with object and data properties linking position, effect, action, attribute, and result.",
    classes: [
      { name: "ActionRoll", type: "Class", comment: "Uses action rating. Governed by Position." },
      { name: "ResistanceRoll", type: "Class", comment: "Uses attribute. Clears or reduces consequences." },
      { name: "FortuneRoll", type: "Class", comment: "GM-controlled; no action rating required." },
      { name: "EngagementRoll", type: "Class", comment: "Determines starting position of a score." },
    ],
  },
  {
    id: "consequences",
    number: "§6",
    title: "Consequences & Harm",
    description:
      "Consequences are what happens on a bad or partial outcome. Harm is a subtype with four severity levels (1–4). Characters may resist consequences with a resistance roll.",
    classes: [
      { name: "Consequence", type: "Class" },
      { name: "Harm", type: "Class", comment: "Subclass of Consequence. Severity 1–4." },
      { name: "ReducedEffect", type: "Individual" },
      { name: "Complication", type: "Individual" },
      { name: "LostOpportunity", type: "Individual" },
      { name: "WorsePosition", type: "Individual" },
    ],
  },
  {
    id: "stress",
    number: "§7",
    title: "Stress & Trauma",
    description:
      "Characters track stress (0–9) and may push themselves or accept devil's bargains. Exceeding 9 stress causes trauma; each trauma condition is a named individual.",
    classes: [
      { name: "Stress", type: "Class" },
      { name: "Trauma", type: "Class" },
      { name: "stressLevel", type: "Property", comment: "xsd:integer 0–9." },
      { name: "PushYourself", type: "Individual" },
      { name: "DevilsBargain", type: "Individual" },
    ],
  },
  {
    id: "clocks",
    number: "§8",
    title: "Progress Clocks",
    description:
      "A progress clock is a circle divided into segments (4, 6, 8, or 12). Segments are filled to track complex tasks, growing threats, or long-term projects.",
    classes: [
      { name: "ProgressClock", type: "Class" },
      { name: "clockSize", type: "Property", comment: "xsd:integer {4,6,8,12}." },
      { name: "segmentsFilled", type: "Property", comment: "xsd:integer." },
      { name: "clockType", type: "Property", comment: "Obstacle · Race · Project." },
    ],
  },
  {
    id: "score",
    number: "§9",
    title: "Score Lifecycle",
    description:
      "A score has four phases: planning (choose approach & detail), flashback window, execution (action rolls), and payoff (coin, rep, heat, xp).",
    classes: [
      { name: "Score", type: "Class" },
      { name: "Plan", type: "Class" },
      { name: "Approach", type: "Class", comment: "Assault · Deception · Stealth · Occult · Social · Transport" },
      { name: "Payoff", type: "Class" },
      { name: "Flashback", type: "Class" },
    ],
  },
  {
    id: "teamwork",
    number: "§10",
    title: "Teamwork",
    description:
      "Four teamwork manoeuvres allow characters to cooperate. Each is modelled as a named individual of the TeamworkAction class.",
    classes: [
      { name: "TeamworkAction", type: "Class" },
      { name: "Assist", type: "Individual", comment: "+1d to another character's roll." },
      { name: "LeadGroup", type: "Individual", comment: "One character leads; others contribute." },
      { name: "Protect", type: "Individual", comment: "Take a consequence for another." },
      { name: "SetUp", type: "Individual", comment: "Improve position or effect for the next roll." },
    ],
  },
  {
    id: "downtime",
    number: "§11",
    title: "Downtime",
    description:
      "Between scores characters take downtime actions: indulge vice, recover, work on long-term projects, train, or reduce heat.",
    classes: [
      { name: "DowntimeActivity", type: "Class" },
      { name: "Vice", type: "Class" },
      { name: "Recovery", type: "Individual" },
      { name: "LongTermProject", type: "Individual" },
      { name: "Training", type: "Individual" },
      { name: "ReduceHeat", type: "Individual" },
    ],
  },
  {
    id: "crew",
    number: "§12",
    title: "Crew, Factions & Cohorts",
    description:
      "The crew sheet, faction standings, tier, hold, rep, heat, wanted level, claims map, and cohort statistics are all represented as OWL classes and data properties.",
    classes: [
      { name: "Crew", type: "Class" },
      { name: "Faction", type: "Class" },
      { name: "Tier", type: "Property", comment: "xsd:integer 0–4." },
      { name: "Claim", type: "Class" },
      { name: "Cohort", type: "Class" },
      { name: "Expert", type: "Class" },
      { name: "Gang", type: "Class" },
      { name: "CraftingProject", type: "Class" },
      { name: "Ritual", type: "Class" },
      { name: "Magnitude", type: "Class" },
    ],
  },
];

export default function Index() {
  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = "/fitd.ttl";
    a.download = "fitd.ttl";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── HEADER ── */}
      <header className="border-b border-border" style={{ background: "hsl(0 0% 0%)" }}>
        <div className="container mx-auto max-w-4xl px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <img
            src={fitdLogo}
            alt="Forged in the Dark"
            className="h-14 w-auto object-contain shrink-0"
            style={{ filter: "invert(1) brightness(0.9)" }}
          />
          <div className="border-l border-border pl-6 hidden sm:block self-stretch" />
          <div>
            <div className="font-mono text-xs tracking-widest mb-1" style={{ color: "hsl(var(--ember))" }}>
              OWL ONTOLOGY · v{VERSION} · TURTLE
            </div>
            <h1 className="font-display text-2xl leading-tight">
              Forged in the Dark — General Rules Ontology
            </h1>
            <p className="font-mono text-xs mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
              {NAMESPACE}
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-6 py-12 space-y-16">

        {/* ── OVERVIEW ── */}
        <section>
          <Rule label="Overview" />
          <p className="text-foreground/85 leading-relaxed mb-4" style={{ fontFamily: "var(--font-body)", fontSize: "1.05rem" }}>
            This document is the human-readable reference for <code className="font-mono text-sm px-1.5 py-0.5 rounded-sm" style={{ background: "hsl(var(--iron))", color: "hsl(var(--forge-gold))" }}>fitd.ttl</code> — 
            a formal OWL 2 ontology for the <em>Forged in the Dark</em> System Reference Document. 
            It models every rule, mechanic, and concept as machine-readable linked data, 
            derived strictly from the <em>Blades in the Dark</em> SRD by John Harper / Evil Hat Productions.
          </p>
          <p className="text-foreground/85 leading-relaxed" style={{ fontFamily: "var(--font-body)", fontSize: "1.05rem" }}>
            The ontology is structured into twelve modules corresponding to major rule sections. 
            Each module defines OWL classes, named individuals, and object or data properties. 
            All terms live in the <code className="font-mono text-sm px-1.5 py-0.5 rounded-sm" style={{ background: "hsl(var(--iron))", color: "hsl(var(--forge-gold))" }}>fitd:</code> namespace.
          </p>

          {/* Meta table */}
          <div className="mt-8 border border-border divide-y divide-border">
            {[
              ["Ontology URI", "https://schema.rpg-schema.org/fitd"],
              ["Default prefix", "fitd:"],
              ["Namespace", NAMESPACE],
              ["Version", VERSION],
              ["Format", "Turtle (TTL) / OWL 2"],
              ["Source", "Blades in the Dark SRD — John Harper, Evil Hat Productions"],
              ["License", "Based on FitD SRD (CC-BY)"],
            ].map(([k, v]) => (
              <div key={k} className="flex text-sm">
                <div
                  className="w-36 shrink-0 px-4 py-2.5 font-mono text-xs border-r border-border"
                  style={{ background: "hsl(0 0% 6%)", color: "hsl(var(--muted-foreground))" }}
                >
                  {k}
                </div>
                <div className="flex-1 px-4 py-2.5 font-mono text-xs break-all" style={{ background: "hsl(var(--carbon))" }}>
                  {v}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PREFIXES ── */}
        <section>
          <Rule label="Namespace Declarations" />
          <p className="text-foreground/75 text-sm mb-5" style={{ fontFamily: "var(--font-body)" }}>
            The following prefix declarations appear at the top of the Turtle file and must be in scope for any SPARQL query against the ontology.
          </p>
          <table className="w-full text-sm border border-border">
            <thead>
              <tr style={{ background: "hsl(0 0% 6%)" }}>
                <Th>Prefix</Th>
                <Th>URI</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {prefixes.map((p) => (
                <tr key={p.prefix} className="transition-colors" style={{ background: "hsl(var(--carbon))" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "hsl(0 0% 10%)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "hsl(var(--carbon))")}
                >
                  <Td highlight>{p.prefix}</Td>
                  <Td>{p.uri}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* ── MODULES ── */}
        {modules.map((mod) => (
          <section key={mod.id} id={mod.id}>
            <Rule label={`${mod.number} ${mod.title}`} />
            <p className="text-foreground/80 mb-6" style={{ fontFamily: "var(--font-body)", fontSize: "1.05rem", lineHeight: 1.75 }}>
              {mod.description}
            </p>
            <table className="w-full text-sm border border-border">
              <thead>
                <tr style={{ background: "hsl(0 0% 6%)" }}>
                  <Th>Term</Th>
                  <Th>Type</Th>
                  <Th>Notes</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mod.classes.map((c) => (
                  <tr
                    key={c.name}
                    className="transition-colors"
                    style={{ background: "hsl(var(--carbon))" }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "hsl(0 0% 10%)")}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "hsl(var(--carbon))")}
                  >
                    <Td highlight>fitd:{c.name}</Td>
                    <Td>
                      <TypeBadge type={c.type} />
                    </Td>
                    <Td muted>{c.comment ?? "—"}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))}

        {/* ── DOWNLOAD ── */}
        <section id="download">
          <Rule label="Ontology File" />
          <p className="text-foreground/80 mb-6" style={{ fontFamily: "var(--font-body)", fontSize: "1.05rem" }}>
            The complete ontology is distributed as a single Turtle file. 
            It can be loaded into any OWL-compatible tool (Protégé, ROBOT, Apache Jena, etc.) 
            or queried directly via SPARQL.
          </p>

          {/* File card */}
          <div className="border border-border" style={{ background: "hsl(var(--carbon))" }}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-border" style={{ background: "hsl(0 0% 6%)" }}>
              <div className="flex items-center gap-3">
                <FileIcon />
                <div>
                  <div className="font-mono text-sm font-semibold">fitd.ttl</div>
                  <div className="font-mono text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                    Turtle · OWL 2 · v{VERSION} · 2,523 lines
                  </div>
                </div>
              </div>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-5 py-2.5 font-display text-sm tracking-wider transition-all"
                style={{
                  background: "var(--gradient-ember)",
                  color: "hsl(var(--primary-foreground))",
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.filter = "brightness(1.12)")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.filter = "brightness(1)")}
              >
                <DownloadIcon />
                DOWNLOAD
              </button>
            </div>
            <div className="px-5 py-3 font-mono text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
              <span className="mr-6">80+ Classes</span>
              <span className="mr-6">150+ Named Individuals</span>
              <span className="mr-6">60+ Object Properties</span>
              <span>40+ Data Properties</span>
            </div>
          </div>

          {/* Turtle snippet */}
          <div className="mt-6">
            <div className="font-mono text-xs px-3 py-2 border border-b-0 border-border" style={{ background: "hsl(0 0% 4%)", color: "hsl(var(--muted-foreground))" }}>
              Ontology header (fitd.ttl excerpt)
            </div>
            <pre
              className="text-sm p-5 overflow-x-auto border border-border"
              style={{
                background: "hsl(0 0% 3%)",
                color: "hsl(var(--foreground))",
                fontFamily: "var(--font-mono)",
                lineHeight: 1.75,
              }}
            >
{`@prefix fitd:  <https://schema.rpg-schema.org/fitd#> .
@prefix owl:   <http://www.w3.org/2002/07/owl#> .
@prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#> .
@prefix dc:    <http://purl.org/dc/elements/1.1/> .

<https://schema.rpg-schema.org/fitd>
    a owl:Ontology ;
    dc:title "Forged in the Dark — General Rules Ontology" ;
    dc:source "Blades in the Dark SRD — John Harper, Evil Hat" ;
    owl:versionInfo "1.0.0" .`}
            </pre>
          </div>

          {/* GitHub */}
          <div className="mt-4 flex items-center gap-3 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
            <span>Also available on</span>
            <a
              href="https://github.com/rpg-schema/fitd"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono transition-colors"
              style={{ color: "hsl(var(--forge-gold))" }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = "0.8")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = "1")}
            >
              <GithubIcon />
              github.com/rpg-schema/fitd
            </a>
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border mt-16" style={{ background: "hsl(0 0% 0% / 0.7)" }}>
        <div className="container mx-auto max-w-4xl px-6 py-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="font-mono text-xs tracking-widest mb-1" style={{ color: "hsl(var(--ember))" }}>
              fitd.rpg-schema.org
            </div>
            <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))", fontFamily: "var(--font-body)" }}>
              Based on the <em>Blades in the Dark</em> SRD · John Harper · Evil Hat Productions
            </p>
          </div>
          <a
            href="https://rpg-schema.org"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs transition-colors"
            style={{ color: "hsl(var(--muted-foreground))" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "hsl(var(--forge-gold))")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "hsl(var(--muted-foreground))")}
          >
            ← rpg-schema.org
          </a>
        </div>
      </footer>
    </div>
  );
}

/* ── Helpers ── */

function Rule({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <h2 className="font-display text-lg tracking-wide shrink-0">{label}</h2>
      <div className="flex-1 h-px" style={{ background: "hsl(var(--border))" }} />
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left px-4 py-2.5 font-mono text-xs tracking-widest border-b border-border" style={{ color: "hsl(var(--muted-foreground))" }}>
      {children}
    </th>
  );
}

function Td({ children, highlight, muted }: { children: React.ReactNode; highlight?: boolean; muted?: boolean }) {
  return (
    <td
      className="px-4 py-2.5 font-mono text-xs align-top"
      style={{
        color: highlight
          ? "hsl(var(--forge-gold))"
          : muted
          ? "hsl(var(--muted-foreground))"
          : "hsl(var(--foreground))",
      }}
    >
      {children}
    </td>
  );
}

function TypeBadge({ type }: { type: "Class" | "Individual" | "Property" }) {
  const colors: Record<string, string> = {
    Class: "hsl(var(--ember) / 0.15)",
    Individual: "hsl(220 60% 50% / 0.15)",
    Property: "hsl(140 50% 40% / 0.15)",
  };
  const text: Record<string, string> = {
    Class: "hsl(var(--ember))",
    Individual: "hsl(210 80% 70%)",
    Property: "hsl(140 60% 55%)",
  };
  return (
    <span
      className="inline-block px-2 py-0.5 text-xs font-mono rounded-sm"
      style={{ background: colors[type], color: text[type] }}
    >
      owl:{type}
    </span>
  );
}

function DownloadIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="hsl(var(--ember))" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}
