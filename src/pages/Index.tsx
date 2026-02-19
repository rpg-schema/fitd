import heroBg from "@/assets/hero-bg.jpg";
import fitdLogo from "@/assets/fitd-logo.png";

const NAMESPACE = "https://schema.rpg-schema.org/fitd#";
const VERSION = "1.0.0";
const SOURCE = "Blades in the Dark SRD — John Harper, Evil Hat Productions";

const prefixes = [
  { prefix: "fitd:", uri: "https://schema.rpg-schema.org/fitd#" },
  { prefix: "owl:", uri: "http://www.w3.org/2002/07/owl#" },
  { prefix: "rdf:", uri: "http://www.w3.org/1999/02/22-rdf-syntax-ns#" },
  { prefix: "rdfs:", uri: "http://www.w3.org/2000/01/rdf-schema#" },
  { prefix: "xsd:", uri: "http://www.w3.org/2001/XMLSchema#" },
  { prefix: "skos:", uri: "http://www.w3.org/2004/02/skos/core#" },
  { prefix: "dc:", uri: "http://purl.org/dc/elements/1.1/" },
];

const modules = [
  {
    id: "dice",
    title: "Dice System",
    description: "Result levels — Critical (multiple 6s), Full Success (6), Partial (4–5), Bad Outcome (1–3).",
    classes: ["DiceResult", "Critical", "FullSuccess", "PartialSuccess", "BadOutcome"],
  },
  {
    id: "position",
    title: "Position",
    description: "Three risk positions — Controlled, Risky, and Desperate — representing danger level of an action roll.",
    classes: ["Position", "Controlled", "Risky", "Desperate"],
  },
  {
    id: "effect",
    title: "Effect",
    description: "Three effect levels — Standard, Limited, and Great — representing how impactful a successful action is.",
    classes: ["Effect", "StandardEffect", "LimitedEffect", "GreatEffect"],
  },
  {
    id: "actions",
    title: "Actions & Attributes",
    description: "Twelve action ratings grouped into three attributes: Insight, Prowess, and Resolve.",
    classes: ["Action", "Attribute", "ActionRating", "Insight", "Prowess", "Resolve"],
  },
  {
    id: "rolls",
    title: "Rolls",
    description: "Action rolls, resistance rolls, fortune rolls, and engagement rolls with all their properties.",
    classes: ["ActionRoll", "ResistanceRoll", "FortuneRoll", "EngagementRoll"],
  },
  {
    id: "harm",
    title: "Harm & Stress",
    description: "Harm conditions at four severity levels, stress accumulation, trauma, and healing mechanics.",
    classes: ["Harm", "Stress", "Trauma", "HealingAction"],
  },
  {
    id: "clocks",
    title: "Progress Clocks",
    description: "Progress clocks track complex tasks, threats, and long-term projects with segment-based advancement.",
    classes: ["ProgressClock", "ClockSegment", "ClockAdvance"],
  },
  {
    id: "score",
    title: "Score Lifecycle",
    description: "The full arc of a heist or score: planning, approach, execution, and payoff.",
    classes: ["Score", "Plan", "Approach", "Detail", "Payoff"],
  },
  {
    id: "teamwork",
    title: "Teamwork",
    description: "Assist, lead a group action, protect, set up — coordinated actions among crew members.",
    classes: ["TeamworkAction", "Assist", "LeadGroup", "Protect", "SetUp"],
  },
  {
    id: "downtime",
    title: "Downtime",
    description: "Between-score recovery and advancement: indulge vice, recover, long-term projects, train, reduce heat.",
    classes: ["DowntimeActivity", "Vice", "Recovery", "LongTermProject", "Training"],
  },
  {
    id: "crew",
    title: "Crew & Factions",
    description: "Crew sheet, tier, hold, rep, heat, wanted level, faction standings, and claims map.",
    classes: ["Crew", "Faction", "Tier", "Claim", "FactionRelation"],
  },
  {
    id: "cohorts",
    title: "Cohorts & Crafting",
    description: "Expert and gang cohorts, crafting projects, alchemicals, rituals, and magnitude ratings.",
    classes: ["Cohort", "Expert", "Gang", "CraftingProject", "Ritual", "Magnitude"],
  },
];

const stats = [
  { label: "OWL Classes", value: "80+" },
  { label: "Named Individuals", value: "150+" },
  { label: "Object Properties", value: "60+" },
  { label: "Data Properties", value: "40+" },
  { label: "Rules Modules", value: "12" },
  { label: "TTL Lines", value: "2,523" },
];

export default function Index() {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/fitd.ttl";
    link.download = "fitd.ttl";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── HERO ── */}
      <header className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "var(--gradient-hero)" }}
        />

        <div className="relative container mx-auto max-w-5xl px-6 py-24 flex flex-col items-center text-center gap-8">
          {/* Logo */}
          <div className="animate-fade-up">
            <img
              src={fitdLogo}
              alt="Forged in the Dark"
              className="h-28 w-auto object-contain"
              style={{ filter: "drop-shadow(0 4px 20px hsl(10 78% 48% / 0.6))" }}
            />
          </div>

          {/* Title block */}
          <div className="animate-fade-up" style={{ animationDelay: "0.15s", opacity: 0 }}>
            <div className="inline-block bg-ember px-3 py-1 text-xs font-mono tracking-widest mb-4" style={{ color: "hsl(var(--primary-foreground))" }}>
              OWL ONTOLOGY · v{VERSION}
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-none tracking-wide mb-4">
              FITD Schema
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto" style={{ color: "hsl(var(--muted-foreground))", fontFamily: "var(--font-body)" }}>
              A formal OWL ontology for the <em>Forged in the Dark</em> SRD — 
              covering every rule, mechanic, and concept from the Blades in the Dark system 
              as machine-readable linked data.
            </p>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: "0.3s", opacity: 0 }}>
            <button
              onClick={handleDownload}
              className="animate-glow-pulse group flex items-center gap-3 px-8 py-4 font-display text-lg tracking-wider transition-all duration-200"
              style={{
                background: "var(--gradient-ember)",
                color: "hsl(var(--primary-foreground))",
                boxShadow: "var(--shadow-ember)",
              }}
            >
              <DownloadIcon />
              DOWNLOAD fitd.ttl
            </button>
            <a
              href={`https://schema.rpg-schema.org/fitd`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 font-display text-lg tracking-wider border transition-all duration-200 hover:border-forge-gold"
              style={{
                borderColor: "hsl(var(--border))",
                color: "hsl(var(--foreground))",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "hsl(var(--forge-gold))")}
              onMouseLeave={e => (e.currentTarget.style.color = "hsl(var(--foreground))")}
            >
              <ExternalIcon />
              NAMESPACE
            </a>
          </div>

          {/* Namespace URI */}
          <div
            className="font-mono text-sm px-4 py-2 border border-border/50 animate-fade-up"
            style={{ animationDelay: "0.45s", opacity: 0, color: "hsl(var(--forge-gold))", background: "hsl(0 0% 0% / 0.5)" }}
          >
            {NAMESPACE}
          </div>
        </div>
      </header>

      {/* ── STATS BAR ── */}
      <section
        className="border-y border-border"
        style={{ background: "hsl(0 0% 0% / 0.5)" }}
      >
        <div className="container mx-auto max-w-5xl px-6 py-6">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-0 divide-x divide-border">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center py-2 px-4 text-center">
                <span className="font-display text-2xl font-bold" style={{ color: "hsl(var(--ember))" }}>
                  {s.value}
                </span>
                <span className="font-mono text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="container mx-auto max-w-5xl px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <SectionLabel>About the Ontology</SectionLabel>
            <h2 className="text-3xl font-display mb-6">What is fitd.ttl?</h2>
            <div className="space-y-4 text-foreground/80" style={{ fontFamily: "var(--font-body)" }}>
              <p>
                <strong className="text-foreground">fitd.ttl</strong> is a complete OWL (Web Ontology Language) 
                description of the <em>Forged in the Dark</em> system, expressed in Turtle (TTL) syntax. 
                It formally defines every class, individual, property, and relationship in the SRD as linked data.
              </p>
              <p>
                Derived strictly from the <em>Blades in the Dark</em> SRD by John Harper / Evil Hat Productions, 
                this ontology is part of the <strong className="text-foreground">RPG Schema</strong> initiative — 
                a community effort to make tabletop RPG rules interoperable, queryable, and machine-readable.
              </p>
              <p>
                Use it to build tools, validators, character apps, campaign managers, or any software 
                that needs a formal model of FitD mechanics.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <SectionLabel>Ontology Metadata</SectionLabel>
            <MetaTable
              rows={[
                ["Title", "Forged in the Dark — General Rules Ontology"],
                ["Version", VERSION],
                ["Format", "Turtle (TTL) / OWL 2"],
                ["Namespace", NAMESPACE],
                ["Source", SOURCE],
                ["License", "Based on FitD SRD (CC-BY)"],
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── PREFIXES ── */}
      <section style={{ background: "hsl(0 0% 7%)" }} className="border-y border-border">
        <div className="container mx-auto max-w-5xl px-6 py-12">
          <SectionLabel>Namespace Prefixes</SectionLabel>
          <h2 className="text-2xl font-display mb-6">Declared Prefixes</h2>
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-sm">
              <thead>
                <tr className="border-b border-border text-left" style={{ color: "hsl(var(--muted-foreground))" }}>
                  <th className="pb-3 pr-8 font-semibold tracking-wider text-xs uppercase">Prefix</th>
                  <th className="pb-3 font-semibold tracking-wider text-xs uppercase">URI</th>
                </tr>
              </thead>
              <tbody>
                {prefixes.map((p, i) => (
                  <tr
                    key={p.prefix}
                    className="border-b border-border/40 transition-colors"
                    style={{ animationDelay: `${i * 0.05}s` }}
                    onMouseEnter={e => (e.currentTarget.style.background = "hsl(0 0% 10%)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="py-3 pr-8" style={{ color: "hsl(var(--ember))" }}>
                      <code>{p.prefix}</code>
                    </td>
                    <td className="py-3" style={{ color: "hsl(var(--muted-foreground))" }}>
                      <code>{p.uri}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── MODULES ── */}
      <section className="container mx-auto max-w-5xl px-6 py-16">
        <SectionLabel>Coverage</SectionLabel>
        <h2 className="text-3xl font-display mb-2">Rule Modules</h2>
        <p className="mb-10" style={{ color: "hsl(var(--muted-foreground))", fontFamily: "var(--font-body)" }}>
          The ontology covers the complete FitD rule set across {modules.length} modules.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((mod) => (
            <div
              key={mod.id}
              className="border border-border p-5 transition-all duration-200 group"
              style={{ background: "hsl(var(--carbon))" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "hsl(var(--ember) / 0.5)";
                (e.currentTarget as HTMLElement).style.background = "hsl(0 0% 9%)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "hsl(var(--border))";
                (e.currentTarget as HTMLElement).style.background = "hsl(var(--carbon))";
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-5 rounded-sm" style={{ background: "var(--gradient-ember)" }} />
                <h3 className="font-display text-base tracking-wider">{mod.title}</h3>
              </div>
              <p className="text-sm mb-4" style={{ color: "hsl(var(--muted-foreground))", fontFamily: "var(--font-body)", lineHeight: 1.6 }}>
                {mod.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {mod.classes.map((cls) => (
                  <code
                    key={cls}
                    className="text-xs px-2 py-0.5 rounded-sm"
                    style={{
                      background: "hsl(var(--iron))",
                      color: "hsl(var(--forge-gold))",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {cls}
                  </code>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── USAGE EXAMPLE ── */}
      <section style={{ background: "hsl(0 0% 7%)" }} className="border-y border-border">
        <div className="container mx-auto max-w-5xl px-6 py-12">
          <SectionLabel>Usage</SectionLabel>
          <h2 className="text-2xl font-display mb-6">Quick Start</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-mono mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>SPARQL Query (select all action classes)</p>
              <pre
                className="text-sm p-4 overflow-x-auto border border-border rounded-sm"
                style={{
                  background: "hsl(0 0% 4%)",
                  color: "hsl(var(--foreground))",
                  fontFamily: "var(--font-mono)",
                  lineHeight: 1.7,
                }}
              >
{`PREFIX fitd: <https://schema.rpg-schema.org/fitd#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?class ?label ?comment WHERE {
  ?class rdfs:subClassOf fitd:Action .
  OPTIONAL { ?class rdfs:label ?label }
  OPTIONAL { ?class rdfs:comment ?comment }
}`}
              </pre>
            </div>
            <div>
              <p className="text-sm font-mono mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>Turtle snippet (Action Roll)</p>
              <pre
                className="text-sm p-4 overflow-x-auto border border-border rounded-sm"
                style={{
                  background: "hsl(0 0% 4%)",
                  color: "hsl(var(--foreground))",
                  fontFamily: "var(--font-mono)",
                  lineHeight: 1.7,
                }}
              >
{`fitd:ActionRoll
  a owl:Class ;
  rdfs:label "Action Roll" ;
  rdfs:comment "A roll made using one of
    the 12 action ratings. Results depend
    on dice total and position." ;
  fitd:usesPosition fitd:Position ;
  fitd:producesResult fitd:DiceResult .`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ── DOWNLOAD CTA ── */}
      <section className="container mx-auto max-w-5xl px-6 py-20">
        <div
          className="relative overflow-hidden border border-ember/30 p-12 text-center"
          style={{ background: "linear-gradient(135deg, hsl(0 0% 8%), hsl(10 20% 10%))" }}
        >
          {/* Decorative corner accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-ember" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-ember" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-ember" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-ember" />

          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 animate-ember-pulse"
            style={{ background: "var(--gradient-ember)", boxShadow: "var(--shadow-ember)" }}
          >
            <DownloadIcon size={28} color="white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-display mb-4">Get the Ontology</h2>
          <p className="max-w-md mx-auto mb-8 text-lg" style={{ color: "hsl(var(--muted-foreground))", fontFamily: "var(--font-body)" }}>
            Download the complete Turtle file and integrate it into your tools, validators, 
            or linked data projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleDownload}
              className="group flex items-center justify-center gap-3 px-10 py-4 font-display text-lg tracking-wider transition-all duration-200"
              style={{
                background: "var(--gradient-ember)",
                color: "hsl(var(--primary-foreground))",
                boxShadow: "var(--shadow-ember)",
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.filter = "brightness(1.1)")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.filter = "brightness(1)")}
            >
              <DownloadIcon />
              DOWNLOAD fitd.ttl
            </button>
            <a
              href="https://github.com/rpg-schema/fitd"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-10 py-4 font-display text-lg tracking-wider border border-border transition-all duration-200"
              style={{ color: "hsl(var(--foreground))" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "hsl(var(--forge-gold))";
                (e.currentTarget as HTMLElement).style.color = "hsl(var(--forge-gold))";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "hsl(var(--border))";
                (e.currentTarget as HTMLElement).style.color = "hsl(var(--foreground))";
              }}
            >
              <GithubIcon />
              VIEW ON GITHUB
            </a>
          </div>
          <p className="mt-6 font-mono text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
            fitd.ttl · {VERSION} · 2,523 lines · Turtle / OWL 2
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="border-t border-border"
        style={{ background: "hsl(0 0% 0% / 0.6)" }}
      >
        <div className="container mx-auto max-w-5xl px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <div className="font-display text-sm tracking-wider mb-1" style={{ color: "hsl(var(--ember))" }}>
              FITD · RPG SCHEMA
            </div>
            <p className="font-mono text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
              fitd.rpg-schema.org
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))", fontFamily: "var(--font-body)" }}>
              Based on the <em>Blades in the Dark</em> SRD by John Harper.
              <br />
              <em>Forged in the Dark</em> is a trademark of Evil Hat Productions.
            </p>
          </div>
          <div>
            <a
              href="https://rpg-schema.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs transition-colors"
              style={{ color: "hsl(var(--muted-foreground))" }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "hsl(var(--forge-gold))")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "hsl(var(--muted-foreground))")}
            >
              rpg-schema.org ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Sub-components ── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase mb-3"
      style={{ color: "hsl(var(--ember))" }}
    >
      <span className="w-4 h-px inline-block" style={{ background: "hsl(var(--ember))" }} />
      {children}
    </div>
  );
}

function MetaTable({ rows }: { rows: [string, string][] }) {
  return (
    <div className="border border-border divide-y divide-border">
      {rows.map(([key, val]) => (
        <div key={key} className="flex">
          <div
            className="w-28 shrink-0 px-3 py-2.5 font-mono text-xs border-r border-border"
            style={{ color: "hsl(var(--muted-foreground))", background: "hsl(0 0% 6%)" }}
          >
            {key}
          </div>
          <div className="flex-1 px-3 py-2.5 font-mono text-xs break-all" style={{ color: "hsl(var(--foreground))", background: "hsl(var(--carbon))" }}>
            {val}
          </div>
        </div>
      ))}
    </div>
  );
}

function DownloadIcon({ size = 20, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}
